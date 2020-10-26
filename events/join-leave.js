var Discord = require('discord.js');

module.exports = {
    name: 'join-leave',
    /**
     * @param {Discord.Client} bot
     */
    register(bot) {

        // Whenever a new member has been added to the guild
        bot.on('guildMemberAdd', member => {
            if (bot.silenced === true) return;
            member.guild.channels.cache
                .find(ch => ch.name === 'shoutbox-live')
                .send(`Hi ${member}! :wave: Welcome to the **TWHL Discord Server**! :slight_smile:`);
        });

        // Whenever a member has been removed from the guild (leaving, kick, ban...)
        bot.on('guildMemberRemove', member => {
            if (bot.silenced === true) return;
            member.guild.channels.cache
                .find(ch => ch.name === 'shoutbox-live')
                .send(`${member.displayName} (*${member.user.username}#${member.user.discriminator}*) just left us... :cry:`);
        });
    }
};