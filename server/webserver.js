require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const PORT = 3000;
const db = require('../db.js');
const dbModify = require('../db/db_schema_modify.js');

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

module.exports = router;