var Discord = require('discord.js');

module.exports = {
    name: 'hlam',
    description: 'Posts information about Half-Life Asset Manager.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('**Half-Life Asset Manager** replaces HLMV and adds many features and improvements. It can be downloaded here: https://github.com/Solokiller/HL_Tools/releases');
    },
};