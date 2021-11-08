var Discord = require('discord.js');

const isImage = (/** @type {Discord.MessageAttachment} */ attachment) => {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    return attachment.name && extensions.some(e => attachment.name.endsWith(e));
};

const isMedia = (/** @type {Discord.MessageAttachment} */ attachment) => {
    const extensions = ['.mp4', '.webm', '.mov', '.gifv'];
    return attachment.name && extensions.some(e => attachment.name.endsWith(e));
};

function round(num) {
    return Math.round(num * 100) / 100;
}
function format_filesize(bytes)
{
    if (bytes < 1024) return bytes + 'b';
    const kbytes = bytes / 1024;
    if (kbytes < 1024) return round(kbytes) + 'kb';
    const mbytes = kbytes / 1024;
    if (mbytes < 1024) return round(mbytes) + 'mb';
    const gbytes = mbytes / 1024;
    if (gbytes < 1024) return round(gbytes) + 'gb';
    const tbytes = gbytes / 1024;
    if (tbytes < 1024) return round(tbytes) + 'tb';
    const pbytes = tbytes / 1024;
    return round(pbytes) + 'pb';
}

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

        // Track deletes
        bot.on('messageDelete', message => {
            if (!logChannel) return;
            if (message == null) return;
            if (message.member.user.bot) return;

            const embeds = message.embeds.map(e => {
                let values;
                if (e.provider != null) {
                    values = [e.type + ' - ' + e.provider.name, e.title, e.url];
                } else {
                    values = [e.type, e.title, e.url];
                }
                return { name: 'Embed', value: values.filter(x => x).join('\n') };
            });
            const attachInfo = message.attachments.map(a => {
                return { name: 'Attachment', value: a.contentType + ': ' + a.name + ' (' + format_filesize(a.size) + ') ' + ' - ' + a.url };
            });
            const files = message.attachments.filter(a => isImage(a) || isMedia(a)).map(a => {
                return new Discord.MessageAttachment(a.attachment, a.name);
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
                .setTimestamp();
            if (files.length == 1 && isImage(files[0]) && files[0].name) {
                alert.setImage('attachment://' + files[0].name);
            }
            logChannel.send({ embeds: [ alert ], files });
        });

        // Track updates
        bot.on('messageUpdate', (oldMessage, message) => {
            if (!logChannel) return;
            if (message.member.user.bot) return;

            const files = [];
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
            } else if (message.attachments.size < oldMessage.attachments.size) {
                // Attachments removed from message
                const attachInfo = oldMessage.attachments.map(a => {
                    return { name: 'Attachment', value: a.contentType + ': ' + a.name + ' (' + format_filesize(a.size) + ') ' + ' - ' + a.url };
                });
                files.push(...oldMessage.attachments.filter(a => isImage(a) || isMedia(a)).filter(x => x.size < 2048 * 1024 * 1024).map(a => {
                    return new Discord.MessageAttachment(a.attachment, a.name);
                }));
                alert.addField('Attachments removed', 'See details').addFields(...attachInfo);
                if (attachInfo.length == 1 && files.length == 1 && isImage(files[0])) {
                    alert.setImage('attachment://' + files[0].name);
                }
            } else if (message.pinned != oldMessage.pinned) {
                // Only moderators can do this, so we don't need to log it
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
            logChannel.send({ embeds: [alert], files });
        });
    }
};