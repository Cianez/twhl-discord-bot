import { Attachment, AttachmentBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import { logError } from '../lib.js';
/** @import { Channel } from 'discord.js' */

const honeypotChannelId = '1523148189849354250';

const isImage = (/** @type {Attachment | AttachmentBuilder} */ attachment) => {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const name = attachment.name;
    return name && extensions.some(e => name.endsWith(e));
};

const isMedia = (/** @type {Attachment | AttachmentBuilder} */ attachment) => {
    const extensions = ['.mp4', '.webm', '.mov', '.gifv'];
    const name = attachment.name;
    return name && extensions.some(e => name.endsWith(e));
};

/**
 * @param {number} num
 */
function round(num) {
    return Math.round(num * 100) / 100;
}
/**
 * @param {number} bytes
 */
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

export const name = 'log-messages';

/**
 * @param {import('../types/globals').botClient} bot 
 */
export function register(bot) {
    /** @type {Channel | undefined | null} */
    let logChannel = null;

    // Get the channel
    bot.on('clientReady', () => {
        logChannel = bot.channels.cache.find(x => x.type == ChannelType.GuildText && x.name === 'moderation-log');
    });

    // Track deletes
    bot.on('messageDelete', message => {
        try {
            if (!logChannel || !logChannel.isSendable()) return;
            if (message == null) return;

            if (!message.member || message.member.user.bot) return;
            if (message.channel.id == honeypotChannelId) return;

            const embeds = message.embeds.map(e => {
                let values;
                if (e.provider != null) {
                    values = [e.provider.name, e.title, e.url];
                } else {
                    values = [e.title, e.url];
                }
                return { name: 'Embed', value: values.filter(x => x).join('\n') };
            });
            const attachInfo = message.attachments.map(a => {
                return { name: 'Attachment', value: a.contentType + ': ' + a.name + ' (' + format_filesize(a.size) + ') ' + ' - ' + a.url };
            });
            const files = message.attachments.filter(a => isImage(a) || isMedia(a)).map(a => {
                try {
                    /** @type any */
                    const anyAttachment = a;
                    return new AttachmentBuilder(anyAttachment.attachment, {
                        name: a.name
                    });
                } catch (_) {
                    return null;
                }
            }).filter(x => !!x);
            const alert = new EmbedBuilder()
                .setColor('#FF0A43')
                .setTitle('Message deleted')
                .setAuthor({ name: `${message.member.displayName} (${message.member.user.username}#${message.member.user.discriminator})`, iconURL: message.member.user.avatarURL() ?? undefined })
                .addFields([
                    { name: 'Author', value: `${message.author}`, inline: true },
                    { name: 'Channel', value: `${message.channel}`, inline: true },
                    { name: 'Message text', value: message.cleanContent || 'None', inline: false },
                ])
                .addFields(...embeds)
                .addFields(...attachInfo)
                .setTimestamp();
            if (files.length == 1 && isImage(files[0]) && files[0].name) {
                alert.setImage('attachment://' + files[0].name);
            }
            logChannel.send({ embeds: [alert], files });
        } catch (error) {
            logError(bot, 'event: log-messages/messageDelete', error);
        }
    });

    // Track updates
    bot.on('messageUpdate', (oldMessage, message) => {
        try {
            if (!logChannel || !logChannel.isSendable()) return;
            if (!message.member || message.member.user.bot) return;

            /** @type {AttachmentBuilder[]} */
            const files = [];
            const alert = new EmbedBuilder()
                .setColor('#FFBA1C')
                .setTitle('Message updated')
                .setAuthor({ name: `${message.member.displayName} (${message.member.user.username}#${message.member.user.discriminator})`, iconURL: message.member.user.avatarURL() ?? undefined })
                .addFields([
                    { name: 'Author', value: `${message.author}`, inline: true },
                    { name: 'Channel', value: `${message.channel}`, inline: true },
                    { name: 'Link', value: message.url, inline: false },
                ])
                .setTimestamp();
            if (oldMessage.cleanContent !== message.cleanContent) {
                alert.addFields([
                    { name: 'Old message', value: oldMessage.cleanContent?.substring(0, 1000) || 'None' },
                    { name: 'New message', value: message.cleanContent?.substring(0, 1000) || 'None' }
                ]);
            } else if (oldMessage.embeds.length > 0 && message.embeds.length === 0) {
                const embeds = oldMessage.embeds.map(e => {
                    const values = [e.provider?.name, e.title, e.url];
                    return { name: 'Embed', value: values.filter(x => x).join('\n') };
                });
                alert.addFields([{ name: 'Removed embeds', value: 'See embeds below' }])
                    .addFields(...embeds);
                // Don't really care about removing embeds
                return;
            } else if (oldMessage.embeds.length === 0 && message.embeds.length > 0) {
                // The action was to add embeds, the Discord client does this automatically.
                // We don't need to log this.
                return;
            } else if (message.attachments.size < oldMessage.attachments.size) {
                // Attachments removed from message
                const attachInfo = oldMessage.attachments.map(a => {
                    return { name: 'Attachment', value: a.contentType + ': ' + a.name + ' (' + format_filesize(a.size) + ') ' + ' - ' + a.url };
                });
                files.push(
                    ...oldMessage.attachments
                        .filter(a => isImage(a) || isMedia(a))
                        .filter(x => x.size < 2048 * 1024 * 1024)
                        .map(a => {
                            try {
                                /** @type any */
                                const anyAttachment = a;
                                return new AttachmentBuilder(anyAttachment.attachment, {
                                    name: a.name
                                });
                            } catch (_) {
                                return null;
                            }
                        })
                        .filter(x => !!x)
                );
                alert.addFields([{ name: 'Attachments removed', value: 'See details' }])
                    .addFields(...attachInfo);
                if (attachInfo.length == 1 && files.length == 1 && isImage(files[0])) {
                    alert.setImage('attachment://' + files[0].name);
                }
            } else if (message.pinned != oldMessage.pinned) {
                // Only moderators can do this, so we don't need to log it
                return;
            } else if (message.editedTimestamp == oldMessage.editedTimestamp) {
                // Discord doing weird stuff, user probably didn't actually do anything
                return;
            } else {
                alert.addFields([
                    { name: 'I don\'t know!', value: 'The edit was something I am unable to deal with. Time to panic!' },
                    {
                        name: 'Debug information', value: '```\n' + JSON.stringify({
                            old: {
                                content: oldMessage.content,
                                embeds: oldMessage.embeds
                            },
                            new: {
                                content: message.content,
                                embeds: message.embeds
                            }
                        }).substr(0, 1000) + '\n```'
                    }
                ]);
            }
            logChannel.send({ embeds: [alert], files });
        } catch (error) {
            logError(bot, 'event: log-messages/messageUpdate', error);
        }
    });
}