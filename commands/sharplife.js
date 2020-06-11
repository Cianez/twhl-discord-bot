var Discord = require('discord.js');

module.exports = {
    name: 'sharplife',
    description: 'Posts information about SharpLife.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        message.channel.send('You can check out **SharpLife** here: https://twhl.info/thread/view/19494');
    },
};