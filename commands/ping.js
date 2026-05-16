import { Message } from 'discord.js';
import { chooseBiased, delay } from '../lib.js';

export const name = 'ping';
export const description = 'Ping!';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    const pong = chooseBiased(pongs);
    pong.call(null, message, args, bot);
}

/** @type {Array<(message : Message, args? : Array<string>, bot? : import('../types/globals').botClient) => void>} */
const pongs = [
    /** @param {Message} message */
    message => {
        if (message.channel.isSendable()) message.channel.send('Pong!');
    },
    /** @param {Message} message */
    message => {
        if (message.channel.isSendable()) message.channel.send('Stop pinging me!');
    },
    /** @param {Message} message */
    async (message) => {
        if (!message.channel.isSendable()) return;

        const progress = ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'];
        const msg = await message.channel.send('Analysing.');
        await delay(1000);
        await msg.edit('Analysing..');
        await delay(1000);
        await msg.edit('Analysing...');
        await delay(1000);
        for (let i = 0; i <= 10; i++) {
            if (i < 10) progress[i] = '🟡';
            const bar = progress.join('');
            const txt = `Ping abuse detected! Banning <@${message.author.id}>: ${bar} ${i * 10}% complete`;
            await msg.edit(txt);
            await delay(2000);
            progress[i] = '🟢';
        }
        await msg.edit('Ban failed. Reverting to default behaviour.');
        await delay(2000);
        await msg.delete();
        await message.channel.send('Pong!');
    }
];