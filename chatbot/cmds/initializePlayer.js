const players = require('../../db/playermanager.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'initializePlayer',
	description: 'attempts to initialize a given member of current guild without doing a role check'
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

	log('args:')
	log(args);
	// check to see if discord ID is valid
	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let discordId = args[0].slice(3,args[0].length-1);//message.author.id;
	let member = guild.member(discordId)
	if(!member)
	{
		message.channel.send(`${discordId} is not a valid discord ID from this guild. As a result, no player <@${discordId}> has been initialized`);
	}

	// check to see if name is valid
	let newPlayer = {
		discordHandle: member.nickname ? member.nickname : member.user.username,
		discordId: discordId
	}

	players.initializePlayer(newPlayer).then(res =>{
		let msg = message.channel.send(`Successfully initialized player ${newPlayer.discordHandle}>`);
		log(`initialized player ${newPlayer.discordHandle}`,true)
	}).catch(err => {
		let msg = message.channel.send(`ERROR: Issue initializing player!\n${err}`);
		log(err,true);
	});

}