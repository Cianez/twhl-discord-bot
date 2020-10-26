var Discord = require('discord.js');

module.exports = {
    name: 'sharplife',
    description: 'Posts information about SharpLife.',
    hidden: true,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('You can check out **SharpLife** here: https://twhl.info/thread/view/19494');
    },
};