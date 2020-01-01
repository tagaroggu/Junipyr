//First 3 lines make the entire thing possible; Get the code for Discord.js, create a client to interact with Discord,
//and get dotenv to configure the environment variable for the token so no one steals it.
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

//Prefix for when using in servers
const prefix = 'j!'

//When the bot connects to Discord and everything is done getting set up, it does this
client.on('ready', () => {
    //Prints to console (Only on where the code is running) "Logged in as" with the username and tag (4 digit identifier/discriminator)
    console.log(`Logged in as ${client.user.tag}!`);
    //Sets the activity of the bot (What it says right beneath the name)
    client.user.setActivity('games, helping friends -- j!help', {type: "PLAYING"});
});

//Runs this whenever a message is sent to a server the bot is in
client.on('message', message => {
    if (message.channel.type === 'dm' || message.content.indexOf(prefix) == 0) {
        let command = message.content.split(' ')[0];
        if (message.channel.type === 'text') {
            command = command.slice(prefix.length);
        }
        switch (command) {
        //If the first thing in the dm is send
        case 'send':
            if (message.channel.type !== 'dm') {
                message.author.send('Hey, you called my command, but you weren\'t in DMs. This bot was specifically created to allow for anonymous venting to a channel. Here\'s your message back, though.');
                message.author.send(message.content);
                message.delete();
                break;
            }
            //Gets the ID of a server from the message
            var server = String(message.content.split(' ')[1]);
            //Gets the ID of a channel from the message
            var channel = String(message.content.split(' ')[2]);
            //Checks if this bot is in a server with the given ID
            if (!client.guilds.get(server)) {
                message.channel.send('Sorry, but this bot doesn\'t belong to a server with this ID.');
                break;
            }
            //Checks if the message author is in the server
            if (!client.guilds.get(server).members.get(message.author.id)) {
                message.channel.send('Sorry, but you are not a part of the server with this ID.');
                break;
            }
            //Checks if the server has a channel with the given ID
            if (!client.guilds.get(server).channels.get(channel)) {
                message.channel.send('Sorry, but a channel in the server does not exist with this ID.');
                break;
            }
            //Checks if the channel is a text channel
            if (client.guilds.get(server).channels.get(channel).type !== 'text') {
                //Checks if the channel is a news channel, which is technically a text channel, but I won't allow the bot to send to the channel
                if (client.guilds.get(server).channels.get(channel).type === 'news') {
                    message.channel.send('Sorry, but the channel with this ID is a news channel, and I only send to normal text channels');
                } else {
                    message.channel.send('Sorry, but the channel with this ID is not a text channel.');
                }
                break;
            }
            //If a break hasn't been reached at this point, then it should be good to send the message
            //The seven is for the length of the word send plus 3 spaces; one between send and the server ID, the server ID and the channel ID, and between the channel ID and message
            client.guilds.get(server).channels.get(channel).send(message.content.slice(+server.length+channel.length+7)).then(m => {
                message.channel.send(`Your message has been sent.\nhttps://discordapp.com/channels/${server}/${channel}/${m.id}`);
            });
            break;
        case 'info':
            if (message.channel.type === 'dm') {
                message.channel.send('You sent this command in a DM, however, the purpose of this command is to get the ID of a server and a channel for the send command.');
                break;
            } else {
                message.channel.send(`Server ID: ${message.guild.id}\nChannel ID: ${message.channel.id}`);
            }
            break;
        case 'help':
            message.channel.send('send: `server id, channel id, message` Sends a message to a channel with a given server and channel id\ninfo: Returns the server and channel id of where the command was sent from, allowing for the user to use the send command\nhelp: Shows this');
            break;
    }
    }
});
//Logs the bot in with the token from the .env file
client.login(process.env.token);