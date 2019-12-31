// newCharacter.js
const log = require('../../util/util.js').log;
let Character = require('./../../Character.js').Character;

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating character...")

	log('args:',true)
	log(args,true);
	// check to see if discord ID is valid
	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let discordId = args[0].slice(3,args[0].length-1);//message.author.id;
	log('discordId:',true)
	log(discordId,true)
	let member = guild.member(discordId)
	if(!member)
	{
		message.channel.send(`${discordId} is not a valid discord ID from this guild. As a result, no character <@${discordId}> has been initialized`);
	}

	new Character(args[1],member)

	await message.channel.send({files: [
		{
			attachment: message.author.displayAvatarURL,
			name: "avatar.png"
		}
	]})

	msg.delete();
}

module.exports.help = {
	name: 'newCharacter',
	description: 'initializes new character\nsyntax:\n!newCharacter @<user> <FullName>'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: true
	},
	locationPermissions: {
		activeGuild: true,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: true
	}
}