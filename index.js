'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const pagetoken = "EAACnr1hZBTZCoBAAvWCLAmoBcpftKOp2LKn3o2l5pMj6ZC7wf4ZA6KqFZCeswXCok3kURaAaDLbYjIvuZAiIxC3mLq29pRodX6undV7fZCXfQHLT5HAXrvwmpHSbUoJj5ZBd5d7R8N1eqEqnRvVRzaCoS3cPu3Rn1mZBkvq12xpwfbQTtIWLgVQQF"
var mysql = require('mysql');
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));


function connectSql(UID,Time,Content){
  con.connect(function(err) {
  if (err){
    console.log(err);
  }else{
    console.log("Connected!")
    var sql="INSERT INTO Conversations (UID,Time, Content) VALUE ("+UID+","+Time+",'"+Content+"')";
    con.query(sql,function(err,result){
    if(err)throw err;
      console.log("record inserted");
    });
  }
});
}



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

  body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

  // Checks this is an event from a page subscription
//  if (body.object === 'page') {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      let timestamp=event.timestamp;
      if (event.message && event.message.text) {
        let text = event.message.text;
        connectSql(sender,timestamp,text.substring(0, 200));
        sendTextMessage(sender, "hello: " + text.substring(0, 200))
      }
    }
    // body.entry.forEach(function(entry) {

    //   // Gets the message. entry.messaging is an array, but 
    //   // will only ever contain one message, so we get index 0
    //   let webhook_event = entry.messaging[0];
    //   console.log(webhook_event);
    // });
    
     res.sendStatus(200);
  // } else {
  //   // Returns a '404 Not Found' if event is not from a page subscription
  //   res.sendStatus(404);
  // }

});


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:pagetoken},
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



var con = mysql.createConnection({
	host: "chatbot.cgwtow8tax0g.us-east-2.rds.amazonaws.com",
	user: "lyldayu",
	password: "ChatBot9",
	port: "3306",
	database: "ChatBot"
});
// var count=3;
// con.connect(function(err) {
//   if (err)
//   {
//     console.log("ERROR in connection to DB")
//   }
//   else
//   {
//     console.log("Connected!")
//     var sql="CREATE TABLE customers"+count+" (name VARCHAR(255), address VARCHAR(255))";
//     count++;
//     con.query(sql,function(err,result){
//       if(err)throw err;
//       console.log("Table created");
//     })
//   }

// });


