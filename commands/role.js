var Discord = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Add (or remove) a role from yourself. <role name> must be one of: Mappers, Modellers, Programmers',
    args: ['<role name>'],
    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        const allowedRoles = [
            'mappers',
            'modellers',
            'programmers'
        ];
        const roleName = (args[0] || '').toLowerCase();
        if (!allowedRoles.includes(roleName)) {
            message.channel.send('How to use: type `!role <name>`, where `<name>` is one of the following: ' + allowedRoles.join(', '));
            return;
        }

        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
        if (!role) return;

        const roleId = role.id;
        if (message.member.roles.cache.has(roleId)) {
            message.member.roles.remove(roleId);
            message.channel.send(`The **_${role.name}_** role has been removed from <@${message.author.id}>`);
        } else {
            message.member.roles.add(roleId);
            message.channel.send(`The **_${role.name}_** role has been assigned to <@${message.author.id}>`);
        }
    },
};