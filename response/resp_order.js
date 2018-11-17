// Generate ordering food responses

// Random array picker
function _randomPick(a){
    var randomAnswer = [Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for ordering (additional info)
var ordering_food_type = "What would you like to have today?"
var ordering_combo = "Combo or just sandwich?"
var ordering_combo_size = "Regular or large?"
var ordering_onions = "With or without onions?"
var ordering_drink = "For your drink with the combo, coke, sprite or something else?"

// Generate response
module.exports = function generateOrderResp(progress_stage, if_combo, missing_id) {
    if (progress_stage == 1) {
        return 0, ordering_food_type
    } else if (progress_stage == 2) {
        if (missing_id == 2) {
            return 0, ordering_combo
        } else if (missing_id == 3) {
            return 0, ordering_onions
        }
        if (if_combo == true) {
            if (missing_id == 5) {
                return 0, ordering_combo_size
            } else if (missing_id == 6) {
                return 0, ordering_drink
            }
        }
    }
    return 0, ""
}
