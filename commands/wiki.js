var Discord = require('discord.js');

module.exports = {
	name: 'wiki',
    description: 'Posts information about the TWHL wiki.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(message, args) {
        message.channel.send('https://twhl.info/wiki - The wiki contains all of the collective knowledge that the community has acquired over the years. Anybody can edit it!');
	},
};