const log = require('../util/util.js').log;

require('dotenv').config()

let databaseBooted = false;

const MONGO_UN = process.env.MONGO_UN;
const MONGO_PW = process.env.MONGO_PW;
const mongoUrl = 
	'mongodb+srv://' + 
	MONGO_UN + 
	':' + 
	MONGO_PW + 
	'@loom-nsyqv.azure.mongodb.net/test?retryWrites=true&w=majority';

const MongoClient = require('mongodb').MongoClient

const client = new MongoClient(mongoUrl, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

client.connect((err, database) => {
	if (err) return log (err, true)
	log('\x1b[32m'+
		' ✓' +
		'\x1b[0m' +
		' Connected to the databse as ' +
		'\x1b[7m' +
		 MONGO_UN +
		'\x1b[0m',
		true)
	db = client.db('loom')	
	databaseBooted = true;
})
log('  MongoDB connection initializing...', true);

function getFullCollectionArray(collectionName) {
	log('grabbing collection: ' + collectionName, true);
	return new Promise((resolve, reject) => {
		db.collection(collectionName,{strict:true}, (err, col) => {
			if(err) return log(err, true);
			resolve(col.find().toArray());
		});
	});
}

function getElementIn(request, collection) {
	log('looking for entry in '+collection,true);
	return new Promise((resolve,reject) => {
		db.collection(collection).find(request, (err, res) => {
			if(err) return log(err, true);
			resolve(res.toArray());
		})
	})
}

function getMonsterArray() {
	return getFullCollectionArray('monsters');
}

function addEntry(request,collection) {
	log('adding entry to '+ collection, true);
	return new Promise((resolve, reject) => {
		db.collection(collection,{strict:true}, (err, col) => {
			if(err) return log(err, true);
			col.insertOne(request, (err, result) => {
				if (err) return log(err, true);
				resolve("Successfully added an entry to " + collection + "!");
			});
		});
	});
}

function editMonster(filter, update, options) {
	log('updating monster', true);
	return new Promise((resolve,reject) => {
		db.collection('monsters')
		.updateOne(filter,update,options,
	  	(err, result) => {
	    	if (err) return log(err, true);
	    	if(result.modifiedCount > 0)
	    		log("Success! " +
	    			result.modifiedCount +
	    			" etnries were modified",
	    			true);
	    	else
	    		log("Everything went through but nothing was modified.", true)
	    	resolve(result)
	  	})
	})
}

function deleteMonster(filter, options) {
	log('deleting monster', true);
	return new Promise((resolve, reject) => {
		db.collection('monsters',{strict:true}, (err, col) => {
			if(err) return log(err, true);
			col.deleteOne(filter, (err, result) => {
				if (err) return log(err, true);
				log('deleted '+result.deletedCount+'entries', true)
				if(result.deletedCount == 1)
					resolve("Successfully deleted a monster!");
				else if (result.deletedCount == 0)
					resolve("No Monster was deleted");
			});
		});
	});
}

function runCommand(command, options) {
	log('running command on remote Db:', true);
	log(command, true)
	return new Promise((resolve, reject) => {
		db.command(command, options, (err, result) => {
			if(err) return log(err, true);
			else resolve('great success!');
		});
	});
}

function getCollectionInformation(targetCollection) {
	log('Attempting to get information on the collection: '+targetCollection, true);
	return new Promise((resolve,reject) => {
		db.getCollectionInfos( {name: targetCollection}, (resolve, reject) => {
			if(err) return log(err, true);
			else reslove(result);
		});
	})	
}

function newColl(collname) {
	log('Attempting to make a new collection named '+ collname, true);
	return new Promise(( resolve,reject) => {
		db.createCollection(collname).then(result => {
			resolve(result)
	 		}, reason => {
	 		log(reason, true);
	 		}
		)
	})
}

function databaseReady() {
	return databaseBooted;
}

module.exports = {
	databaseReady,
	getMonsterArray,
	addEntry,
	editMonster,
	deleteMonster,
	runCommand,
	newColl,
	getFullCollectionArray,
	getElementIn
}