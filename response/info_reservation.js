/**
 * This module consists or a public class Reservation which stores everthing
 * that the bot will need to know to build a correct Reservation.
 * Methods:
 *     print(): For developer use, return a string.
 *     customerReport(): For reservation confirmation.
 *     fill(): Given a json, fill corresponding fields as long as we can.
 *     whatIsNotFilled(): Return index of what is missing.
 */

module.exports = class Reservation {
    constructor() {
        this.contact = null
        this.time = null
        this.total_number_of_people = null
    }

    print() {
        return "A table of " + String(this.total_number_of_people)
               + " at " + String(this.time)
               + ". Contact " + String(this.contact)
    }

    customerReport() {
        var time = this.time.slice(0, 10) + ", " + this.time.slice(11, 16)
        return "A table of " + String(this.total_number_of_people)
               + " at " + String(time)
               + ". Contact " + String(this.contact)
               + ", right?"
    }

    fill(recv) {
        if ((this.contact == null) && ("contact" in recv)) {
            var invalid_contact = new Set(["us", "them"])
            if ((invalid_contact.has(recv.contact[0].value)) == false) {
                this.contact = recv.contact[0].value
            }
        }
        if ((this.time == null) && ("datetime" in recv)) {
            this.time = recv.datetime[0].value
        }
        if ((this.total_number_of_people) && ("number" in recv)) {
            this.total_number_of_people = recv.number[0].value
        }
        return 0
    }

    whatIsNotFilled() {
        if (this.contact == null) {
            return 1
        }
        if (this.time == null) {
            return 2
        }
        if (this.total_number_of_people == null) {
            return 3
        }
        return 0
    }
}

