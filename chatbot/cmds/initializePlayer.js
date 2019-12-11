const db = require('../../db.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'initializePlayer',
	description: 'initializes a user as a game player'
}

module.exports.permissions = {
	admin: true,
	dm: false,
	player: false
}

module.exports.run = async(bot, message, args) => {

	log(args);

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
