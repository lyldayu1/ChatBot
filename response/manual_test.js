/* manual_test
 *
 * Put customer's responses in l
 * Run by: node manual_test
 * You can also console.log() all debug info in intepret()
 */

const Conversation = require('./conversation')

var l = [
    "i want cheeseburger",
    "no",
    "no",
    "i want burger",
    "yes",
    "yes",
    "yes, i want a cheeseburger combo with extra tomato",
    "extra onion",
    "no thank you",
    "thats correct",
    "no thank you"
]

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
            console.log("USER: " + s)
            console.log(" BOT: " + Conversation.converse(entities))
            // console.log(Conversation.stage)
        })
        .catch((err) => {
            console.error('Error from Wit: ', err.stack || err);
        })
    }
    // console.log(Conversation._order.customerReport())
}

console.log(" BOT: Hi. This is WaitressX. What do you need today?")
interpret(l)
