'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = "EAAENbke6IW4BAEx4zwdXGFPGH9zICr8fBdu7YbJ9V7ZBH8ZCLWDJMwF1qOsSfgF5HwgeEDiY0CEL9ERFSxSNUES4MdAzBLZA6haV3mZBVFhZCm0vdVplBfF4rURbxelOJJokQ0ZCBsXr6fufxPB6FLxZCAbRl4wj01TIZBuq6psFq16SAinhs9oW"

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));



// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.

  let VERIFY_TOKEN = "yuliangzz"
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});




// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
//  if (body.object === 'page') {

    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        sendTextMessage(sender, "hello: " + text.substring(0, 200))
      }
    }
    res.sendStatus(200)
//  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
//    res.sendStatus(404);
//  }

});


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "chatbot.cgwtow8tax0g.us-east-2.rds.amazonaws.com",
	user: "lyldayu",
	password: "ChatBot9",
	port: "3306",
	database: "ChatBot"
});

con.connect(function(err) {
	if (err)
	{
		console.log("ERROR in connection to DB")
	}
	else
	{
		console.log("Connected!")

	}

});
