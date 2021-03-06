var Discord = require('discord.js');

module.exports = {
    name: 'hlmv',
    description: 'Posts information about HLMV.',
    hidden: true,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('**Half-Life Asset Manager** replaces HLMV and adds many features and improvements. It can be downloaded here: https://github.com/Solokiller/HL_Tools/releases');
    },
};