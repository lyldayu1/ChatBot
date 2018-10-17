'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())



// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	    }
		con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		});
    }
    res.sendStatus(200)
})

const token = "EAAFV4wUyJZAwBALlLJMoW0xYEdQVEf7X83V0xu3cwhJHi2ZCsoUkOtTxAtE331FZBkUX8N0MkAPGZAFAV9C45kVJOirvTgpTH22CK8mQATPiZCkweYkFoRZBOm82o58ttqUFb7nz5nwgiURm1fbmZCZArMZAEulsLRTPTqDkZAuexZAzgxSOS1tVGZBg"

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
  host: "chatbot.cgwtow8tax0g.us-east-2.rds.amazonaws.com:3306",
  user: "lyldayu",
  password: "ChatBot9"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});
