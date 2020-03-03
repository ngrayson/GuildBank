const Auth = require('./auth.js');
const {google} = require('googleapis')

async function calendarApi(){
    let auth = await Auth();
    return google.calendar({version: 'v3', auth: auth, calendarId: 'primary',});
}

module.exports = calendarApi;