// Generate ordering food responses

// Random array picker
function _randomPick(a){
    var randomAnswer = [Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for ordering (additional info)
var ordering_food_type = "What would you like to have today?"
var ordering_food_type_another = "What else?"
var ordering_combo = "Combo or just sandwich?"
var ordering_onions = "With or without onions?"
var ordering_confirmation = "Gotcha. "
var ordering_else = "Anything else?"

// Generate response
module.exports = function generateOrderResp(progress_stage, if_multi, missing_id) {
    console.log("MISSING_ID = " + String(missing_id))
    if (progress_stage == 1) {
        if (if_multi == true) {
            return 0, ordering_food_type_another
        } else {
            return 0, ordering_food_type
        }
    } else if (progress_stage == 2) {
        if (missing_id == 2) {
            return 0, ordering_combo
        } else if (missing_id == 3) {
            return 0, ordering_onions
        }
    } else if (progress_stage == 3) {
        return 0, ordering_confirmation
    } else if (progress_stage == 9) {
        return 0, ordering_else
    } 
    return 0, ""
}
