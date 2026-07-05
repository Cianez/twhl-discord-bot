import { Message } from 'discord.js';
import { logError, memberHasAnyRole } from '../lib.js';

export const name = 'honeypot_channel';
export const matcher = null;

const honeypotChannelId = '1523148189849354250';

/** @type {Set<string>} */
const banAlreadyInProgress = new Set();

/**
 * @param {Message} message 
 * @param {import('../types/globals').botClient} bot 
 */
export function execute(message, bot) {
    if (!message.member) return; // ??
    if (message.member.user.bot) return; // dont ban bots
    if (message.channel.isDMBased() || !message.guild) return; // for typechecking only
    if (message.channel.id != honeypotChannelId) return; // only do things in the honeypot channel

    // these channel names are never changed
    const channel = message.guild.channels.cache.find(ch => ch.name === 'shoutbox-live');
    const logChannel = message.guild.channels.cache.find(ch => ch.name === 'moderation-log');
    if (!channel || !channel.isSendable()) return;

    // special roles are ok
    if (memberHasAnyRole(message.member, ['Admins', 'Moderators', 'TWHL Bot', 'Legendary'])) {
        if (logChannel?.isSendable()) {
            logChannel.send(`${message.member.displayName} (*${message.member.user.username}*) posted in the honeypot channel but they are special so it's ok.`);
        }
        return;
    }

    const userId = message.member.user.id;
    if (banAlreadyInProgress.has(userId)) return; // already banning this user

    const production = message.guild.id === '291678871856742400';
    const bannable = message.member.bannable;
    const messageText = `${message.member.displayName} (*${message.member.user.username}*) posted in the honeypot channel and was ejected.`;

    if (!production) {
        channel.send(`${messageText} (not really, because we are not in production!)`);
    } else if (!bannable) {
        channel.send(`${messageText} (or they should have been, but I am not able to ban them)`);
    } else {
        banAlreadyInProgress.add(userId);

        // ban and then immediately unban the user, so we can auto-delete their messages but not permaban them (for now)
        message.member.ban({
            reason: 'SPAMBOT - posted in the honeypot channel',
            deleteMessageSeconds: 60 * 60, // 1 hour
        }).then(x => {
            // another scam defeated
            channel.send(messageText);

            // wait 1 minute before unbanning, to let discord process the deletion of messages
            // discord doesn't guarantee when exactly the messages will be deleted, but this should be enough
            // (it probably still runs the delete even if the unban happens too quickly anyway)
            setTimeout(() => {
                banAlreadyInProgress.delete(userId);
                message.guild?.bans.remove(userId, 'For now we are not permabanning spambots.')
                    .catch(err => {
                        logError(bot, 'filter: honeypot_channel removing ban', err);
                    });
            }, 60 * 1000);
        }).catch(err => {
            banAlreadyInProgress.delete(userId);
            logError(bot, 'filter: honeypot_channel ban user', err)
        });
    }
}