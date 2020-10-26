var Discord = require('discord.js');

module.exports = {
    name: 'vault',
    description: 'Posts information about the TWHL map vault.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args, bot) {
        if (bot.silenced === true) return;
        
        message.channel.send('TWHL\'s Map **Vault**: https://twhl.info/vault');
    },
};