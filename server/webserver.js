require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;
const db = require('../db.js');
const dbModify = require('../db/db_schema_modify.js');

app.listen(PORT, function() {
	console.log('listening to webserver on ' + PORT);
})

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


var router = express.Router();

app.use((req, res, next) => {
	console.log('Request type:' + req.method);
	next();
});

// read request
app.get('/', function(request, response) {
	db.getMonsterArray().then((results) => {
		response.render('index.ejs',{monsters: results})
		console.log(results.length + ' monsters!')
	}).catch(function(err) {
		console.log('ERROR: unable to get monsters from DB')
		console.log(err)
	});
})

// append request
app.post('/monsters', (request, response) => {
	console.log("monster recieved");
	console.log(request.body);
	db.addMonster(request.body).then((successMessage) => {
		console.log(successMessage);
		response.redirect('/');
	});
})

app.post('/validator', (request,response) => {
	console.log("validation update request recieved");
	dbModify();
	// db.newColl('log').then(result =>{
	// 	console.log(result);
	// });
})

// update request
app.put('/monsters', (request, response) => {
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
app.delete('/monsters', (request, response) => {
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

