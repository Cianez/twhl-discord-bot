import { ActivityType } from 'discord.js';

export const name = 'startup';

/**
 * @param {import('../types/globals').botClient} bot 
 */
export function register(bot) {
    // Whenever the bot is ready
    bot.on('clientReady', () => {
        bot.logger.info('Connected');
        bot.logger.info('Logged in as: ');
        bot.logger.info(bot.user.username + ' - (' + bot.user.id + ')');
        bot.user.setActivity({
            name: 'Browsing TWHL.info',
            state: 'Browsing TWHL.info',
            type: ActivityType.Custom,
            url: 'https://twhl.info'
        });
    });
}