// Generate feedback responses

// Random array picker
function _randomPick(a){
    var randomAnswer = a[Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for ordering (additional info)
var feedback_body = "What would the feedback be?"
var feedback_ratings = "Would you like to give a rating? (On a scale from 1 to 5)"

// Generate response
module.exports = function generateFeedbackResp(progress_stage) {
    if (progress_stage == 1) {
        return 0, feedback_body
    } else if (progress_stage == 2) {
        return 0, feedback_ratings
    }
    return 0, ""
}
