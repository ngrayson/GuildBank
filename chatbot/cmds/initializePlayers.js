const db = require('../../db/db.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'initializePlayer',
	description: 'attempts to initialize all members with correct player tag as DnD'
}

module.exports.permissions = {
	admin: true,
	dm: false,
	player: false
}

module.exports.run = async(bot, message, args) => {

	// log(args);
	// // check to see if discord ID is valid
	// let guild = bot.guilds.get(message.guild);
	// let discordId = args[0];//message.author.id;
	// if(!guild.member(discordId))
	// {
	// 	message.channel.send(`${discordId} is not a valid discord ID, no player initialized`);
	// }

	// // check to see if name is valid
	// let newPlayer = {
	// 	name: 'name',
	// 	discord: 'discord'
	// }





	// let msg = await message.channel.send("generating server icon...")

	// if(!message.guild.iconURL) return msg.edit('This server has no icon')

	// await message.channel.send({files: [
	// 	{
	// 		attachment: message.author.guild.iconURL,
	// 		name: "icon.png"
	// 	}
	// ]})

	// msg.delete();
}
