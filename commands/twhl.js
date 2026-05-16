import { Message } from 'discord.js';

export const name = 'twhl';
export const description = 'Posts a link to https://twhl.info/';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    message.channel.send('Visit today! https://twhl.info/');
}