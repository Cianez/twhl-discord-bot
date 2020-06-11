var Discord = require('discord.js');

module.exports = {
	name: 'hlmv',
    description: 'Posts information about HLMV.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(message, args) {
        message.channel.send('You can download **HLMV Standalone** here: https://github.com/Solokiller/HL_Tools/releases');
	},
};