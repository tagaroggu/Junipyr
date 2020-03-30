//Basic set up to get the needed code in
const Discord = require("discord.js");
const client = new Discord.Client();

//What the bot responds to
const prefix = "j!";

//When the bot has connected and done it's little thing to stay online
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`);
  //Like the little status we can now put right under our names, but different
  client.user.setActivity(`games, helping friends -- ${prefix}help`, {
    type: "PLAYING"
  });
});
//Whenever the bot receives a message, such as in a channel, in DMs, etc.
client.on("message", message => {
  //If the author of the message is a bot, we ignore it
  if (message.author.bot) return;
  //If the message doesn't contain the prefix, we ignore it
  if (message.content.indexOf(prefix) === -1) return;
  //A switch statement for the different commands
  switch (message.content.split(" ")[0]) {
    //The command "send"
    case `${prefix}send`:
      //This regex essentially separates the message into separate parts
      //The first part/group is the server name, required to be in quotes,
      //The second is the channel name, which requires a #
      //The third is the message
      let msg = message.content.match(/j!send "(.*)" (#\S*) (.*)/);
      //Gets the server stuffs with the server name
      let server = client.guilds.cache.filter(s => s.name === msg[1]);
      //If the server doesn't actually exist, or if the name is wrong
      if (!server || !server.member(message.author)) {
        message.channel.send(`The server "${msg[1]}" wasn't found :/`);
        break;
      }
      //Gets the channel from the server
      let channel = server.channels.cache.find(c => c.name === msg[2]);
      //If the channel doesn't exist, or if the name is wrong
      if (!channel) {
        message.channel.send(`The channel ${msg[2]} wasn't found :/`);
        break;
      }
      //If the rest at top has passed, then the bot is all set, and can send the message
      channel.send(msg[3]).then(ms => {
        message.channel.send(`Message sent :)\n${ms.url}`);
      });
      break;

    default:
      message.channel.send(
        `I think you typed the wrong command, ${message.author.username}! >_<`
      );
      break;
  }
});

client.login(process.env.token);
