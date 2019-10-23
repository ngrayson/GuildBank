const db = require('../db.js');
const validators = require('./db_validators.js')

function updateCollectionValidator() {
	let command = validators.charactersValidator;
	return new Promise((resolve, reject) => {
		db.runCommand(command).then(result => {
			resolve(result)
		}, reason => {
			console.log(error);
		})
	})
}

function updateAllCollectionValidatiors(targetCollection) {

}

module.exports = updateCollectionValidator;