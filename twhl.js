var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const lib = require('./lib');
const child_process = require('child_process');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// Whenever a message happens
bot.on('message', function(user, userID, channelID, message, evt) {
    // Check if it's a command (starts by "!")
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !twhl
            case 'twhl':
                bot.sendMessage({
                    to: channelID,
                    message: 'Up and ready! Auto update!'
                });
                break;
            // !sledge
            case 'sledge':
                bot.sendMessage({
                    to: channelID,
                    message: '**Sledge is no longer supported**. You can still download it here: http://sledge-editor.com/'
                });
                break;
            // !sharplife
            case 'sharplife':
                bot.sendMessage({
                    to: channelID,
                    message: 'You can check **Sharp-Life** here: https://github.com/SamVanheer/SharpLife-Engine'
                });
                break;
            // !compo
            case 'compo':
                let compoUrl = 'https://twhl.info/api/competitions/paged?sort_descending=true&count=3&expand=type,judge_type,status';
                lib.getJSON(compoUrl, result => {
                    let comps = result.items.filter(x => x.status.name != 'Draft' && x.status.name != 'Closed');
                    var msg = 'There are currently no active competitions. Send messages to Urby if you want to see one!';
                    if (comps.length > 0) {
                        msg = '';
                        comps.reverse().forEach(c => {
                            var daysLeft = Math.round((Date.parse(c.close_date) - new Date()) / 1000 / 60 / 60 / 24);
                            msg += `**${c.name}** - ${c.status.name} - https://twhl.info/competition/brief/${c.id}\n`;
                            if (daysLeft > 0) msg += `${c.type.name} - ${daysLeft} days left to enter!\n`;
                        });
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });
                })
                break;
            // !wiki
            case 'wiki':
                bot.sendMessage({
                    to: channelID,
                    message: '**The wiki contains all of the collective knowledge that the community has acquired over the years**: https://twhl.info/wiki'
                });
                break;
            // !vault
            case 'vault':
                bot.sendMessage({
                    to: channelID,
                    message: 'TWHL\'s Map **Vault**: https://twhl.info/vault'
                });
                break;
            // !server
            case 'server':
                bot.sendMessage({
                    to: channelID,
                    message: 'TWHL\'s **Half-Life Server**: steam://connect/62.104.168.193:27015'
                });
                break;
            // !role
            case 'role':
                let roleID = undefined;
                switch ((args[0] || '').toLowerCase()) {
                    case 'mappers': roleID = '291681478113361922'; break;
                    case 'modellers': roleID = '483913880129634305'; break;
                    case 'programmers': roleID = '483913163419549697'; break;
                }
                if (!roleID) break;

                bot.addToRole({
                    serverID: '291678871856742400',
                    userID: userID,
                    roleID: roleID
                });
                bot.sendMessage({
                    to: channelID,
                    message: `The **_${args[0]}_** role has been assigned to <@${userID}>`
                });
                break;
            // Auto-update
            case 'update':
                let channel = bot.channels[channelID];
                let server = bot.servers[channel.guild_id];
                let member = server.members[userID];

                let admin_role = null;
                for (const key in server.roles) {
                    if (server.roles.hasOwnProperty(key)) {
                        const role = server.roles[key];
                        if (role.name == 'Admins') {
                            admin_role = role;
                            break;
                        }
                    }
                }
                if (!admin_role || admin_role.name != 'Admins') break;
                if (member.roles.indexOf(admin_role.id) < 0) break;
                
                bot.sendMessage({
                    to: channelID,
                    message: 'Updating...'
                }, () => {
                    child_process.execSync('git reset --hard');
                    child_process.execSync('git pull');
                    child_process.execSync('pm2 restart twhl.js');
                });
                break;
            // Just add any case commands if you want to..
        }
    } else {
        // If we're here, it's not a command, ignore all messages sent by the bot itself
        if (userID != bot.id) {
            if (message.toLowerCase().includes("status report")) { // Status report joke
                bot.sendMessage({
                    to: channelID,
                    message: "Did you submit your status report to the administrator today?"
                });
            } else if (message.toLowerCase().includes("the core")) { // The Core release date joke
                lib.maybe(() => {
                    let msg = lib.choose([
                        'Release date: unknown',
                        'Release date: Oct 14 2073',
                        'Release date has increased by 1 month',
                        'You mean that vapourware mod?',
                        'I\'m pretty sure that mod doesn\'t actually exist.',
                        'Have you ever seen Urby and Gabe in the same room together? Just saying'
                    ]);
                    bot.sendMessage({
                        to: channelID,
                        message: msg
                    });
                });
            }
        }
    }
});

// Whenever a new member has been added to the guild
bot.on('guildMemberAdd', function(member) {
    bot.sendMessage({
        to: '291678871856742400',
        message: `Hi <@${member.id}>! :wave: Welcome to the **TWHL Discord Server**! :slight_smile:`
    });
});

// Whenever a member has been removed from the guild (leaving, kick, ban...)
bot.on('guildMemberRemove', function(member) {
    bot.sendMessage({
        to: '291678871856742400',
        message: `<@${member.id}> just left us... :cry:`
    });
});
