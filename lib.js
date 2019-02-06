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