const db = require('../../db/db.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'players',
	description: 'prints out information about all registered players'
}

module.exports.permissions = {
	admin: true,
	dm: true,
	player: false
}

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating player info...")

	let playerArray = await db.getFullCollectionArray('players');

	await message.channel.send(playerInfo(playerArray))

	msg.delete();
}

function playerInfo(playerArray) {
	let infoString = `There are currently ${playerArray.length} active players`;
	playerArray.forEach(player => {
		infoString += `\n ${player.name}: \n  DiscordID: ${player.discordID}`
	})
	return infoString;
}