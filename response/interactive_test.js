/* interactive_test
 *
 * Run by: node interactive_test
 * Ragequit by: exit
 */

const Conversation = require('./conversation')
var prompt = require('prompt')

// Setting up our bot (Wit.AI)
let Wit = require('node-wit').Wit
let log = require('node-wit').log
const WitToken = 'RRAEVMQZPZNVJ6P3X4XJMOT6SZTH3ONL'
const wit = new Wit({
    accessToken: WitToken,
    logger: new log.Logger(log.INFO)
})

async function interpret() {
    while (Conversation.stage != 999) {
        let s = prompt("USER: ")
        if (s == "exit") {
            break
        }
        let ret = await wit.message(s).then(({entities}) => {
            // console.log(entities)
            console.log("USER: " + s)
            console.log(" BOT: " + Conversation.converse(entities))
            // console.log(Conversation.stage)
        })
        .catch((err) => {
            console.error('Error from Wit: ', err.stack || err);
        })
    }
    return 0
}

console.log("=============== Conversation Starts ================")
console.log(" BOT: Hi. This is WaitressX. What do you need today?")
interpret()
console.log("=============== Conversation Ends ==================")