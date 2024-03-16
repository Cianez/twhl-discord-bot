var Discord = require('discord.js');

module.exports = {
    name: 'startup',
    /**
     * @param {Discord.Client} bot
     */
    register(bot) {
        // Whenever the bot is ready
        bot.on('ready', () => {
            bot.logger.info('Connected');
            bot.logger.info('Logged in as: ');
            bot.logger.info(bot.user.username + ' - (' + bot.user.id + ')');
            bot.user.setActivity({
                name: 'Browsing TWHL.info',
                state: 'Browsing TWHL.info',
                type: Discord.ActivityType.Custom,
                url: 'https://twhl.info'
            });
        });
    }
};