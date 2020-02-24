const log = require('../../util/util.js').log;
const util = require('../../util/util.js');
const userManager = require('../../GuildHall/userManager.js')
const characterManager = require('../../GuildHall/characterManager.js')

let name = `template`;

module.exports.help = {
	name: name,
	description: 'templated command to be copied to new commands',
	format: `!${name} @user <numberAmount>`,
	note: 'if xp is floating point, it will be rounded'
}

module.exports.permissions = {
	userPermissions: {
		admin: false,
		dm: false,
		player: false
	},
	locationPermissions: {
		activeGuild: false,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false
	}
}

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("performing function...")

	// parse args and test them
	try{
		if(args.length < 1 ) throw `awardXp requires at least 1 argument (you provided ${args.length})`;
		let discordId = args[0].slice(3,args[0].length-1)
		let target
		let xp
		target = await userManager.getUserByDiscordId(discordId);
		if (!util.isUser(target)) {
			throw `issue with awarding Xp to ${args[0]}, please tag the user you wish to give Xp to.`
		}
		xp = parseInt(args[1]);
		if( isNaN(xp) || typeof xp != 'number') throw `issue with awarding xp amount '${args[1]}', numbers only please.`

		// do the actual operation
		let res = await characterManager.awardXp(target, xp);

		// update reply and log it
		let txt = `successfully awarded ${xp} xp! ${res.firstName} only needs ${res.remainingExperience} to hit level ${res.level +1}`;
		msg.edit(txt);
		log(txt,true)
	}
	catch(err){

		// if there is a problem, log it and inform the user
		log(err,true)
		let txt = `use the format ${exports.help.format}\n`+ err;
		msg.edit(txt);
	}
}