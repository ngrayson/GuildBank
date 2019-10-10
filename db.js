require('dotenv').config()

const MONGO_UN = process.env.MONGO_UN;
const MONGO_PW = process.env.MONGO_PW;
const mongoUrl = 
	'mongodb+srv://' + 
	MONGO_UN + 
	':' + 
	MONGO_PW + 
	'@loom-nsyqv.azure.mongodb.net/test?retryWrites=true&w=majority';

const MongoClient = require('mongodb').MongoClient

const client = new MongoClient(mongoUrl);

client.connect((err, database) => {
	if (err) return console.log (err)
	console.log("Connected to databse")
	db = client.db('loom')	
})

function getMonsterArray() {
	console.log('calling monsters');
	return new Promise((resolve, reject) => {
		db.collection('monsters',{strict:true}, (err, col) => {
			if(err) return console.log(err);
			resolve(col.find().toArray());
		});
	});
}

function addMonster(request) {
	console.log('adding monster');
	return new Promise((resolve, reject) => {
		db.collection('monsters',{strict:true}, (err, col) => {
			if(err) return console.log(err);
			col.insertOne(request, (err, result) => {
				if (err) return console.log(err);
				resolve("Successfully added a monster!");
			});
		});
	});
}

function editMonster(filter, update, options) {
	console.log('updating monster');
	return new Promise((resolve,reject) => {
		db.collection('monsters')
		.updateOne(filter,update,options,
	  	(err, result) => {
	    	if (err) return console.log(err);
	    	if(result.modifiedCount > 0)
	    		console.log("Success! " +
	    			result.modifiedCount +
	    			" etnries were modified");
	    	else
	    		console.log("Everything went through but nothing was modified.")
	    	resolve(result)
	  	})
	})
}

function deleteMonster(filter, options) {
	console.log('deleting monster');
	return new Promise((resolve, reject) => {
		db.collection('monsters',{strict:true}, (err, col) => {
			if(err) return console.log(err);
			col.deleteOne(filter, (err, result) => {
				if (err) return console.log(err);
				console.log('deleted '+result.deletedCount+'entries')
				if(result.deletedCount == 1)
					resolve("Successfully deleted a monster!");
				else if (result.deletedCount == 0)
					resolve("No Monster was deleted");
			});
		});
	});
}

function runCommand(command, options) {
	console.log('running command on remote Db:');
	console.log(command)
	return new Promise((resolve, reject) => {
		db.command(command, options, (err, result) => {
			if(err) return console.log(err);
			else resolve('great success!');
		});
	});
}

function getCollectionInformation(targetCollection) {
	console.log('Attempting to get information on the collection: '+targetCollection);
	return new Promise((resolve,reject) => {
		db.getCollectionInfos( {name: targetCollection}, (resolve, reject) => {
			if(err) return console.log(err);
			else reslove(result);
		});
	})	
}

function newColl(collname) {
	console.log('Attempting to make a new collection named '+ collname);
	return new Promise(( resolve,reject) => {
		db.createCollection(collname).then(result => {
			resolve(result)
	 		}, reason => {
	 		console.log(reason);
	 		}
		)
	})
}

module.exports = {
	getMonsterArray,
	addMonster,
	editMonster,
	deleteMonster,
	runCommand,
	newColl
}