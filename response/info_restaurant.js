module.exports = class Restaurant {
    constructor() {
        // We will need to get this out from the database
        // instead of this mess of hard-coding
        this._name = "In-n-out"
        this._address = "4115 Campus Dr, Irvine, CA 92612"
        this._opening_hour = "10:30 AM - 1:00 AM everyday"
        this._speciality = "burger"
        this._prices = {
            // Burger
            "Hamburger": 2.1,
            "Cheeseburger": 2.4,
            "Double-Double Burger": 3.45,
            "Hamburger Combo": 5.35,
            "Cheeseburger Combo": 5.65,
            "Double-Double Burger Combo": 6.7,
            // Fries
            "Fries": 1.6,
            // Drink
            "Drink": [1.5, 1.65, 1.85, 2.05],
            // UnsizeableDrink
            "UnsizeableDrink": {
                "Shakes": 2.15,
                "Milk": 0.99,
                "Coffee": 1.35
            }
        }
    }
}

