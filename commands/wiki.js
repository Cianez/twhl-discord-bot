import { Message } from 'discord.js';

export const name = 'wiki';
export const description = 'Posts information about the TWHL wiki.';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    message.channel.send('https://twhl.info/wiki - The wiki contains all of the collective knowledge that the community has acquired over the years. Anybody can edit it!');
}