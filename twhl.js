import { readdirSync } from 'fs';
import http from 'node:http';
import { json } from 'node:stream/consumers';
import { Client, Collection, DMChannel, MessageFlags } from 'discord.js';
import winston from 'winston';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { logError } from './lib.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { token, clientid, guildid, webhookSecret } = require('./auth.json');

// Configure logger settings
const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Initialize Discord bot and login
/** @type {import('./types/globals').botClient} */
// @ts-expect-error
const bot = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});
bot.login(token);
bot.logger = logger;

// Set up commands and filters
bot.commands = new Collection();
bot.filters = new Collection();
bot.events = new Collection();
bot.webhooks = new Collection();
const slashCommands = [];

for (const file of readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) bot.commands.set(alias, command);
    }
    if (command.slash) {
        const builder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);
        if (command.addOptions) command.addOptions.call(command, builder);
        slashCommands.push(builder.toJSON());
    }
}
if (slashCommands.length > 0) {
    const rest = new REST().setToken(token);

    rest.put(Routes.applicationGuildCommands(clientid, guildid), { body: slashCommands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

for (const file of readdirSync('./filters').filter(file => file.endsWith('.js'))) {
    const filter = require(`./filters/${file}`);
    bot.filters.set(filter.name, filter);
}

for (const file of readdirSync('./events').filter(file => file.endsWith('.js'))) {
    const event = require(`./events/${file}`);
    bot.events.set(event.name, event);
    event.register(bot);
}

for (const file of readdirSync('./webhooks').filter(file => file.endsWith('.js'))) {
    const webhook = require(`./webhooks/${file}`);
    bot.webhooks.set(webhook.name, webhook);
}

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);
	if (!command || !command.executeSlashCommand) {
		await interaction.reply({ content: 'I don\'t understand that command, sorry.', flags: MessageFlags.Ephemeral });
        return;
    }

	try {
		await command.executeSlashCommand.call(command, interaction, bot);
	} catch (error) {
		console.error(error);
        logError(bot, 'command: ' + interaction.commandName, error);
		await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
	}
});

// Whenever a message is received
bot.on('messageCreate', message => {

    if (message.channel instanceof DMChannel) return; // Ignore DMs
    if (message.author.bot) return; // Ignore bots (including self)

    // Check if it's a command (starts by "!")
    if (message.content.substring(0, 1) == '!') {

        const args = message.content.slice(1).split(/ +/);
        const cmd = args.shift()?.toLowerCase();
        if (cmd && bot.commands.has(cmd)) {
            try {
                const c = bot.commands.get(cmd);
                if (c.execute) c.execute.call(c, message, args, bot);
            } catch (error) {
                logger.error(error);
                logError(bot, 'command: ' + cmd, error);
                message.channel.send('I\'m broken. Talk to an administrator or something.');
            }
        }

    } else {
        for (const f of bot.filters.toJSON()) {
            if (!f.matcher || f.matcher.exec(message.content)) {
                try {
                    f.execute(message, bot);
                } catch (error) {
                    logError(bot, 'filter: ' + f.name, error);
                }
                break;
            }
        }

    }
});

// handle webhooks
http.createServer(async (request, response) => {
    if (request.method !== 'POST') {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    const authorization = request.headers['authorization'];
    if (authorization !== `Bearer ${webhookSecret}`) {
        response.statusCode = 401;
        response.end('Unauthorized');
        return;
    }
    
    const path = new URL(request.url ?? '/', `http://localhost`).pathname.substring(1);
    const hook = bot.webhooks.get(path);
    if (!hook || !hook.execute) {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    try {
        const body = await json(request);
        await Promise.resolve(hook.execute(request, response, body, bot));
        response.statusCode = 200;
        response.end('OK');
    } catch (error) {
        logError(bot, 'webhook: ' + path, error);
        response.statusCode = 500;
        response.end('Internal server error');
    }
}).listen(3000, '127.0.0.1');
