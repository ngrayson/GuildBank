//nameChange.js

const log = require('../../util/util.js').log;
const playerManager = require('./../../db/playerManager.js');

function nameChange(oldMember, newMember) {
	let oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
	let newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;

	log(`${oldName} changed name to ${newName}`,true)

	playerManager.updatePlayerNameById(newMember.user.id,newName);

}

module.exports = nameChange