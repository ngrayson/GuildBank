const Character = require('../../db/Character.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'testCharacter',
	description: 'tests the character class'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
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
	let sansBar = Character.newCharacter({
		firstName: 'Sansbar',
		lastName: 'Illyn'
	});
	sansBar.then( res => {
		log(`new character created`,true);
		let msg = message.channel.send('Successfully created Sansbar');
	}).catch( err => {
		log(err,true)
		let msg = message.channel.send('ERROR creating Sansbar:\n'+err)
	})
}
