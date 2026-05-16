import { Message } from 'discord.js';
import { memberHasAllRoles } from '../lib.js';
import { execSync } from 'child_process';

export const name = 'update';
export const description = 'Update the bot';
export const hidden = true;

/**
 * @param {Message} message
 * @param {Array<string>} args
 */
export async function execute(message, args) {
    const channel = message.channel;
    if (!channel.isSendable() || channel.isDMBased()) return;
    if (channel.name !== 'bot-testing-channel') return;
    if (!message.member || !memberHasAllRoles(message.member, ['Admins'])) return;
    if (message.member.id !== '130279066451312640') return; // Go away everyone else

    const production = message.guild?.id === '291678871856742400';
    await channel.send('Updating...');

    if (production) {
        execSync('git reset --hard');
        execSync('git pull');
        execSync('npm install');
        execSync('pm2 restart twhl.js');
    } else {
        setTimeout(() => {
            channel.send('Or I would, if this wasn\'t the test server.');
        }, 1500);
    }
}