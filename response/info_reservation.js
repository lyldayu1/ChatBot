module.exports = class Reservation {
    constructor() {
        this.contact = null
        this.time = null
        this.total_number_of_people = null
    }

    print() {
        return "A table of " + toString(this.total_number_of_people)
               + " at " + toString(this.time) + "."
    }

    whatIsNotFilled() {
        if (!(this.contact) != null) {
            return 1
        }
        if (!(this.time) != null) {
            return 2
        }
        if (!(this.total_number_of_people) != null) {
            return 3
        }
        return 0
    }
}

