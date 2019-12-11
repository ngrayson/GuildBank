const db = require('../db.js');
const validators = require('./db_validators.js')
const log = require('../util/util.js').log;
const util = require('../util/util.js');

function updateCollectionValidator(collname) {
	return new Promise((resolve, reject) => {
		if(validators.hasOwnProperty(collname)){
			log('updating the following validator:')
			log(validators[collname]);


			let command = validators[collname];
			return new Promise((resolve, reject) => {
				db.runCommand(command).then(result => {
					resolve(result)
					log(result);
				}, reason => {
					log(error,true);
				})
			})
		}
		else{
			log(`ERROR: no validators with the name ${collname} was found`,true);
			throw `ERROR: attempted to use a validator that does not exist`;
		}
	})

}

function updateAllCollectionValidatiors(targetCollection) {

}

module.exports = updateCollectionValidator;