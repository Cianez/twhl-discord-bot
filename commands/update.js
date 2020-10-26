var Discord = require('discord.js');
const lib = require('../lib');
const child_process = require('child_process');

module.exports = {
    name: 'update',
    description: 'Posts information about any current competitions on TWHL.',
    hidden: true,
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        if (message.channel.name !== 'bot-testing-channel') return;
        if (!lib.memberHasAllRoles(message.member, ['Admins'])) return;
        if (message.member.id !== '130279066451312640') return; // Go away everyone else

        const production = message.guild.id === '291678871856742400';
        await message.channel.send('Updating...');

        if (production) {
            child_process.execSync('git reset --hard');
            child_process.execSync('git pull');
            child_process.execSync('npm install');
            child_process.execSync('pm2 restart twhl.js');
        } else {
            setTimeout(() => {
                message.channel.send('Or I would, if this wasn\'t the test server.');
            }, 1500);
        }
    },
};