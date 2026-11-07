import { Attachment, AttachmentBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import { getChannelWebhook, truncateText } from '../lib.js';

export const name = 'forum-thread';

/**
 * 
 * @param {import('../types/models').ForumThread} thread 
 * @param {import('../types/globals').botClient} bot 
 */
export async function execute(request, response, thread, bot) {
    // validate thread content
    if (
        !thread
        || !Number.isInteger(thread.id)
        || !(typeof thread.title === 'string') || !thread.title
        || !(typeof thread.forum === 'object') || !thread.forum
        || !(typeof thread.forum.name === 'string') || !thread.forum.name
        || !(typeof thread.last_post === 'object') || !thread.last_post
        || !(typeof thread.last_post.content_text === 'string') || !thread.last_post.content_text
        || !(typeof thread.user === 'object') || !thread.user
        || !(typeof thread.user.name === 'string') || !thread.user.name
    ) {
        throw new Error('Invalid body');
    }

    const channelName = 'shoutbox-live';
    const channel = /** @type {import('discord.js').TextChannel | undefined} */ (
        bot.channels.cache.find(x => x.type === ChannelType.GuildText && x.name === channelName)
    );
    if (!channel) throw new Error(`Channel "${channelName}" not found`);

    const avatarUrl = typeof thread.user.avatar_full === 'string' && !!thread.user.avatar_full
        ? thread.user.avatar_full.replaceAll('http://twhl/', 'https://twhl.info/')
        : undefined;

    const text = thread.last_post.content_text.trim();
    const description = truncateText(text, 300);

    const embed = new EmbedBuilder()
        .setColor('#e68a27')
        .setTitle(truncateText(thread.title, 128))
        .setURL(`https://twhl.info/thread/view/${thread.id}`)
        .setDescription(description)
        .setAuthor({ name: `${thread.user.name} @ twhl.info`, iconURL: avatarUrl, url: `https://twhl.info/user/view/${thread.user.id}` })
        .setFooter({ text: `if it's spam please ping the moderators` });

    const lastPostTime = Date.parse(thread.last_post.created_at);
    if (!Number.isNaN(lastPostTime)) embed.setTimestamp(lastPostTime);

    channel.send({
        content: `💬 New forum thread in **${thread.forum.name}**!`,
        embeds: [embed],
        allowedMentions: { parse: [] }
    });
};
