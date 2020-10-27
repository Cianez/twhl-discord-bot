var Discord = require('discord.js');

module.exports = {
    name: 'log-messages',
    /**
     * @param {Discord.Client} bot
     */
    register(bot) {
        /** @type {Discord.TextChannel} */
        let logChannel = null;

        // Get the channel
        bot.on('ready', () => {
            logChannel = bot.channels.cache.find(x => x.name === 'moderation-log');
        });

        const isImage = (/** @type {Discord.MessageAttachment} */ attachment) => {
            const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
            return attachment.name && extensions.some(e => attachment.name.endsWith(e));
        };

        const isMedia = (/** @type {Discord.MessageAttachment} */ attachment) => {
            const extensions = ['.mp4', '.webm', '.mov', '.gifv'];
            return attachment.name && extensions.some(e => attachment.name.endsWith(e));
        };

        // Track deletes
        bot.on('messageDelete', message => {
            if (!logChannel) return;
            if (message == null) return;
            if (message.member.user.bot) return;

            const embeds = message.embeds.map(e => {
                const values = [e.type + ' - ' + e.provider.name, e.title, e.url];
                return { name: 'Embed', value: values.filter(x => x).join('\n') };
            });
            const attachInfo = message.attachments.map(a => {
                return { name: 'Attachment', value: a.name + ' - ' + a.url };
            });
            const attachments = message.attachments.filter(a => isImage(a) || isMedia(a)).map(a => {
                return new Discord.MessageAttachment(a.proxyURL, a.name);
            });
            const alert = new Discord.MessageEmbed()
                .setColor('#FF0A43')
                .setTitle('Message deleted')
                .setAuthor(`${message.member.displayName} (${message.member.user.username}#${message.member.user.discriminator})`, message.member.user.avatarURL())
                .addField('Author', `${message.author}`, true)
                .addField('Channel', `${message.channel}`, true)
                .addField('Message text', message.cleanContent || 'None')
                .addFields(...embeds)
                .addFields(...attachInfo)
                .attachFiles(attachments)
                .setTimestamp();
            if (attachments.length == 1 && isImage(attachments[0]) && attachments[0].name) {
                alert.setImage('attachment://' + attachments[0].name);
            }
            logChannel.send(alert);
        });

        // Track updates
        bot.on('messageUpdate', (oldMessage, message) => {
            if (!logChannel) return;
            if (message.member.user.bot) return;
            
            const alert = new Discord.MessageEmbed()
                .setColor('#FFBA1C')
                .setTitle('Message updated')
                .setAuthor(`${message.member.displayName} (${message.member.user.username}#${message.member.user.discriminator})`, message.member.user.avatarURL())
                .addField('Author', `${message.author}`, true)
                .addField('Channel', `${message.channel}`, true)
                .addField('Link', message.url)
                .setTimestamp();
            if (oldMessage.cleanContent !== message.cleanContent) {
                alert.addField('Old message', oldMessage.cleanContent || 'None')
                     .addField('New message', message.cleanContent || 'None');
            } else if (oldMessage.embeds.length > 0 && message.embeds.length === 0) {
                const embeds = oldMessage.embeds.map(e => {
                    const values = [e.type + ' - ' + e.provider.name, e.title, e.url];
                    return { name: 'Embed', value: values.filter(x => x).join('\n') };
                });
                alert.addField('Removed embeds', 'See embeds below').addFields(...embeds);
            } else if (oldMessage.embeds.length === 0 && message.embeds.length > 0) {
                // The action was to add embeds, the Discord client does this automatically.
                // We don't need to log this.
                return;
            } else {
                alert.addField('I don\'t know!', 'The edit was something I am unable to deal with. Time to panic!');
                alert.addField('Debug information', '```\n' +  JSON.stringify({
                    old: {
                        content: oldMessage.content,
                        embeds: oldMessage.embeds
                    },
                    new: {
                        content: message.content,
                        embeds: message.embeds
                    }
                }).substr(0, 1000) + '\n```');
            }
            logChannel.send(alert);
        });
    }
};