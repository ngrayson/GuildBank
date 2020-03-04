const log = require('../../util/util.js').log;
const util = require('../../util/util.js');
const userManager = require('../../GuildHall/userManager.js')
const characterManager = require('../../GuildHall/characterManager.js')

let name = `newSession`;

module.exports.help = {
	name: name,
	description: 'creates a new Session',
	format: `!${name} <month>/<day>/<year> <Hour(integer, military time)>`,
	note: 'beware!'
}

module.exports.permissions = {
	userPermissions: {
		admin: false,
		dm: true,
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
		if(args.length < 1 ) throw `newSession requires a date argument (you provided ${args.length} arguments)`;
		let dateString = args[0].slice(3,args[0].length-1)
		let dateSplit = dateString.split("/")
		
		let month = parseInt(dateSplit[0])
		let day = parseInt(dateSplit[1])
		let year = parseInt(dateSplit[2])
		if(dateSplit.length != 3 || month == NaN || day == NaN || year == NaN) 
			throw `newSession requires a valid date!`

		let hour = parseInt(args[1]);
		if(hour == NaN || hour>23 || hour <0)
			throw `newSession requires a valid hour!`
		let date = new Date(year,month,date,hour,0,0,0);
		let res = await sessionManager.newSession(message.author.id,date);

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