// start with npm run dev to run in development mode (refresh on save)

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;
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
	if (err) return console.log(err)
	db = client.db('loom')
	app.listen(PORT, function() {
		console.log('listening on ' + PORT);
	})
})

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// read request
app.get('/', function(request, response) {
	var cursor = db.collection('monsters').find().toArray(function(err, results) {
		console.log(results)
		response.render('index.ejs',{monsters: results})
	})
})

// append request
app.post('/monsters', (request, response) => {
	console.log("monster recieved");
	console.log(request.body);
	db.collection('monsters').save(request.body, (err, result) => {
		if (err) return console.log(err)
		console.log('saved to database')
		response.redirect('/');
	})
})

// edit request
app.put('/monsters', (req, res) => {
  db.collection('monsters')
  .findOneAndUpdate(
  	{
  		// name: 'Goblin'
  	},
  	{
    $set: {
      name: req.body.name,
      special: req.body.special
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// delete request
app.delete('/monsters', (request, response) => {
	db.collection('monsters')
	.findOneAndDelete(
		//query
	{
		name: request.body.name
	},
		//options
	{

	},
		//callback
	(err, results) => {
		if (err) return response.send(500, err)
		response.send({message: 'A monster got deleted'})
	})
})