// Generate greetings

// Import
const _restaurant = require('./info_restaurant')

// Global info
const restaurant = new _restaurant()
const _restaurant_name = restaurant._name

// Random array picker
function _randomPick(a){
    var randomAnswer = a[Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for greeting
var greeting_textbody = {
    "start_greet": ["Greetings and", "Hello and"],
    "timed_greet": ["good morning!", "good afternoon!", "good evening!"],
    "restaurant_greet": "Welcome to " + _restaurant_name + "!",
    "helping_greet": ["What can I help you with?",
                      "How can I help you?"],
    "before_intent": ["Do you want to",
                      "Would you want to",
                      "Would you like to"],
    "intents": "make an order or make a reservation? You can also ask"
                + " everything about our restaurant!"
}

// Generate greetings
module.exports = function generateGreetings() {
    // Choose timed_greet
    var date = new Date();
    var current_hour = date.getHours();
    if (current_hour < 12) {
        timed_greet = greeting_textbody.timed_greet[0];
    } else if (current_hour < 18) {
        timed_greet = greeting_textbody.timed_greet[1];
    } else {
        timed_greet = greeting_textbody.timed_greet[2];
    }
    
    // Construct body
    var body = [_randomPick(greeting_textbody.start_greet),
                timed_greet,
                greeting_textbody.restaurant_greet,
                _randomPick(greeting_textbody.helping_greet),
                _randomPick(greeting_textbody.before_intent),
                greeting_textbody.intents]

    // Return body
    return body.join(" ")
}
