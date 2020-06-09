const http = require('https');
const auth = require('./auth.json');

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
    if (!frequency) frequency = 0.05;
    let rand = Math.random();
    if (rand < frequency) callback();
}

exports.choose = function(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
};

exports.memberHasPrivilege = function(checkAdmin, checkModerator, server, member) {
    if (!checkAdmin && !checkModerator) return true;

    let admin_role = null;
    let moderator_role = null;

    for (const key in server.roles) {
        if (server.roles.hasOwnProperty(key)) {
            const role = server.roles[key];
            if (role.name == 'Admins') {
                admin_role = role;
                break;
            }

            if (role.name == 'Moderators') {
                moderator_role = role;
                break;
            }
        }
    }

    if (!admin_role || admin_role.name != 'Admins') return false;
    if (!moderator_role || moderator_role.name != 'Moderators') return false;

    if (checkAdmin && member.roles.indexOf(admin_role.id) >= 0) return true;
    if (checkModerator && member.roles.indexOf(moderator_role.id) >= 0) return true;
    return false;
};
