module.exports = class Restaurant {
    constructor() {
        // We will need to get this out from the database
        // instead of this mess of hard-coding
        this._name = "In-n-out"
        this._address = "4115 Campus Dr, Irvine, CA 92612"
        this._opening_hour = "10:30 AM - 1:00 AM everyday"
        this._speciality = "burger"
    }
}

