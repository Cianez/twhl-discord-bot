import { Message } from 'discord.js';

export const name = 'vault';
export const description = 'Posts information about the TWHL map vault.';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    message.channel.send('TWHL\'s Map **Vault**: https://twhl.info/vault');
}