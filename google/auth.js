require('dotenv').config()
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const fs = require('fs');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './google/google_token.json';

getAuth().then(auth => {
    listEvents(auth)
})


function getAuth(credentials) {
    return new Promise((resolve, reject) => {
        let client_id = process.env.GOOGLE_CLIENT_ID
        let client_secret = process.env.GOOGLE_CLIENT_SECRET
        let redirect_uris = process.env.GOOGLE_REDIRECT_URL

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

  // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client);
            oAuth2Client.setCredentials(JSON.parse(token));
            resolve(oAuth2Client);
        });
    })
}

function getAccessToken(oAuth2Client) {
    return new Promise( (resolve,reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log(`Authorize this app by visiting this url:\n\n${authUrl}\n\n`);
        const rlInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rlInterface.question('Enter the code from the oauth2 page to the command line: ', (code) => {
            rlInterface.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) reject(console.error('Error retrieving access token', err));
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
            resolve(oAuth2Client);
            });
        });
    })
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
