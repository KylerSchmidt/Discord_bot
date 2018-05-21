// grabs discord.js modules
const Discord = require('discord.js');

// way of pulling api from urban and wiki
const snekfetch = require('snekfetch');

// Triming for when grabbing data from urban and wiki
const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;

// grabs config file for bot.
const { prefix, token } = require('./config.json');

// creates a new discord client
const client = new Discord.Client();

// When client is ready, code is run
// this evet triggers when bot finishes logging in
// or reconnects.
client.on('ready', () => {
    console.log('Ready!');
});

// Reads all messages in discord and relays them to console.
client.on('message', async message => {


	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

const { body } = await snekfetch.get('https://api.urbandictionary.com/v0/define').query({ term: args.join(' ') });

	switch (command) {

		case "tragedy":
			console.log(message.content);
			message.channel.send("Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
		break;

    case "highground":
      console.log(message.content);
      message.channel.send("https://d.ibtimes.co.uk/en/full/1399134/obi-wan-kenobi.jpg");
    break;

		case "server":
			console.log(message.content);
			message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
		break;

		case "user-info":
			console.log(message.content);
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
		break;

		case "avatar":
			console.log(message.content);
			if(!message.mentions.users.size) {
				return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
			}

			const avatarList = message.mentions.users.map(user => {
				return `${user.username}'s avatar: ${user.displayAvatarURL}`;
			});

			message.channel.send(avatarList);
		break;

    case "urban":
      console.log(message.content);
      if (!args.length) {
        return message.channel.send("Insufficient Perameters.");
      }

      if (body.result_type === 'no_results') {
        return message.channel.send(`No results found for **${args.join(' ')}**`);
      }

      const [answerwiki] = body.list;

      const embedurban = new Discord.RichEmbed()
          .setColor('#EFFF00')
          .setTitle(answerwiki.word)
          .setURL(answerwiki.permalink)
          .addField('Definition', trim(answerwiki.definition, 1024))
          .addField('Example', trim(answerwiki.example, 1024))
          .addField('Rating', `${answerwiki.thumbs_up} thumbs up.\n${answerwiki.thumbs_down} thumbs down.`)
          .setFooter(`Tags: ${body.tags.join(', ')}`);

      if(embedurban === ""){
        message.channel.send("error retreving data.");
      }
      message.channel.send(embedurban);
      // message.channel.send(body.list[0].definition);
    break;

    case "urbanbasic":
    console.log(message.content);
    if (!args.length) {
      return message.channel.send("Insufficient Perameters.");
    }

    if (body.result_type === 'no_results') {
      return message.channel.send(`No results found for **${args.join(' ')}**`);
    }
    message.channel.send(body.list[0].definition);
  break;

    // case "wiki":
    //   console.log(message.content);
    //   if(!args.length) {
    //     return message.channel.send("Insufficient Perameters.");
    //   }
    //
    //   const { bodywiki } = await snekfetch.get('https://en.wikipedia.org/w/api.php');
    // break;

		case "bulkdelete":
			console.log(message.content);
      if (!message.member.roles.some(r=>["God"].includes(r.name)) )
          return message.reply("Permissions insufficient");
			const amount = parseInt(args[0]) + 1;

			if (isNaN(amount)) {
				return message.reply("error. Invalid.");
			}else if (amount < 2 || amount > 101) {
				return message.reply("you need to input a number between 2 and 100.");
			}
			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				message.channel.send("error in atempt to delete.");
			});
		break;


		case "help":
			console.log(message.content);
			if (!args.length) {
				return message.channel.send("!tragedy - stuff\n!highground - ITS OVER ANAKIN!\n!server - returns server name and number of people on server\n!user-info - returns information about your user.\n!avatar - returns the avatar of a said user\n!bulkdelete - deletes messages based off the amount given\n!urban - explore the world of urbandictionary!\n!urbanbasic - for if urban does not work!");
			}
			switch(args[0]) {
				case "tragedy":
				message.channel.send("of Darth Plagueis the Wise?");
				break;

        case "highground":
        message.channel.send("ITS OVER ANAKIN! \n\nYou know the rest...");
        break;

				case "server":
				message.channel.send("returns server name and number of people on server");
				break;

				case "user-info":
				message.channel.send("returns information about your user.");
				break;

				case "avatar":
				message.channel.send("returns the avatar of a said user");
				break;

				case "bulkdelete":
				message.channel.send("deletes messages based off the amount given");
				break;

        case "urban":
        message.channel.send("explore the world of urbandictionary!");

        case "urbanbasic":
        message.channel.send("for if urban does not work!");

				case "help":
				message.channel.send("um... yeah... I\'ll send help...");
				break;
			}
		break;
	}
});

// Logs onto discord.
client.login(token);
