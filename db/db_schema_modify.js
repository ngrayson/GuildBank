const db = require('../db.js');
const validators = require('./db_validators.js')
const log = require('../util/util.js').log;

function updateCollectionValidator() {
	let command = validators.sessionsValidator;
	return new Promise((resolve, reject) => {
		db.runCommand(command).then(result => {
			resolve(result)
			log(result, true);
		}, reason => {
			log(error,true);
		})
	})
}

function updateAllCollectionValidatiors(targetCollection) {

}

module.exports = updateCollectionValidator;