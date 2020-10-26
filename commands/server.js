var Discord = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Posts information about the TWHL HLDM server.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('TWHL\'s **Half-Life Server**: steam://connect/62.104.168.193:27015');
    },
};