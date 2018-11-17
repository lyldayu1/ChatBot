// Generate info for restaurant-related queries

const _restaurant_data_module = require('./info_restaurant')
var restaurant = new _restaurant_data_module()

// Random array picker
function _randomPick(a){
    var randomAnswer = a[Math.floor(Math.random() * a.length)];
    return randomAnswer
}

// Template for ordering (additional info)
var restaurant_address = "Our address is " + restaurant._address + "."
var restaurant_opening = "We are opening " + restaurant._opening_hour + "."
var restaurant_specialty = "Our specialty is " + restaurant._specialty + "."

// Generate response
module.exports = function generateRestaurantResp(resv) {
    if (resv.address == true) {
        return 0, restaurant_address
    } else if (resv.opening == true) {
        return 0, restaurant_opening
    } else if (resv.specialty == true) {
        return 0, restaurant_specialty
    }
    return 0, ""
}
