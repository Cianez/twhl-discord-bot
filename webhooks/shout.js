import { ChannelType } from 'discord.js';

const webhookCache = new Map();

/**
 * 
 * @param {import('discord.js').TextChannel} channel 
 * @returns {Promise<import('discord.js').Webhook>}
 */
async function getChannelWebhook(channel) {
    if (webhookCache.has(channel.id)) return webhookCache.get(channel.id);

    const hooks = await channel.fetchWebhooks();
    let hook = hooks.find(h => h.owner?.id === channel.client.user.id && h.name === 'TWHL Shouts');
    hook ??= await channel.createWebhook({ name: 'TWHL Shouts' });

    webhookCache.set(channel.id, hook);
    return hook;
}

export const name = 'shout';

/**
 * 
 * @param {import('../types/models').Shout} shout 
 * @param {import('../types/globals').botClient} bot 
 */
export async function execute(request, response, shout, bot) {
    // validate shout content
    if (
        !shout
        || !Number.isInteger(shout.id)
        || !Number.isInteger(shout.user_id)
        || !(typeof shout.content === 'string') || !shout.content
        || !(typeof shout.user === 'object') || !shout.user
        || !(typeof shout.user.name === 'string') || !shout.user.name
    ) {
        throw new Error('Invalid body');
    }

    // get or create the discord webhook
    const channelName = 'shoutbox-live';
    const channel = /** @type {import('discord.js').TextChannel | undefined} */ (
        bot.channels.cache.find(x => x.type === ChannelType.GuildText && x.name === channelName)
    );
    if (!channel) throw new Error(`Channel "${channelName}" not found`);

    const hook = await getChannelWebhook(channel);
    if (!hook) throw new Error('Failed to get or create webhook');

    const avatarUrl = typeof shout.user.avatar_full === 'string' && !!shout.user.avatar_full
        ? shout.user.avatar_full.replaceAll('http://twhl/', 'https://twhl.info/')
        : undefined;

    hook.send({
        username: `${shout.user.name} 🗣️📦 via TWHL Shoutbox`,
        avatarURL: avatarUrl,
        content: shout.content,
        allowedMentions: { parse: [] }
    });
};
