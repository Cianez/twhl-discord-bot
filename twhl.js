var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
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
                    message: 'Up and ready!'
                });
                break;
            // !sledge
            case 'sledge':
                bot.sendMessage({
                    to: channelID,
                    message: 'You can download **Sledge** here: http://sledge-editor.com/'
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
                bot.sendMessage({
                    to: channelID,
                    message: '**The Whole Ascension Life (Mini Competition)** can be found here: https://twhl.info/competition/brief/36'
                });
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
            // Just add any case commands if you want to..
        }
    } else {
        // If we're here, it's not a command, ignore all messages sent by the bot itself
        if (userID != "513501693753688066") {
            if (message.includes("status report")) { // Status report joke
                bot.sendMessage({
                    to: channelID,
                    message: "Did you submit your status report to the administrator today?"
                });
            } else if (message.includes("the core")) { // The Core release date joke
                bot.sendMessage({
                    to: channelID,
                    message: "Release date: unknown"
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