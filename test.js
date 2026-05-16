
import { getJSON } from './lib.js';

getJSON('https://twhl.info/api/shouts?count=2&expand=user', (result) => {
    var txt = result.reverse().map(s => '**' + s.user.name + '**: ' + s.content ).join('\n');
    console.log(txt);
});
