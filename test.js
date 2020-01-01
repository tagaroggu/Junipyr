var message = 'send 480563492026580992 480563492890476568 eee aaa';
let server = message.split(' ')[1];
let channel = message.split(' ')[2];
let messagecontent = message.slice(+server.length+channel.length+7);
console.log('Server: ' + server);
console.log('Channel: ' + channel);
console.log('Message: ' + messagecontent);