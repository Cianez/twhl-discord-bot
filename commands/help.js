import { Message } from 'discord.js';

const cooldown = 1000 * 60 * 10; // 10 minutes
let lastRun = 0;

export const name = 'help';
export const description = 'You already know what this does, because you\'re reading this.';
export const hidden = true;

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    const now = +new Date();
    const nextAllowedRun = lastRun + cooldown;
    if (nextAllowedRun > now) {
        message.channel.send('This can only be run once every 10 minutes. Stop spamming.');
        return;
    }
    lastRun = now;

    const commands = bot.commands
        .filter(x => !x.hidden)
        .map(c => {
            if (c.slash) return `/${c.name} - ${c.description}`;
            else return `!${c.name} - ${c.description}`;
        });
    commands.sort();
    message.channel.send('Bot commands:\n' + commands.join('\n'));
}