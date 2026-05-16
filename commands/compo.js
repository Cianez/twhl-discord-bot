import { Message } from 'discord.js';
import { getJSON } from '../lib.js';

export const name = 'compo';
export const description = 'Posts information about any current competitions on TWHL.';

/**
 * @param {Message} message 
 * @param {Array<string>} args 
 * @param {import('../types/globals').botClient} bot
 */
export function execute(message, args, bot) {
    if (bot.silenced === true) return;
    if (!message.channel.isSendable()) return;

    let compoUrl = 'https://twhl.info/api/competitions/paged?sort_descending=true&count=3&expand=type,judge_type,status';
    getJSON(compoUrl, result => {
        let comps = result.items.filter(x => x.status.name != 'Draft' && x.status.name != 'Closed');
        let msg = 'There are currently no active competitions. An announcement will be made when a new one will be organized.';
        if (comps.length > 0) {
            msg = '';
            comps.reverse().forEach(c => {
                var daysLeft = Math.round((Date.parse(c.close_date).valueOf() - (new Date()).valueOf()) / 1000 / 60 / 60 / 24);
                msg += `**${c.name}** - ${c.status.name} - https://twhl.info/competition/brief/${c.id}\n`;
                if (daysLeft > 0) msg += `${c.type.name} - ${daysLeft} days left to enter!\n`;
            });
        }
        
        if (!message.channel.isSendable()) return;
        message.channel.send(msg);
    });
}