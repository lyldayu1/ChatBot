class Dish {
    constructor(food_type=null,
                if_combo=null,
                if_onion=null,
                combo_size=null,
                drink_type=null) {
        this.food_type = food_type
        this.if_combo = if_combo
        this.if_onion = if_onion
        this.cheese_type = "Regular"
        this.combo_size = combo_size
        this.drink_type = drink_type
    }

    print() {
        return "Food type: " + String(this.food_type) + "\n"
               + "If combo: " + String(this.if_combo) + "\n"
               + "If onion: " + String(this.if_onion) + "\n"
               + "Cheese Type: " + String(this.cheese_type) + "\n"
               + "Combo size: " + String(this.combo_size) + "\n"
               + "Drink type: " + String(this.drink_type) + "\n"
    }

    whatIsNotFilled() {
        if (this.food_type == null) {
            return 1
        }
        if (this.if_combo == null) {
            return 2
        }
        if (this.if_onion == null) {
            return 3
        }
        if (this.cheese_type == null) {
            return 4
        }
        if (this.if_combo == true) {
            if (this.combo_size == null) {
                return 5
            }
            if (this.drink_type == null) {
                return 6
            }
        }
        return 0
    }
}

module.exports = class Order {
    constructor() {
        this.order_no = Math.floor(Math.random()*1000000)
        this.dishlist = []
    }

    print() {
        if (this.dishlist.length == 0) {
            return "Order No. " + this.order_no.toString() + " is empty."
        } else {
            var text = "Order No. " + this.order_no.toString() + " has " + 
                       this.dishlist.length.toString() + " dish(es).\n"
            for (var i = 0; i < this.dishlist.length; i ++) {
                text = text + "Dish No. " + i.toString() + "\n"
                text = text + this.dishlist[i].print()
            }
            return text
        }
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

    addDish(food_type=null,
            if_combo=null,
            if_onion=null,
            combo_size=null,
            drink_type=null) {
        this.dishlist.push(new Dish(food_type, if_combo, if_onion,
                                    combo_size, drink_type))
    }

    addFill(recv) {
        this.dishlist.push(new Dish(food_type, if_combo, if_onion,
                                    combo_size, drink_type))
    }

    removeDish(index) {
        this.dishlist.splice(index, 1)
    }

    searchDish(food_type) {
        if (this.dishlist.length == 0) {
            console.log("Order No. " + this.order_no.toString() + " is empty.")
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
}

