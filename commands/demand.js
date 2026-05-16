import { Message, TextChannel } from 'discord.js';
import { memberHasAllRoles } from '../lib.js';
/** @import { Channel } from 'discord.js'; */

export const name = 'demand';
export const description = 'Kindly ask the bot to provide you with something';
export const args = ['<thing to demand>'];
export const hidden = true;

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (!message.member) return;
    if (!memberHasAllRoles(message.member, ['Moderators'])) return;

    /**
     * @param {boolean} on 
     * @param {string | undefined} info 
     */
    const silence = (on, info = undefined) => {
        bot.silenced = on;
        let msg = on ? 'Most bot messages have been silenced' : 'The bot is no longer silent';
        if (info) msg += ' ' + info;
        if (on) msg += ` by ${message.member}`;

        /** @type {Channel | undefined} */
        const logChannel = bot.channels.cache.find(x => !x.isDMBased() && x.name === 'moderation-log');
        if (logChannel?.isSendable()) logChannel.send(msg);
    };

    switch ((args || []).join(' ').trim()) {
        // Demand silence for a few minutes
        case 'silence':
            silence(true, '(for 5 minutes)');
            setTimeout(() => silence(false), 5 * 60 * 1000);
            break;
        case 'mute':
            silence(true, '(until `!demand unmute`)');
            break;
        case 'unmute':
            silence(false);
            break;
    }
}