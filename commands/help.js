var Discord = require('discord.js');
const lib = require('../lib');

const cooldown = 1000 * 60 * 10; // 10 minutes
let lastRun = 0;

module.exports = {
    name: 'help',
    description: 'You already know what this does, because you\'re reading this.',
    hidden: true,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        const now = +new Date();
        const nextAllowedRun = lastRun + cooldown;
        if (nextAllowedRun > now) {
            message.channel.send('This can only be run once every 10 minutes. Stop spamming.');
            return;
        }
        lastRun = now;

        const commands = bot.commands.filter(x => !x.hidden).map(c => `!${c.name} - ${c.description}`);
        commands.sort();
        message.channel.send('Bot commands:\n' + commands.join('\n'));
    },
};