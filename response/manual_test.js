/* manual_test
 *
 * Put customer's responses in l
 * Run by: node manual_test
 * You can also use console.log() all debug info in intepret()
 */

const Conversation = require('./conversation')

// Setting up our bot (Wit.AI)
let Wit = require('node-wit').Wit
let log = require('node-wit').log
const WitToken = 'RRAEVMQZPZNVJ6P3X4XJMOT6SZTH3ONL'
const wit = new Wit({
    accessToken: WitToken,
    logger: new log.Logger(log.INFO)
})

async function interpret(l) {
    for (var i = 0; i < l.length; i ++) {
        s = l[i]
        let ret = await wit.message(s).then(({entities}) => {
            // console.log(entities)
            console.log("USER: " + s)
            console.log(" BOT: " + Conversation.converse(entities, s).text)
            console.log(Conversation.stage)
            // console.log(Conversation._order.dishlist[0].print())
        })
        .catch((err) => {
            console.error('Error from Wit: ', err.stack || err);
        })
    }
    // console.log(Conversation._order.dishlist[0].print())
    console.log("=============== Conversation Ends ==================")
}

var l1 = [
    // Ordering multiple dishes in one order
    "i want cheeseburger",
    "no",
    "yes please",
    "i want burger",
    "yes",
    "yes",
    "yes, i want fries",
    "no",
    "yes",
    "no"
]

var l2 = [
    // Ordering one dish with multiple related attributes in one sentence
    "reservation",
    "name's Jason",
    "5:00 pm tomorrow",
    "five of them"
]

var l3 = [
    // Ordering one dish with multiple related attributes in one sentence
    "i'd like a burger without onions",
    "combo",
    "yes",
    "some fries please",
    "yes, a medium drink",
    "no",
    "yes some sauces would be nice",
    "to go",
]

console.log("=============== Conversation Starts ================")
console.log(" BOT: Hi. This is WaitressX. What do you need today?")
interpret(l3)
