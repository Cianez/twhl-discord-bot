import { request } from 'https';
import { GuildMember } from 'discord.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { apikey } = require('./auth.json');

/**
 * 
 * @param {string} url 
 * @param {(data : any) => void} callback 
 */
export function getJSON(url, callback) {
    var options = {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": apikey
        }
    };
    var req = request(url, options, res => {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            callback(obj);
        });
    });

    req.end();
}

/**
 * @param {() => any} callback 
 * @param {number} frequency 
 */
export function maybe(callback, frequency = 0.1) {
    if (!frequency) frequency = 0.1;
    let rand = Math.random();
    if (rand < frequency) callback();
}

/**
 * @template T
 * @param {Array<T>} arr 
 * @returns {T}
 */
export function choose(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

/**
 * @template T
 * @param {Array<T>} arr 
 * @returns {T}
 */
export function chooseBiased(arr) {
    const map = [];
    let repeat = arr.length;
    // e.g. for an array with 3 items: [1, 2, 3]
    // create an array like this: [1, 1, 1, 2, 2, 3]
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < repeat; j++) {
            map.push(i);
        }
        repeat--;
    }
    const rand = Math.floor(Math.random() * map.length);
    const index = map[rand];
    return arr[index];
}

/**
 * @param {number} ms 
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if the given member has at least one of the roles given in roleNames
 * @param {GuildMember} member - User
 * @param {Array<string>} roleNames - Array of role names
 */
export function memberHasAnyRole(member, roleNames) {
    const matching = member.roles.cache.filter(r => roleNames.includes(r.name));
    return matching.size > 0;
}

/**
 * Check if the given member has at all of the roles given in roleNames
 * @param {GuildMember} member - User
 * @param {Array<string>} roleNames - Array of role names
 */
export function memberHasAllRoles(member, roleNames) {
    const matching = member.roles.cache.filter(r => roleNames.includes(r.name));
    return matching.size === roleNames.length;
}

/**
 * @param {import('./types/globals').botClient} bot
 * @param {string} thing
 * @param {any} err
 */
export function logError(bot, thing, err) {
    const logChannel = bot.channels.cache.find(x => !x.isDMBased() && x.name === 'moderation-log');
    if (!logChannel || !logChannel.isSendable()) {
        console.error(err);
        return;
    }

    logChannel.send(`Error during ${thing} : ${err}`);
}