var Discord = require('discord.js');
const lib = require('../lib');

module.exports = {
    name: 'the-core',
    matcher: /the core/ig,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message) {
        if (message.channel.name !== 'the-core') return; // only in the core channel
        
        // Let's have some positivity for a change!
        lib.maybe(() => {
            let msg = lib.choose([
                'Release date: March 31 2021',
                'You mean that amazing mod that everybody\'s looking forward to?',
                'I\'m pretty sure that mod is coming out soon and it\'ll be really cool!',
                'Urby, I know I\'m just a bot, but you can do it! The Core\'s going to be great!'
            ]);
            message.channel.send(msg);
        });
    }
};