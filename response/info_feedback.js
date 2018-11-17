module.exports = class Feedback {
    constructor() {
        this.body = null
        this.rating = null
    }

    print() {
        return "Feedback content: " + toString(this.body)
               + " with a rating of " + toString(this.rating) + "/5."
    }

    whatIsNotFilled() {
        if (!(this.body) != null) {
            return 1
        }
        return 0
    }

}

