// Generate ordering food responses

// Random array picker
const randomArrayPicker = require('./random_picker')

// Response templates for ordering food
var ordering_food_type = [
    // order the first dish
    "What would you like to have today?",
    "What can I get for you today?",
    "What can I get for you?",
    "What would you like to order?",
    "What would you like to eat?",
    "How can I help you with your order?"
]
var ordering_food_type_another = [
    // order next dish
    "What else?",
    "What else do you need?",
    "What would you like to order next?"
]
var ordering_combo = [
    "Would you like to make it a combo?",
    "Would it be a combo?",
    "Would you want it to be combo?",
    "Do you want combo?"
]
var ordering_onions = [
    "With or without onions?",
    "Do you want onions?",
    "Would it be OK to have onions?",
    "Onions?"
]
var ordering_confirmation = [
    // Followed by Order.customerReport(), so
    // Do not forget the whitespace at the end
    "Gotcha. ",
    "Alrighty then. ",
    "All right! "
]
var ordering_else = [
    "Anything else?",
    "Anything else for you?",
    "Need anything else?",
    "Would you like to order another dish?"
]

// Generate response
module.exports = function generateOrderResp(progress_stage,
                                            if_multi,
                                            missing_id) {
    // console.log("MISSING_ID = " + String(missing_id))
    if (progress_stage == 1) {
        if (if_multi == true) {
            return 0, randomArrayPicker(ordering_food_type_another)
        } else {
            return 0, randomArrayPicker(ordering_food_type)
        }
    } else if (progress_stage == 2) {
        if (missing_id == 2) {
            return 0, randomArrayPicker(ordering_combo)
        } else if (missing_id == 3) {
            return 0, randomArrayPicker(ordering_onions)
        }
    } else if (progress_stage == 3) {
        return 0, randomArrayPicker(ordering_confirmation)
    } else if (progress_stage == 9) {
        return 0, randomArrayPicker(ordering_else)
    } 
    return 0, ""
}
