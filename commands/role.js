const { SlashCommandBuilder } = require('@discordjs/builders');
var Discord = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Add (or remove) a role from yourself.',
    slash: true,
    /**
     * 
     * @param {SlashCommandBuilder} builder 
     */
    addOptions(builder) {
        builder.addStringOption(r => r
            .setName('role')
            .setDescription('Role name')
            .setRequired(true)
            .addChoices(
                { name: 'Mappers', value: 'mappers' },
                { name: 'Modellers', value: 'modellers' },
                { name: 'Programmers', value: 'programmers' },
                { name: 'Multiplayer crew', value: 'multiplayer crew' }
            )
        );
    },
    /**
     * @param {Discord.Interaction<Discord.CacheType>} interaction 
     */
    async executeSlashCommand(interaction) {
        const allowedRoles = [
            'mappers',
            'modellers',
            'programmers',
            'multiplayer crew'
        ];
        const specialMessages = {
            'multiplayer crew!add': 'When you\'re in this group, you will be @pinged when somebody wants to play a multiplayer game (e.g. CS1.6, HLDM, Sven Co-op).'
        };
        const roleName = (interaction.options.getString('role', true) || '').toLowerCase();
        if (!allowedRoles.includes(roleName)) {
            await interaction.reply({ content: roleName +  ';;How to use: type `!role <name>`, where `<name>` is one of the following: ' + allowedRoles.join(', '), ephemeral: true });
            return;
        }

        const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
        if (!role) return;

        let msgText;

        const roleId = role.id;
        if (interaction.member.roles.cache.has(roleId)) {
            interaction.member.roles.remove(roleId);
            msgText = `You've been removed from the **_${role.name}_** role.`;
            if (specialMessages[`${roleName}!remove`]) msgText += ' ' + specialMessages[`${roleName}!remove`];
        } else {
            interaction.member.roles.add(roleId);
            msgText = `You've been added to the **_${role.name}_** role.`;
            if (specialMessages[`${roleName}!add`]) msgText += ' ' + specialMessages[`${roleName}!add`];
        }
        await interaction.reply({ content: msgText, ephemeral: true });
    }
};