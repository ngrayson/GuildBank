const db = require('../../db.js');
const log = require('../../util/util.js').log;
const schemaModify = require('../../db/db_schema_modify.js');

module.exports.help = {
	name: 'validatorUpdate',
	description: 'Forces database schema validator update'
}

module.exports.permissions = {
	admin: true,
	dm: false,
	player: false
}

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("attempting to modify schema...")
	try {
		let playerArray = await schemaModify(args[0]).then(msg.edit(`Modified ${args[0]} successfully!`));
	} catch (e) {
		log(e, true)
	}
}