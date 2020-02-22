const Character = require('../../db/Character.js');
const User = require('../../db/User.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'stats',
	description: 'admin command for checking all Characters'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: true
	},
	locationPermissions: {
		activeGuild: false,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false
	}
}

module.exports.run = async(bot, message, args) => {

	
}