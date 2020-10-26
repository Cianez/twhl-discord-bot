var Discord = require('discord.js');
const lib = require('../lib');

module.exports = {
    name: 'demand',
    description: 'Kindly ask the bot to provide you with something',
    args: ['<thing to demand>'],
    hidden: true,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     * @param {Discord.Client} bot
     */
    execute(message, args, bot) {
        if (!lib.memberHasAllRoles(message.member, ['Moderators'])) return;

        const silence = (on, info) => {
            bot.silenced = on;
            let msg = on ? 'Most bot messages have been silenced' : 'The bot is no longer silent';
            if (info) msg += ' ' + info;
            if (on) msg += ` by ${message.member}`;
            
            /** @type {Discord.TextChannel} */
            const logChannel = bot.channels.cache.find(x => x.name === 'moderation-log');
            if (logChannel) logChannel.send(msg);
        };

        switch ((args || []).join(' ').trim()) {
            // Demand silence for a few minutes
            case 'silence':
                silence(true, '(for 5 minutes)');
                bot.setTimeout(() => silence(false), 5 * 60 * 1000);
                break;
            case 'mute':
                silence(true, '(until `!demand unmute`)')
                break;
            case 'unmute':
                silence(false)
                break;
        }
    },
};