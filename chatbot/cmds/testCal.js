const log = require('../../util/util.js').log;
const util = require('../../util/util.js');
const adventureManager = require('../../GuildHall/adventureManager.js')

const calendarId = process.env.G_CALENDAR_ID;

let name = `testCal`;

module.exports.help = {
	name: name,
	description: 'a command to test calendar functions',
	format: `!${name}`,
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

let {google} = require('googleapis');
let privatekey = require("../../google/gServiceKey.json");

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
	privatekey.client_email,
	null,
	privatekey.private_key,
	['https://www.googleapis.com/auth/spreadsheets',
	 'https://www.googleapis.com/auth/drive',
	 'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	} else {
		console.log("Successfully connected!");
	}
});

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("performing function...")

	let calendar = google.calendar({
		version: 'v3',
		auth: jwtClient,
		calendarId: calendarId
	});

	// listCalendars()
	// listEvents()
	newEvent()

	async function listCalendars() {
		let response
		try {
			response = await calendar.calendarList.list()
		}
		catch(e){
			log('Error encountered when trying to list calendars...',true)
			log(e,true)
		}
		log('response:',true)
		log(await response.data,true)
	}
	
	async function listEvents() {
		let response
		try {
			response = await calendar.events.list({calendarId: calendarId})
		}
		catch (err) {
			log('The API returned an error:',true)
			log(err,true);
			return;
		}
		log(response.data,true)
		var events = response.data.items;
	}

	
	async function newEvent() {
		let event = {
			'summary': 'VERY IMPORTANT GOBLINA TEST',
			'location': '800 Howard St., San Francisco, CA 94103',
			'description': 'A chance to hear more about Goblina products.',
			'start': {
				'dateTime': '2020-03-28T09:00:00-07:00',
				'timeZone': 'America/Los_Angeles',
			},
			'end': {
				'dateTime': '2020-03-28T17:00:00-07:00',
				'timeZone': 'America/Los_Angeles',
			},
			'attendees': [
				{'email': process.env.TEST_EMAIL}
			]
		};
		
		let calendarEvent = {
			calendarId: calendarId,
			resource: event
		}

		let response
		try {
			response = await calendar.events.insert(calendarEvent)
		}
		catch(err){
			log('There was an error contacting the Calendar service:',true);
			log(err,true)
			return;
		}
		log("response:",true);
		log(response.data,true);
	}
	// adventureManager.test();



	/*/ parse args and test them
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
	*/
}