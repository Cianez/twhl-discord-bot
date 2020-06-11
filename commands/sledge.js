var Discord = require('discord.js');

module.exports = {
    name: 'sledge',
    description: 'Posts information about Sledge.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        message.channel.send('**Sledge is no longer supported**. You can still download it here: https://logicandtrick.github.io/sledge/');
    },
};