/**
 * This module consists or a public class Order and several private dish classes.
 * Order class holds a list of dish class instances.
 * All classes have the following methods:
 *     print(): For developer use, return a string
 *     customerReport(): For dish or order confirmation, returns a summary of one
 *                       particular dish or the whole order
 *     whatIsNotFilled(): For Order, return a tuple of (dish_index, missing_index)
 *                        For Dish, return missing_index
 * For all dish classes, they share fill() method. Json is required as input.
 * Note: for missing_index, please refer to individual class definitions
 */

// MACROS:
// WIT.AI MACROS
const BURGER = ["Hamburger",
                "Cheeseburger",
                "Double-Double Burger"]
const BURGER_COMBO = ["Hamburger Combo",
                      "Cheeseburger Combo",
                      "Double-Double Burger Combo"]
const FRIES = "French Fries"
const DRINK = "Drink"
const UNSIZEABLE_DRINK = ["Milk",
                          "Coffee",
                          "Shake"]
const COMBO = "Combo"
const SANDWICH = "Sandwich"
const ONION = ["no onion",
               "onion",
               "extra onion"]
const LETTUCE = ["no lettuce",
                 "lettuce",
                 "extra lettuce"]
const TOMATO = ["no tomato",
                "tomato",
                "extra tomato"]
const DRINK_SIZE = ["small",
                    "medium",
                    "large",
                    "extra large"]
const YES = "yes"
const NO = "no"

module.exports = class Order {
    /** Consists of an order.
     *  @param {Array} this.dishlist:
     *      Holds multiple dish class instances.
     */

    constructor() {
        this.dishlist = []
    }

    print() {
        if (this.dishlist.length == 0) {
            return "Order is empty."
        } else {
            var text = "Order includes " + this.dishlist.length.toString() + " dish(es).\n"
            for (var i = 0; i < this.dishlist.length; i ++) {
                text = text + "Dish No. " + (i+1).toString() + "\n"
                text = text + this.dishlist[i].print()
            }
            return text
        }
    }

    customerReport() {
        var text = ""
        if (this.dishlist.length == 1) {
            var temp_text = this.dishlist[0].customerReport()
            return temp_text
        }
        for (var i = 0; i < this.dishlist.length; i ++) {
            var temp_text = this.dishlist[i].customerReport()
            if (i == 0) {
                temp_text = temp_text.substring(0,
                                                temp_text.length - 1)
                text = text + temp_text + ", "
                continue
            } else if (i == this.dishlist.length - 1) {
                temp_text = temp_text.charAt(0).toLowerCase() +
                            temp_text.slice(1)
                temp_text = "and " + temp_text
                text = text + temp_text
                break
            } else {
                temp_text = temp_text.substring(0,
                                                temp_text.length - 1)
                temp_text = temp_text.charAt(0).toLowerCase() +
                            temp_text.slice(1)
                text = text + temp_text + ", "
            }
        }
        return text
    }

    whatIsNotFilled() {
        if (this.dishlist.length == 0) {
            console.log("Order No. " + this.order_no.toString() + " is empty.")
            return (0, 0)
        } else {
            var res = 0
            for (var i = 0; i < this.dishlist.length; i ++) {
                res = this.dishlist[i].whatIsNotFilled()
                if (res != 0) {
                    return (i, res)
                }
            }
            return (0, 0)
        }
    }

    addFill(recv) {
        // TODO: Support order multiple dishes in one sentence
        //       That is, replace temp_food with something else
        var food_type = null
        if ("food_type" in recv) {
            var food_type = recv.food_type
            var temp_food = food_type[0].value
            if ((BURGER.includes(temp_food)) || (BURGER_COMBO.includes(temp_food))) {
                // TODO: Redesign combo compatibility, support other food types
                if (!("burger_type" in recv)) {
                    this.dishlist.push(new Burger(temp_food)) 
                    return 0
                }
                var burger_type = recv.burger_type
                var onion = null, lettuce = 1, tomato = 1
                var combo = null
                if (BURGER_COMBO.includes(temp_food)){
                    var combo = 1
                }
                for (var i = 0; i < burger_type.length; i ++) {
                    if (ONION.includes(burger_type[i].value)) {
                        onion = ONION.indexOf(burger_type[i].value)
                    } else if (LETTUCE.includes(burger_type[i].value)) {
                        lettuce = LETTUCE.indexOf(burger_type[i].value)
                    } else if (TOMATO.includes(burger_type[i].value)) {
                        tomato = TOMATO.indexOf(burger_type[i].value)
                    }
                }
                this.dishlist.push(
                    new Burger(temp_food, combo, onion, lettuce, tomato)
                )
                return 0
            } else if (temp_food == FRIES) {
                this.dishlist.push(new Fries())
                return 0
            } else if (temp_food == DRINK) {
                var drink_size = null
                if ("size_type" in recv) {
                    drink_size = DRINK_SIZE.indexOf(recv.size_type[0].value)
                }
                this.dishlist.push(new Drink(drink_size))
                return 0
            } else if (UNSIZEABLE_DRINK.includes(temp_food)) {
                this.dishlist.push(new UnsizeableDrink(temp_food))
                return 0
            } else {
                console.log("Bot confused at Order.addFill()")
                return 1
            }
        } else {
            return 1
        }
    }

    fill(index, recv) {
        // Given index, fill dish
        var food = this.dishlist[index]
        var food_type = food.food_type
        if ((BURGER.includes(food_type)) || (BURGER_COMBO.includes(food_type))) {
            if (("conversationEnd" in recv) && (Object.keys(recv).length == 1)) {
                var _, attr_index = this.whatIsNotFilled()
                if (recv.conversationEnd[0].value == YES) {
                    food.indexFill(attr_index, 1)
                } else if (recv.conversationEnd[0].value == NO) {
                    food.indexFill(attr_index, 0)
                } else {
                    throw "fill cannot parse conversationEnd of value " + 
                          recv.conversationEnd[0].value
                }
                return 0
            }
            if ("food_type" in recv) {
                var recv_food_type = recv.food_type
                for (var i = 0; i < recv_food_type.length; i ++) {
                    if (recv_food_type[i].value == COMBO){
                        this._convertToCombo(food)
                    }
                    if (recv_food_type[i].value == SANDWICH) {
                        this._convertToSandwich(food)
                    }
                }
            }
            if ("burger_type" in recv) {
                var burger_type = recv.burger_type
                for (var i = 0; i < burger_type.length; i ++) {
                    if (ONION.includes(burger_type[i].value)) {
                        food.onion = ONION.indexOf(burger_type[i].value)
                    } else if (LETTUCE.includes(burger_type[i].value)) {
                        food.lettuce = LETTUCE.indexOf(burger_type[i].value)
                    } else if (TOMATO.includes(burger_type[i].value)) {
                        food.tomato = TOMATO.indexOf(burger_type[i].value)
                    }
                }
            }
            return 0
        } else if (food_type == FRIES) {
            // nothing to do here
            return 0 
        } else if (food_type == DRINK) {
            var drink_size = null
            if ("size_type" in recv) {
                drink_size = DRINK_SIZE.indexOf(recv.size_type[0].value)
            }
            food.drink_size = drink_size
            return 0
        } else if (UNSIZEABLE_DRINK.includes(food_type)) {
            // nothing to do here since type is predetermined in addFill()
            return 0
        } else {
            console.log("Bot confused at Order.fill()")
            return 1
        }
    }

    removeDish(index) {
        this.dishlist.splice(index, 1)
        return 0
    }

    searchDish(food_type) {
        if (this.dishlist.length == 0) {
            console.log("Order is empty.")
            return false
        } else {
            match = []
            for (var i = 0; i < this.dishlist.length; i ++) {
                if (this.dishlist[i].food_type == food_type) {
                    match.push(i)
                }
            }
            if (match.length == 0) {
                return false
            } else {
                return match
            }
        }
    }

    _convertToCombo(dish) {
        /* Directly change combo related attributes
         * that is, dish.food_type and dish.if_combo
         * USE THIS FUNCTION TO MAKE COMBO RELATED CHANGES ONLY!
         */
        if (BURGER.includes(dish.food_type)) {
            dish.food_type = BURGER_COMBO[BURGER.indexOf(dish.food_type)]
            dish.if_combo = 1
            return 0
        } else {
            console.log("ERROR: in _convertToCombo: " +
                        "food_type not in BURGER.")
            return 1
        }
    }

    _convertToSandwich(dish) {
        /* (Mostly obselete but implemented anyway)
         * Directly change combo related attributes
         * that is, dish.food_type and dish.if_combo
         * USE THIS FUNCTION TO MAKE COMBO RELATED CHANGES ONLY!
         */

         // Check if food_type in combo (BURGER_COMBO)
         if (BURGER_COMBO.includes(dish.food_type)) {
             dish.food_type = BURGER[BURGER_COMBO.indexOf(dish.food_type)]
             dish.if_combo = 0
             return 0
         } else {
             console.log("ERROR: in _convertToSandwich: " +
                         "food_type not in BURGER_COMBO.")
             return 1
         }
    }
}


class Burger {
    /** Burger and burger combo class:
     *  @param {string} this.type:
     *      stores class name
     *  @param {string} this.food_type:
     *      class variable that stores the stage of the conversation.
     *  @param {boolean} this.if_combo:
     *      false = No, true = Yes
     *  @param {integer} this.onion:
     *      0 = No, 1 = Yes, 2 = Extra
     *  @param {integer} this.lettuce:
     *      0 = No, 1 = Yes, 2 = Extra (default = 1)
     *  @param {integer} this.tomato:
     *      0 = No, 1 = Yes, 2 = Extra (default = 1)
     */

    constructor(food_type=null,
                if_combo=null,
                onion=null,
                lettuce=1,
                tomato=1) {
        this.type = "Burger"
        this.food_type = food_type
        this.if_combo = if_combo
        this.onion = onion
        this.lettuce = lettuce
        this.tomato = tomato
    }

    print() {
        return "Burger type: " + String(this.food_type) + "\n"
               + "If combo: " + String(this.if_combo) + "\n"
               + "Onion: " + String(this.onion) + "\n"
               + "Lettuce: " + String(this.lettuce) + "\n"
               + "Tomato: " + String(this.tomato) + "." + "\n"
    }

    customerReport() {
        var onion = ""
        if (this.onion == 0) {
            onion = "without onion"
        } else if (this.onion == 1) {
            onion = "with onion"
        } else {
            onion = "with extra onion"
        }
        var text = String(this.food_type) + ", " + onion + "."
        return text
    }

    indexFill(attr_index, value) {
        if (attr_index == 1) {
            this.food_type = value
        } else if (attr_index == 2) {
            this.if_combo = value
        } else if (attr_index == 3) {
            this.onion = value
        } else if (attr_index == 4) {
            this.lettuce = value
        } else if (attr_index == 5) {
            this.tomato = value
        }
        return
    }

    whatIsNotFilled() {
        if (this.food_type == null) {
            return 1
        }
        if (this.if_combo == null) {
            return 2
        }
        if (this.onion == null) {
            return 3
        }
        if (this.lettuce == null) {
            return 4
        }
        if (this.tomato == null) {
            return 5
        }
        return 0
    }
}

class Fries {
    /** Fries:
     *  Empty class since we don't really have any fries attributes.
     *  @param {string} this.type:
     *      stores class name
     */

    constructor() {
        this.type = "Fries"
    }

    print() {
        return "Fries."
    }

    customerReport() {
        return "Fries."
    }

    whatIsNotFilled() {
        return 0
    }
}

class Drink {
    /** Burger and burger combo class:
     *  @param {string} this.type:
     *      stores class name
     *  @param {integer} this.size:
     *      0 = Small, 1 = Medium, 2 = Large, 3 = Extra Large
     */

    constructor(size=null) {
        this.type = "Drink"
        this.size = size
    }

    print() {
        return "Fountain drink of size " + String(this.size) + "."
    }

    customerReport() {
        var size_correspond = {
            0: "small",
            1: "medium",
            2: "large",
            3: "extra large"
        }
        return size_correspond[this.size] + " fountain drink."
    }

    whatIsNotFilled() {
        if (this.size == null) {
            return 1
        }
        return 0
    }
}

class UnsizeableDrink {
    /** For milk, coffee, and shake:
     *  @param {string} this.type:
     *      stores class name
     *  @param {integer} this.drink_type:
     *      valid value in UNSIZEABLE_DRINK
     *      must be filled upon instantiation
     */

    constructor(type) {
        if (type == null) {
            console.log("UnsizeableDrink type cannot be null")
        }
        this.type = "UnsizeableDrink"
        this.drink_type = type
    }

    print() {
        return this.drink_type + "."
    }

    customerReport() {
        return this.drink_type + "."
    }

    whatIsNotFilled() {
        if (this.drink_type == null) {
            return 1
        }
        return 0
    }
}
