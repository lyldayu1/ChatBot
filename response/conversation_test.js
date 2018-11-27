/* Conversation testing module:
 *
 * Put test files and validation files in conversation_tests.
 * conversation_tests/messages:
 *     Customer response, one line per message
 * conversation_tests/validations:
 *     Reference conversation
 *     First line: functionality_index and total_number_of_dishes
 *     Second line to EOF: Sequential attributes for functionality
 *                         or attributes for each dish
 * 
 * Dependencies:
 *     expect: npm install chai
 * Run with "node conversation_test"
 */

 // Modules
const _restaurant_data_module = require('./info_restaurant')
const _order_data_module = require('./info_order')
const _reservation_data_module = require('./info_reservation')
const _feedback_data_module = require('./info_feedback')
const fs = require('fs')
const chai = require('chai')
var expect = chai.expect

// Setting up our bot
let Wit = require('node-wit').Wit
let log = require('node-wit').log
const WitToken = 'RRAEVMQZPZNVJ6P3X4XJMOT6SZTH3ONL'
const wit = new Wit({
    accessToken: WitToken,
    logger: new log.Logger(log.INFO)
})

class MockConversation {
    /* Mock Conversation class that stores reference values.
     * As per design I can only hold one Conversation instance.
     * So that you know the intention of this class.
     */

    constructor() {
        this.stage = 101
        this._id = Math.floor(Math.random()*1000000)
        this._restaurant = new _restaurant_data_module()
        this._order = new _order_data_module()
        this._dishno = 0
        this._reservation = new _reservation_data_module()
        this._feedback = new _feedback_data_module()
        this._multiple_dish_flag = false
        this._bot_confused = false
    }
}

function readOriginalMessages(file) {
    // read customer response line by line
    // return original messages array
    var text = fs.readFileSync(file).toString()
    var textByLine = text.split("\n")
    return textByLine
}

async function botProcessing(original_messages, test_c) {
    for (var i = 0; i < original_messages.length; i ++) {
        s = original_messages[i]
        let ret = await wit.message(s).then(({entities}) => {
            test_c.converse(entities)
        })
        .catch((err) => {
            console.error('Error from Wit: ', err.stack || err);
        })
    }
    return 0
}

function readCorrectConversation(reference_conversation_file,
                                 reference_conversation) {
    // Read and parse the expected conversation output file
    // return a pre-constructed order
    reference_conversation.stage = 999
    var text = fs.readFileSync(reference_conversation_file).toString()
    var textByLine = text.split("\n")
    var firstLine = textByLine[0].split(", ")
    var signal = firstLine[0]
    var ttn = firstLine[1]
    for (var i = 1; i < textByLine.length; i ++) {
        var currentLine = textByLine[i].split(", ")
        console.log(currentLine)
    }
    return 0
}

function validateConversationOrder(test_c, validation_c) {
    // check test order status
    expect(test_c.stage).to.equal(999)
    expect(test_c._order.whatIsNotFilled()).to.equal((0, 0))
    expect(test_c._order.dishlist.length).to.equal(
        validation_c._order.dishlist.length)
    // iterate through dishlist one by one
    var len = test_c._order.dishlist.length
    for (var i = 0; i < len; i ++) {
        var type = test_c._order.dishlist[i].type
        // expect type equal
        expect(type).to.equal(validation_c._order.dishlist[i].type)
        // expect every attribute equal
        if (type == "Burger") {
            expect(test_c._order.dishlist[i].food_type).to.equal(
                validation_c._order.dishlist[i].food_type)
            expect(test_c._order.dishlist[i].if_combo).to.equal(
                validation_c._order.dishlist[i].if_combo)
            expect(test_c._order.dishlist[i].onion).to.equal(
                validation_c._order.dishlist[i].onion)
            expect(test_c._order.dishlist[i].lettuce).to.equal(
                validation_c._order.dishlist[i].lettuce)
            expect(test_c._order.dishlist[i].tomato).to.equal(
                validation_c._order.dishlist[i].tomato)          
        } else if (type == "Fries") {
            continue
        } else if (type == "Drink") {
            expect(test_c._order.dishlist[i].size).to.equal(
                validation_c._order.dishlist[i].size)
        } else if (type == "UnsizeableDrink") {
            expect(test_c._order.dishlist[i].drink_type).to.equal(
                validation_c._order.dishlist[i].drink_type)
        } else {
            throw "validateConversationOrder() encountered " + 
                  "invalid food type."
        }
    }
    return 0
}

function validateConversation(signal, test_c, ref_c) {
    var res = 0
    if (signal == 0) {
        // Order
        res = validateConversationOrder(test_c, ref_c)
    } else if (signal == 1) {
        // Reservation
        res = validateConversationReservation(test_c, ref_c)
    } else if (signal == 3) {
        // Feedback
        res = validateConversationFeedback(test_c, ref_c)
    } else {
        throw "validateConversation() encountered " + 
              "invalid signal code: " + String(signal) + "."
    }
    expect(res).to.equal(0)
    return 0
}

function conversationTest(original_messages_file,
                          reference_conversation_file) {
    // Validate conversation to reference
    var reference_conversation = new MockConversation()
    var signal = readCorrectConversation('./conversation_tests/validations/' +
                                         reference_conversation_file,
                                         reference_conversation)
    // Do the conversation
    var orig_messages = readOriginalMessages('./conversation_tests/messages/' +
                                             original_messages_file)
    const test_conversation = require('./conversation')
    botProcessing(orig_messages, test_conversation)
    var res = validateConversation(signal,
                                   test_conversation,
                                   reference_conversation)
    expect(res).to.equal(0)
    return 0
}

// console.log(readOriginalMessages('./conversation_tests/messages/test_o1'))

function startTest() {
    var msg_files = fs.readdirSync('./conversation_tests/messages')
    var val_files = fs.readdirSync('./conversation_tests/validations')
    var res = 0
    for (var i = 0; i < msg_files.length; i ++) {
        res = conversationTest(msg_files[i], val_files[i])
        expect(res).to.equal(0)
    }
    return 0
}

startTest()
