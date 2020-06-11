const fs = require('fs');
const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const lib = require('./lib');
const child_process = require('child_process');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });
logger.level = 'debug';

// Initialize Discord bot and login
const bot = new Discord.Client();
bot.login(auth.token);

// Set up commands and filters
bot.commands = new Discord.Collection();
bot.filters = new Discord.Collection();

for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

for (const file of fs.readdirSync('./filters').filter(file => file.endsWith('.js'))) {
	const filter = require(`./filters/${file}`);
	bot.filters.set(filter.name, filter);
}

// Whenever the bot is ready
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity('TWHL.info', { type: 'WATCHING' });
});

// Whenever a message is received
bot.on('message', message => {

    if (message.channel instanceof Discord.DMChannel) return; // Ignore DMs
    if (message.author.bot) return; // Ignore bots (including self)

    // Check if it's a command (starts by "!")
    if (message.content.substring(0, 1) == '!') {

        const args = message.content.slice(1).split(/ +/);
        const cmd = args.shift().toLowerCase();
        if (bot.commands.has(cmd)) {
            try {
                bot.commands.get(cmd).execute(message, args, bot);
            } catch (error) {
                logger.error(error);
                message.channel.send('I\'m broken. Talk to an administrator or something.');
            }
        }

    } else {

        for (const f of bot.filters.array()) {
            if (f.matcher.exec(message.content)) {
                f.execute(message, bot);
                break;
            }
        }

    }
});

// Whenever a new member has been added to the guild
bot.on('guildMemberAdd', member => {
    member.guild.channels.cache
        .find(ch => ch.name === 'shoutbox-live')
        .send(`Hi ${member}! :wave: Welcome to the **TWHL Discord Server**! :slight_smile:`);
});

// Whenever a member has been removed from the guild (leaving, kick, ban...)
bot.on('guildMemberRemove', member => {
    member.guild.channels.cache
        .find(ch => ch.name === 'shoutbox-live')
        .send(`${member} just left us... :cry:`);
});
