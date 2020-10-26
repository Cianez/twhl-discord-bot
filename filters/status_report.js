var Discord = require('discord.js');
const lib = require('../lib');

const cooldown = 1000 * 60 * 10; // 10 minutes
let lastRun = 0;

module.exports = {
    name: 'status-report',
    matcher: /status report/ig,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, bot) {
        if (bot.silenced === true) return;
        
        lib.maybe(() => {
            const now = +new Date();
            const nextAllowedRun = lastRun + cooldown;
            if (nextAllowedRun > now) {
                return;
            }
            lastRun = now;

            const responses = [
                // More likely to use the default response
                'Did you submit your status report to the administrator today?',
                'Did you submit your status report to the administrator today?',
                `<@${message.author.id}>, I hope you've submitted your status report to the administrator.`,
                `Did someone say "status report"? Because you should submit that to the administrator.`,
                `People are still referencing status reports? That joke died ages ago, you know.`
            ];
            message.channel.send(lib.choose(responses));
        });
    }
};