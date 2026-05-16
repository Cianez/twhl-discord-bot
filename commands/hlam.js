import { Message } from 'discord.js';

export const name = 'hlam';
export const description = 'Posts information about Half-Life Asset Manager.';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    message.channel.send('**Half-Life Asset Manager** replaces HLMV and adds many features and improvements. It can be downloaded here: https://github.com/Solokiller/HL_Tools/releases');
}