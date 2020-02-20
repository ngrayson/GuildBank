const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'status',
	description: 'admin command for checking status of all players'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
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
	
}