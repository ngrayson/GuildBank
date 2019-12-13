const players = require('../../db/playermanager.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'initializePlayers',
	description: 'attempts to initialize all members of current guild with the correct role'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: false,
		player: false
	},
	locationPermissions: {
		activeGuild: true,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: true
	}
}

module.exports.run = async(bot, message, args) => {


	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let members = guild.members;

	let report = '';

	let totalMembers = members.array().length;
	let rolelessMembers = 0;
	let roledMembers = 0;
	let alreadyInitialized = 0;
	let toBeInitialized = 0;
	let successes = [];
	let failures = [];

	members.forEach(member => {

		let newPlayer = {
			discordHandle: member.nickname ? member.nickname : member.user.username,
			discordId: member.id
		}

		if(member.roles.some(role => role.name == 'DnD Player')) {
			log(`${newPlayer.discordHandle} has the DnD Player Role!`)
			roledMembers++;
			players.initializePlayer(newPlayer).then(res =>{
				log(`initialized player ${newPlayer.discordHandle}`,true)
				toBeInitialized++;
				successes.push(newPlayer.discordHandle);
			}).catch(err => {
				log(err,true);
				if(err.search(`LOOMERROR: player already initialized`) != -1){
					alreadyInitialized++;
				}
				else{
					failures.push(newPlayer.discordHandle);
				}
			});
		}
		else 
			rolelessMembers++;
	})

	report += `totalMembers: ${totalMembers}\n`+
				`rolelessMembers: ${rolelessMembers}\n`+
				`roledMembers: ${roledMembers}\n`+
				`alreadyInitialized: ${alreadyInitialized}\n`+
				`toBeInitialized: ${toBeInitialized}\n`+
				`successes: ${successes.length}\n`+
				`failures: ${failures.length}\n`;
	let msg = await message.channel.send(report);
}