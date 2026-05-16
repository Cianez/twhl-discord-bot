import {} from 'discord.js';
import { logError } from '../lib.js';

export const name = 'join-leave';

/**
 * @param {import('../types/globals').botClient} bot 
 */
export function register(bot) {
    // Whenever a new member has been added to the guild
    bot.on('guildMemberAdd', member => {
        if (bot.silenced === true) return;
        try {
            const channel = member.guild.channels.cache.find(ch => ch.name === 'shoutbox-live');
            if (channel && channel.isSendable()) channel.send(`Hi ${member}! :wave: Welcome to the **TWHL Discord Server**! :slight_smile:`);
        } catch (error) {
            logError(bot, 'event: join-leave/guildMemberAdd', error);
        }
    });

    // Whenever a member has been removed from the guild (leaving, kick, ban...)
    bot.on('guildMemberRemove', member => {
        if (bot.silenced === true) return;
        try {
            const channel = member.guild.channels.cache.find(ch => ch.name === 'moderation-log');
            if (channel && channel.isSendable()) channel.send(`${member.displayName} (*${member.user.username}#${member.user.discriminator}*) just left the server.`);
        } catch (error) {
            logError(bot, 'event: join-leave/guildMemberRemove', error);
        }
    });
}