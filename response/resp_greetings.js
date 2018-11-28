// Generate greetings

// Import
const _restaurant = require('./info_restaurant')
const randomArrayPicker = require('./random_picker')

// Global info
const restaurant = new _restaurant()
const _restaurant_name = restaurant._name

// Template for greeting
var greeting_textbody = {
    "start_greet": ["Greetings and", "Hello and"],
    "timed_greet": ["good morning!", "good afternoon!", "good evening!"],
    "restaurant_greet": "Welcome to " + _restaurant_name + "!" ,
    "helping_greet": ["What can I help you with?",
                      "How can I help you?",
                      "What can I do for you today?"]
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
    var body = [randomArrayPicker(greeting_textbody.start_greet),
                timed_greet,
                greeting_textbody.restaurant_greet,
                randomArrayPicker(greeting_textbody.helping_greet)]

    // Return body
    return body.join(" ")
}
