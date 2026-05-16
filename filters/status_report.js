import { Message } from 'discord.js';
import { maybe, choose } from '../lib.js';

const cooldown = 1000 * 60 * 10; // 10 minutes
let lastRun = 0;

export const name = 'status-report';
export const matcher = /status report/ig;

/**
 * @param {Message} message 
 * @param {import('../types/globals').botClient} bot 
 */
export function execute(message, bot) {
    if (bot.silenced === true) return;

    maybe(() => {
        if (!message.channel.isSendable()) return;
        
        const now = +new Date();
        const nextAllowedRun = lastRun + cooldown;
        if (nextAllowedRun > now) {
            return;
        }
        lastRun = now;

        const responses = [
            // More likely to use the default response
            'Did you submit your status report to the administrator today?',
            'Did you submit your status report to the administrator today?',
            `<@${message.author.id}>, I hope you've submitted your status report to the administrator.`,
            `Did someone say "status report"? Because you should submit that to the administrator.`,
            `People are still referencing status reports? That joke died ages ago, you know.`
        ];
        message.channel.send(choose(responses));
    });
}