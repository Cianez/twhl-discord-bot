var Discord = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Add (or remove) a role from yourself. <role name> must be one of: Mappers, Modellers, Programmers',
    args: ['<role name>'],
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     * @param {Discord.Client} bot
     */
    async execute(message, args, bot) {
        const allowedRoles = [
            'mappers',
            'modellers',
            'programmers',
            'multiplayer crew'
        ];
        const specialMessages = {
            'multiplayer crew!add': 'When you\'re in this group, you will be @pinged when somebody wants to play a multiplayer game (e.g. CS1.6, HLDM, Sven Co-op).'
        };
        const roleName = args.join(' ').toLowerCase();
        if (!allowedRoles.includes(roleName)) {
            await message.reply('How to use: type `!role <name>`, where `<name>` is one of the following: ' + allowedRoles.join(', '));
            return;
        }

        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
        if (!role) return;

        let msgText;

        const roleId = role.id;
        if (message.member.roles.cache.has(roleId)) {
            message.member.roles.remove(roleId);
            msgText = `You've been removed from the **_${role.name}_** role.`;
            if (specialMessages[`${roleName}!remove`]) msgText += ' ' + specialMessages[`${roleName}!remove`];
        } else {
            message.member.roles.add(roleId);
            msgText = `You've been added to the **_${role.name}_** role.`;
            if (specialMessages[`${roleName}!add`]) msgText += ' ' + specialMessages[`${roleName}!add`];
        }
        await message.reply(msgText);
    },
};