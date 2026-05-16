import { Message } from 'discord.js';
import { maybe, choose } from '../lib.js';

export const name = 'the-core';
export const matcher = /the core/ig;

/**
 * @param {Message} message 
 * @param {import('../types/globals').botClient} bot 
 */
export function execute(message, bot) {
    if (bot.silenced === true) return;
    if (message.channel.isDMBased()) return;
    if (message.channel.name !== 'shoutbox-live') return; // only in the shoutbox channel


    // Let's have some positivity for a change!
    maybe(() => {
        if (!message.channel.isSendable()) return;

        let msg = choose([
            'Release date: Unknown :(',
            'You mean that amazing mod that everybody\'s looking forward to?',
            'I\'m pretty sure that mod is coming out soon and it\'ll be really cool!',
            'Urby, I know I\'m just a bot, but you can do it! The Core\'s going to be great!',
            'RELEASE THE CORE - 2024! It\'s happening!!'
        ]);
        message.channel.send(msg);
    });
}