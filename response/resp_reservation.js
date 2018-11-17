// Generate reservation responses

// Random array picker
function _randomPick(a){
    var randomAnswer = a[Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for ordering (additional info)
var reservation_contact = "Can I have your name please?"
var reservation_time = "What would the time be?"
var reservation_total = "How many people?"

// Generate response
module.exports = function generateOrderResp(missing_id) {
    if (missing_id == 1) {
        return 0, reservation_contact
    } else if (missing_id == 2) {
        return 0, reservation_time
    } else if (missing_id == 3) {
        return 0, reservation_total
    }
    return 0, ""
}
