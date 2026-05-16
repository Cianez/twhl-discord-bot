import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageFlags } from 'discord.js';

/** @import { Interaction, CacheType } from 'discord.js' */

export const name = 'role';
export const description = 'Add (or remove) a role from yourself.';
export const slash = true;

/**
 * @param {SlashCommandBuilder} builder 
 */
export function addOptions(builder) {
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
}

/**
 * @param {Interaction<CacheType>} interaction
 */
export async function executeSlashCommand(interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.member) return;
    if (!interaction.guild) return;

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
        await interaction.reply({ content: roleName + ';;How to use: type `!role <name>`, where `<name>` is one of the following: ' + allowedRoles.join(', '), flags: MessageFlags.Ephemeral });
        return;
    }

    const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
    if (!role) return;
    
    if (Array.isArray(interaction.member.roles)) return;

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
    await interaction.reply({ content: msgText, flags: MessageFlags.Ephemeral });
}