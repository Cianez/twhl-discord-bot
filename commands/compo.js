var Discord = require('discord.js');
const lib = require('../lib');

module.exports = {
    name: 'compo',
    description: 'Posts information about any current competitions on TWHL.',
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        let compoUrl = 'https://twhl.info/api/competitions/paged?sort_descending=true&count=3&expand=type,judge_type,status';
        lib.getJSON(compoUrl, result => {
            let comps = result.items.filter(x => x.status.name != 'Draft' && x.status.name != 'Closed');
            let msg = 'There are currently no active competitions. Send messages to Urby if you want to see one!';
            if (comps.length > 0) {
                msg = '';
                comps.reverse().forEach(c => {
                    var daysLeft = Math.round((Date.parse(c.close_date) - new Date()) / 1000 / 60 / 60 / 24);
                    msg += `**${c.name}** - ${c.status.name} - https://twhl.info/competition/brief/${c.id}\n`;
                    if (daysLeft > 0) msg += `${c.type.name} - ${daysLeft} days left to enter!\n`;
                });
            }
            message.channel.send(msg);
        });
    },
};