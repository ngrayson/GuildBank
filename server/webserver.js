require('dotenv').config({path: '/../.env'})
const express = require('express');
const bodyParser = require('body-parser')

const WEBSERVER_ENABLED = process.env.WEBSERVER_ENABLED == 1;
const db = require('../db.js');
const dbModify = require('../db/db_schema_modify.js');

let webserverReady = false;

function run() {
  if(WEBSERVER_ENABLED) {
  	const webApp = express();
  	const PORT = 3000;
  	webApp.set('view engine', 'ejs')
  
  	webApp.listen(PORT, () => {
  		console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
  			' ✓',
  			' Webserver listening on port ', PORT);
  		webserverReady = true;
  	})
  	webApp.use(router);
  	console.log('  Webserver app initializing...');
  }
}

function isReady() {
  return webserverReady;
}



// WHoever has to fix this later, myself included, I am sorry
// the above code should be easy to understand and work, no promises on the below code.
// I had used the router for something i tried to be fancy doing but it was wrong.



var router = express.Router();

router.use(express.static('public'))
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

router.use((req, res, next) => {
	console.log('Request type:' + req.method);
	next();
});

// read request
router.get('/', function(request, response) {
	db.getMonsterArray().then((results) => {
		response.render('index.ejs',{monsters: results})
		console.log(results.length + ' monsters!')
	}).catch(function(err) {
		console.log('ERROR: unable to get monsters from DB')
		console.log(err)
	});
})

// append request
router.post('/monsters', (request, response) => {
	console.log("monster recieved");
	console.log(request.body);
	db.addMonster(request.body).then((successMessage) => {
		console.log(successMessage);
		response.redirect('/');
	});
})

router.post('/validator', (request,response) => {
	console.log("validation update request recieved");

	let newDbName = 'characters';

	// db.newColl(newDbName).then(result =>{
	// 	console.log(result);
	// });
	dbModify();
})

// update request
router.put('/monsters', (request, response) => {
	db.editMonster(
		{

		},
		{
    		$set: {
      			name: request.body.name,
      			special: request.body.special
    		}
    	},
    	{
    		sort: {_id: 1},
    		upsert: true
  		}
    ).then(result => {
    	response.send(result);
    	// response.redirect('/');
    }, err => {
    	response.send(err);
    	console.log("ERROR Updating Monster");
    	console.log(err);
    })
})

// delete request
router.delete('/monsters', (request, response) => {
	db.deleteMonster(
		//query
	{
		name: request.body.name
	},
		//options
	{

	}).then(result => {
		response.redirect('/');
    }, err => {
    	response.send(err);
    	console.log("ERROR Deleting Monster");
    	console.log(err);
    })
})

module.exports = {
  run,
  isReady
  }