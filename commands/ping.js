var Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        message.channel.send('Pong!');
    },
};