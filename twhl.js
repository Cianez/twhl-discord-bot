const fs = require('fs');
const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });
logger.level = 'debug';

// Initialize Discord bot and login
const bot = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MEMBERS','GUILD_MESSAGES']
});
bot.login(auth.token);
bot.logger = logger;

// Set up commands and filters
bot.commands = new Discord.Collection();
bot.filters = new Discord.Collection();
bot.events = new Discord.Collection();
const slashCommands = [];

for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    if (command.slash) {
        const builder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);
        if (command.addOptions) command.addOptions.call(command, builder);
        slashCommands.push(builder.toJSON());
    }
}
if (slashCommands.length > 0) {
    const rest = new REST({ version: '9' }).setToken(auth.token);

    rest.put(Routes.applicationGuildCommands(auth.clientid, auth.guildid), { body: slashCommands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

for (const file of fs.readdirSync('./filters').filter(file => file.endsWith('.js'))) {
    const filter = require(`./filters/${file}`);
    bot.filters.set(filter.name, filter);
}

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
    const event = require(`./events/${file}`);
    bot.events.set(event.name, event);
    event.register(bot);
}

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);
	if (!command || !command.executeSlashCommand) {
		await interaction.reply({ content: 'I don\'t understand that command, sorry.', ephemeral: true });
        return;
    }

	try {
		await command.executeSlashCommand.call(command, interaction, bot);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Whenever a message is received
bot.on('messageCreate', message => {

    if (message.channel instanceof Discord.DMChannel) return; // Ignore DMs
    if (message.author.bot) return; // Ignore bots (including self)

    // Check if it's a command (starts by "!")
    if (message.content.substring(0, 1) == '!') {

        const args = message.content.slice(1).split(/ +/);
        const cmd = args.shift().toLowerCase();
        if (bot.commands.has(cmd)) {
            try {
                const c = bot.commands.get(cmd);
                if (c.execute) c.execute.call(c, message, args, bot);
            } catch (error) {
                logger.error(error);
                message.channel.send('I\'m broken. Talk to an administrator or something.');
            }
        }

    } else {
        for (const f of bot.filters.toJSON()) {
            if (f.matcher.exec(message.content)) {
                f.execute(message, bot);
                break;
            }
        }

    }
});
