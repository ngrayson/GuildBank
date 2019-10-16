// start with npm run dev to run in development mode (refresh on save)
require('dotenv').config()

// express bits
const express = require('express');
const webApp = express();
const PORT = 3000;
const router = require('./server/webserver');

webApp.listen(PORT, function() {
	console.log('listening to webserver on ' + PORT);
})

webApp.set('view engine', 'ejs')

webApp.use(router);