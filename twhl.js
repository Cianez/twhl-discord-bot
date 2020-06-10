var Discord = require('discord.js');
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

// Initialize Discord bot and login
var bot = new Discord.Client();
bot.login(auth.token);

// Whenever the bot is ready
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    bot.user.setActivity('TWHL.info', { type: 'WATCHING' });
});

// Whenever a message is received
bot.on('message', message => {
    // Ignore DMs
    if (message.channel instanceof Discord.DMChannel) return;

    // Check if it's a command (starts by "!")
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !twhl
            case 'twhl':
                message.channel.send('Browse the website at this address: https://twhl.info/');
                break;
            // !sledge
            case 'sledge':
                message.channel.send('**Sledge is no longer supported**. You can still download it here: http://sledge-editor.com/');
                break;
            // !hlmv
            case 'hlmv':
                message.channel.send('You can download **HLMV Standalone** here: https://github.com/Solokiller/HL_Tools/releases');
                break;
            // !sharplife
            case 'sharplife':
                message.channel.send('You can check **Sharp-Life** here: https://twhl.info/thread/view/19494');
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
                    message.channel.send(msg);
                })
                break;
            // !wiki
            case 'wiki':
                message.channel.send('**The wiki contains all of the collective knowledge that the community has acquired over the years**: https://twhl.info/wiki');
                break;
            // !vault
            case 'vault':
                message.channel.send('TWHL\'s Map **Vault**: https://twhl.info/vault');
                break;
            // !server
            case 'server':
                message.channel.send('TWHL\'s **Half-Life Server**: steam://connect/62.104.168.193:27015');
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

                if (message.member.roles.cache.has(roleID)) {
                    message.member.roles.remove(roleID);
                    message.channel.send(`The **_${args[0]}_** role has been unassigned to <@${message.author.id}>`);
                } else {
                    message.member.roles.add(roleID);
                    message.channel.send(`The **_${args[0]}_** role has been assigned to <@${message.author.id}>`);
                }
                break;
            // Auto-update
            case 'update':
                if (!lib.memberHasPrivilege(true, false, message.member)) break;

                let channel = message.channel;
                if (channel.id != '513507834885963812') break;

                channel.send('Updating...');
                child_process.execSync('git reset --hard');
                child_process.execSync('git pull');
                child_process.execSync('pm2 restart twhl.js');
                break;
            // Just add any case commands if you want to..
        }
    } else {
        // If we're here, it's not a command, ignore all messages sent by the bot itself
        if (message.author != bot.user) {
            if (message.content.toLowerCase().includes("status report")) { // Status report joke
                message.channel.send("Did you submit your status report to the administrator today?");
            } else if (message.content.toLowerCase().includes("the core")) { // The Core release date joke
                lib.maybe(() => {
                    let msg = lib.choose([
                        'Release date: unknown',
                        'Release date: Oct 14 2073',
                        'Release date has increased by 1 month',
                        'You mean that vapourware mod?',
                        'I\'m pretty sure that mod doesn\'t actually exist.',
                        'Have you ever seen Urby and Gabe in the same room together? Just saying'
                    ]);
                    message.channel.send(msg);
                });
            }
        }
    }
});

// Whenever a new member has been added to the guild
bot.on('guildMemberAdd', member => {
    member.guild.channels.cache.find(ch => ch.name === 'shoutbox-live').send(`Hi ${member}! :wave: Welcome to the **TWHL Discord Server**! :slight_smile:`);
});

// Whenever a member has been removed from the guild (leaving, kick, ban...)
bot.on('guildMemberRemove', member => {
    member.guild.channels.cache.find(ch => ch.name === 'shoutbox-live').send(`${member} just left us... :cry:`);
});
