// Generate reservation responses

// Random array picker
const randomArrayPicker = require('./random_picker')

class ReturnTuple {
    /* A data class for Conversation return value */
    constructor(signal, text) {
        this.signal = signal
        this.text = text
    }
}

// Template for ordering (additional info)
var reservation_contact = "Can I have your name please?"
var reservation_time = "What would the time be?"
var reservation_total = "How many people?"

// Generate response
module.exports = function generateOrderResp(missing_id) {
    if (missing_id == 1) {
        return new ReturnTuple(0, reservation_contact)
    } else if (missing_id == 2) {
        return new ReturnTuple(0, reservation_time)
    } else if (missing_id == 3) {
        return new ReturnTuple(0, reservation_total)
    }
    return new ReturnTuple(0, "")
}
