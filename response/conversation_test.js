const conversation_module = require('./conversation')

function readOriginalMessages(file) {
    // read customer response line by line
    // return original messages array
    var text = fs.readFileSync(file)
    var textByLine = text.split("\n")
    return textByLine
}

function botProcessing(original_messages) {
    // Feed messages into bot, generate list of the parsed dict
    return 0
}

function readCorrectConversation(reference_conversation_file) {
    // Read and parse the expected conversation output file
    // return a pre-constructed order
    return 0
}

function validateConversation(test_c, validation_c) {
    // compare attributes one by one
    return 0
}

function conversationTest(original_messages_file,
                          reference_conversation_file) {
    var orig_messages = readOriginalMessages(original_messages_file)
    var parsed_messages = botProcessing(orig_messages)
    var test_conversation = new conversation_module()
    for (var i = 0; i < parsed_messages.length; i ++) {
        test_conversation.converse(parsed_messages[i])
    }
    // Test1: See if conversation concludes
    if (c._stage != 999) {
        return 1
    }
    var reference_conversation = readCorrectConversation(
                                     reference_conversation_file)
    var res = validateConversation(test_conversation,
                                   reference_conversation)
    // Test2: See if conversation is correct
    if (res == 1) {
        return 1
    }
    return 0
}

function startTest() {
    var fs = require(fs)
    var msg_files = fs.readdirSync('./conversation_tests/messages')
    var val_files = fs.readdirSync('./conversation_tests/validations')
    var res = 0
    for (var i = 0; i < msg_files.length; i ++) {
        res = conversationTest(msg_files[i], val_files[i])
        if (res == 1) {
            console.log("Conversation Test Failed at test " + toString(i))
            return 1
        }
    }
}

startTest()
