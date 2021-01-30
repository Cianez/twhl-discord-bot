var Discord = require('discord.js');
const lib = require('../lib');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     * @param {Discord.Client} bot
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        const pong = lib.chooseBiased(this.pongs);
        pong.call(this, message, args, bot);
    },
    pongs: [
        /** @param {Discord.Message} message */
        message => {
            message.channel.send('Pong!');
        },
        /** @param {Discord.Message} message */
        message => {
            message.channel.send('Stop pinging me!');
        },
        /** @param {Discord.Message} message */
        async message => {
            const progress = ['🔴','🔴','🔴','🔴','🔴','🔴','🔴','🔴','🔴','🔴'];
            const msg = await message.channel.send('Analysing.');
            await lib.delay(1000);
            await msg.edit('Analysing..')
            await lib.delay(1000);
            await msg.edit('Analysing...')
            await lib.delay(1000);
            for (let i = 0; i <= 10; i++) {
                if (i < 10) progress[i] = '🟡';
                const bar = progress.join('');
                const txt = `Ping abuse detected! Banning <@${message.author.id}>: ${bar} ${i * 10}% complete`;
                await msg.edit(txt);
                await lib.delay(2000);
                progress[i] = '🟢';
            }
            await msg.edit('Ban failed. Reverting to default behaviour.')
            await lib.delay(2000);
            await msg.delete();
            await message.channel.send('Pong!');
        }
    ]
};