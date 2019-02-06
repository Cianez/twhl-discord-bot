
var auth = require('./auth.json');
const lib = require('./lib');


lib.getJSON('https://twhl.info/api/shouts?count=2&expand=user', {
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": auth.apikey
    }
}, result => {
    var txt = result.reverse().map(s => '**' + s.user.name + '**: ' + s.content ).join('\n');
    console.log(txt);
})