var Discord = require('discord.js');

module.exports = {
    name: 'twhl',
    description: 'Posts a link to https://twhl.info/',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('Visit today! https://twhl.info/');
    },
};