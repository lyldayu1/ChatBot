'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = "EAAFV4wUyJZAwBAC9ZANzbez1SqUeQ3a3K9gDyI6SSkxrlhyct42oNCcDE3W4yUPDTQYjqV5AXDfe9IHePmPzZBwC4LRHHQrtbzH1wvCzf1ahXNT5cbxJRqZBeobuOTXcFLPiPtqNvR14IQt8KKG6Xtg3ivBMaZAkhnhT4XFUGhgZDZD"

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));



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
      res.status(200).send("success");
    
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
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// function sendTextMessage(sender, text) {
//     let messageData = { text:text }
//     request({
// 	    url: 'https://graph.facebook.com/v2.6/me/messages',
// 	    qs: {access_token:token},
// 	    method: 'POST',
// 		json: {
// 		    recipient: {id:sender},
// 			message: messageData,
// 		}
// 	}, function(error, response, body) {
// 		if (error) {
// 		    console.log('Error sending messages: ', error)
// 		} else if (response.body.error) {
// 		    console.log('Error: ', response.body.error)
// 	    }
//     })
// }

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
