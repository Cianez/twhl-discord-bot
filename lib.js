const http = require('https');
const auth = require('./auth.json');
var Discord = require('discord.js');

exports.getJSON = function(url, callback) {
    var options = {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": auth.apikey
        }
    };
    var req = http.request(url, options, res => {
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
};

exports.maybe = function(callback, frequency) {
    if (!frequency) frequency = 0.1;
    let rand = Math.random();
    if (rand < frequency) callback();
}

exports.choose = function(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
};

exports.chooseBiased = function(arr) {
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
};

exports.delay = function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if the given member has at least one of the roles given in roleNames
 * @param {Discord.GuildMember} member - User
 * @param {Array<string>} roleNames - Array of role names
 */
exports.memberHasAnyRole = function(member, roleNames) {
    const matching = member.roles.cache.filter(r => roleNames.includes(r.name));
    return matching.size > 0;
};

/**
 * Check if the given member has at all of the roles given in roleNames
 * @param {Discord.GuildMember} member - User
 * @param {Array<string>} roleNames - Array of role names
 */
exports.memberHasAllRoles = function(member, roleNames) {
    const matching = member.roles.cache.filter(r => roleNames.includes(r.name));
    return matching.size === roleNames.length;
};
