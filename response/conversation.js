/**
 * Represents a conversation. Stores the conversation stage,
 * order, reservation, feedback, and restaurant info.
 * 
 * Conversation stages are denoted in ABC format (integer):
 * A = primary stage, B = secondary stage, C = progress stage
 * A = {1,2,3,9}      B = {0,1,2,3}        C = {1,2,3,9}
 * Note: B is set as 0 when A is not equal to 2
 * A = 1: greeting
 *     2: ordering / reservation / info / feedback
 *     3: confirmation
 *     9: completed
 * B = 0: making order
 *     1: making reservation
 *     2: request restaurant info (not used)
 *     3: recording feedback
 * C = (If A == 2)
 *       1: determining main attribute (food type for order)
 *       2: determining additional info (onions, cheese, etc.)
 *       3: dish / reservation confirmation (not used)
 *       9: ask if anything else
 *     (If A == 3)
 *       1: determining additional order info (sauces, etc.)
 *       2: determining for here / togo
 *       3: print out order info and end session
 * all valid_stages = new Set([
 *     101, 102,            // greeting
 *     201, 202, 203, 209,  // ordering
 *     211, 212, 213, 219,  // reservation
 *     221, 222, 223, 229,  // info
 *     231, 232, 233, 239,  // feedback
 *     301, 302, 303        // confirmation
 *     999])                // completed
 */


// IMPORTS:
// Data Modules
const _restaurant_data_module = require('./info_restaurant')
const _order_data_module = require('./info_order')
const _reservation_data_module = require('./info_reservation')
const _feedback_data_module = require('./info_feedback')
// Response Modules
const _order_resp_module = require('./resp_order')
const _reservation_resp_module = require('./resp_reservation')
const _feedback_resp_module = require('./resp_feedback')
const _restaurant_resp_module = require('./resp_restaurant')
// Random Array Picker
const randomArrayPicker = require('./random_picker')


// MACROS:
// WIT.AI MACROS
const ORDER = "order"
const RESERVE = "make_reservation"
const INFO_REQ = "info_request"
const FEEDBACK = "feedback"
const YN_LIST = "conversationEnd"
const SIZE_LIST = "size_type"
const FORTOGO = "order_toGO"
const FORHERE = "order_forHere"
const YES = "yes"
const NO = "no"
// RESP_MACROS
const ORDER_CONFIRM = [
    "Your order is:",
    "Here is your order:",
]
const APPEND_CONFIRM = [
    " Is that correct?",
    " Would that be correct?",
    " Everything correct?"
]
const SPECIAL_INST = [
    "Do you need any sauces? More ketchup packets?",
    "Need any sauces? Or more ketchup packets?"
]
const TOGO = [
    "For here or to go?"
]
const ORDER_FINISHED = [
    "Thank you so much! Your order is now finished!",
    "Thank you for chatting with me! Your order is finished!",
    "Thank you! Your order is finished!",
    "Thanks! Your order is finished!"
]
const BOT_CONFUSED = [
    "I'm so sorry. But I don't understand.",
    "Sorry, I am confused.",
    "Sorry, I didn't get that."
]
const ERROR_MSG = {
    0: "",
    2011: "We don't have this food, here is our menu:",
}


class ReturnTuple {
    /* A data class for Conversation return value */
    constructor(signal, text) {
        this.signal = signal
        this.text = text
    }
}


class Conversation {
    /** Handles the interaction between messages and index.js
     *  @param {integer} this.stage:
     *      class variable that stores the stage of the conversation.
     *  @param {integer} this._id:
     *      order id
     *  @param {object} this._restaurant:
     *      Restaurant class object (info_restaurant.js)
     *  @param {object} this._order:
     *      Order class object (info_order.js)
     *  @param {object} this._togo:
     *      Flag if this is a togo order
     *  @param {integer} this._dishno:
     *      Current dish index for this._order.dishlist
     *  @param {object} this._reservation:
     *      Reservation class object (info_reservation.js)
     *  @param {object} this._feedback:
     *      Feedback class object (info_feedback.js)
     *  @param {integer} this._current_text:
     *      Current customer response
     *  @param {integer} this._special_inst_text:
     *      Text used in stage 302 (special instructions)
     *  @param {integer} this._multiple_dish_flag:
     *      Flag if multiple dishes in dishlist
     *  @param {integer} this._bot_confused:
     *      Flag if bot is confused
     *  @param {integer} this._error_code:
     *      Error code of the current conversaion
     */

    constructor() {
        this.stage = 101
        this._id = Math.floor(Math.random()*1000000)
        this._restaurant = new _restaurant_data_module()
        this._order = new _order_data_module()
        this._togo = false
        this._dishno = 0
        this._reservation = new _reservation_data_module()
        this._feedback = new _feedback_data_module()
        this._current_text = ""
        this._special_inst_text = ""
        this._multiple_dish_flag = false
        this._bot_confused = false
        this._error_code = 0
    }

    print() {
        /* Developer use:
         * Returns conversation id and its stage
         */
        return "Order id: " + String(this._id)
               + " at stage " + String(this.stage) + "."
    }

    converse(entities, text) {
        /**
         * conversation:
         * public wrapper for this._converse()
         * 
         * @param {Map} entities:
         *      Parsed sentence map generated by Wit.AI.
         * @param {String} text:
         *      Text message.
         * 
         * @return {ReturnTuple}:
         *      Status code and the response text from _converse().
         *      Will return status code -1 if this.stage == 999.
         */
        if (this.stage == 999) {
            return new ReturnTuple(-1, "")
        } else {
            return this._converse(entities, text)
        }
    }

    _converse(recv, text) {
        /**
         * conversation:
         * 1. Understanding what the customer wants, and
         *    set the stage to the appropriate value.
         * 2. Generating response and return status code and
         *    response text.
         * 
         * @param {Map} recv:
         *      Map containing info from a parsed sentence.
         * @param {String} text:
         *      Text message.
         * 
         * @return {ReturnTuple}:
         *      Status code and the response text.
         */
        this._current_text = text
        var res = 0
        var primary_stage = Math.floor(this.stage / 100)
        if (primary_stage == 1) {
            res = this._converse_ps1(recv)
        } else if (primary_stage == 2) {
            res = this._converse_ps2(recv)
        } else if (primary_stage == 3) {
            console.log(recv)
            res = this._converse_ps3(recv)
        } else {
            console.log("ERROR: In _converse(), invalid primary stage number " + 
                        + toString(primary_stage) + ".")
            this._bot_confused == true
        }
        if (res != 0) {
            console.log("ERROR: In _converse(), at stage " + String(this.stage))
            console.log("ERROR: converse_ps functions return non-zero.")
            this._bot_confused == true
        }
        // Reset confused status
        if (this._bot_confused == true) {
            var tuple = new ReturnTuple(
                1,
                randomArrayPicker(BOT_CONFUSED) + " " +
                    ERROR_MSG[this._error_code]
            )
            this._bot_confused = false
            return tuple
            
        }
        primary_stage = Math.floor(this.stage / 100)
        var signal = 0
        var text = ""
        if (primary_stage == 1) {
            var tuple = this._response_ps1(recv)
            signal = tuple.signal
            text = tuple.text
        } else if (primary_stage == 2) {
            var tuple = this._response_ps2(recv)
            signal = tuple.signal
            text = tuple.text
        } else if (primary_stage == 3) {
            console.log(recv)
            var tuple = this._response_ps3(recv)
            signal = tuple.signal
            text = tuple.text
        } else if (primary_stage == 9) {
            return new ReturnTuple(0, this._conversationReport())
        } else {
            console.log("ERROR: In _converse(), invalid primary stage number.")
            return new ReturnTuple(1, text)
        }
        if (signal != 0) {
            console.log("ERROR: In _converse(), at stage " + String(this.stage))
            console.log("ERROR: response_ps functions return non-zero.")
            return new ReturnTuple(1, text)
        }
        return new ReturnTuple(0, text)
    }

    _conversationReport() {
        /* Return the order summary if called */
        // ORDER_REITERATE
        var text = randomArrayPicker(ORDER_CONFIRM) + "\n"
        var total_price = 0
        // EACH DISH PRICE
        for (var i = 0; i < this._order.dishlist.length; i ++) {
            var temp_text = ""
            var food = this._order.dishlist[i]
            console.log("Print result: " + food.print());
            var primary_type = food.type
            console.log("primary type: " + primary_type.toString())
            var secondary_type = food.food_type
            console.log("secondary type: " + secondary_type.toString())
            var price_chart = this._restaurant._prices
            if (primary_type == "Burger") {
                temp_text = price_chart[secondary_type]
            } else if (primary_type == "Fries") {
                temp_text = price_chart[primary_type]
            } else if (primary_type == "Drink") {
                temp_text = price_chart[primary_type][food.size]
            } else if (primary_type == "UnsizeableDrink") {
                temp_text = price_chart[primary_type][food.drink_type]
            }
            total_price += temp_text
            text += "$" + temp_text + "\t" +
                    food.customerReport() + "\n"
        }
        // TOTAL PRICE
        text += "Total: $" + total_price.toFixed(2) + "\n"
        // TOGO FORHERE
        if (this._togo == true) {
            text += "To go \n"
        } else {
            text += "Dine-in \n"
        }
        // NOTE
        if (this._special_inst_text != "") {
            text += "Note: " + this._special_inst_text + "\n"
        }
        text += "Enjoy the order. Have a nice day!\n"
        text += "To start a new session, simply greet me!" 
        return text
    }

    _converse_ps1(recv) {
        /* understanding workflow in primary stage 1 */
        if ((ORDER in recv) || ("food_type" in recv)) {
            // Make order (201 - 203, 209)
            // 201 = Require food type
            // 202 = Require additional info
            // 203 = Require confirmation (REMOVED)
            var res = 0
            res = this._order.addFill(recv)
            if (res == 1) {
                this.stage = 201
                return 0
            }
            var tuple = this._order.whatIsNotFilled()
            var index = tuple.index
            var missing_id = tuple.missing_id
            if ((index == this._dishno) && (missing_id != 0)) {
                this.stage = 202
            } else {
                this.stage = 209
            }
            return 0
        } else if (RESERVE in recv) {
            // Make reservation (211 - 213, 219)
            // 212 = Require additional info
            // 213 = Require confirmation
            this._reservation.fill(recv)
            var res = this._reservation.whatIsNotFilled()
            if (res != 0) {
                this.stage = 212
            } else {
                this.stage = 213
            }
            return 0
        } else if (INFO_REQ in recv) {
            // Request restaurant info (229)
            // 229 = Response and ask for more questions
            this.stage = 229
            return 0
        } else if (FEEDBACK in recv) {
            // Make feedback (231 - 233, 239)
            // 232 = Require additional info (rating)
            // 239 = Ask if anything else
            this._feedback.fill(recv)
            if (this._feedback.rating == null) {
                this.stage = 232
            } else {
                this.stage = 239
            }
            return 0
        } else {
            // Bot is confused, stage stays at 101
            this._bot_confused = true
            return 0
        }
    }

    _converse_ps2(recv) {
        /* understanding workflow in primary stage 2 */
        var secondary_stage = Math.floor(this.stage / 10) % 10
        var progress_stage = this.stage % 10
        if (secondary_stage == 0) {
            // Make order (201 - 203, 209)
            // 201 = Require food type
            // 202 = Require additional info
            // 209 = Ask for more dishes
            if (progress_stage == 1) {
                return this._converse_s201(recv)
            } else if (progress_stage == 2) {
                return this._converse_s202(recv)
            } else if (progress_stage == 9) {
                return this._converse_s209(recv)
            }
        } else if (secondary_stage == 1) {
            // Make reservation (211 - 213, 219)
            // 212 = Require additional info
            // 213 = Require confirmation
            // 219 = Ask if anything else
            this._reservation.fill(recv)
            var res = this._reservation.whatIsNotFilled()
            if (res != 0) {
                this.stage = 212
            } else {
                this.stage = 311
            }
            return 0
        } else if (secondary_stage == 2) {
            // Request restaurant info (221 - 223, 229)
            // No need to do anything here
            return 0
        } else if (secondary_stage == 3) {
            // Make feedback (231 - 233, 239)
            // Try to fill additional info (rating)
            this._feedback.fill(recv)
            this.stage = 239
            return 0
        } else {
            // BOT CONFUSED
            this._bot_confused = true
            return 0
        }
    }

    _converse_ps3(recv) {
        /* understanding workflow in primary stage 3 */
        var secondary_stage = Math.floor(this.stage / 10) % 10
        var progress_stage = this.stage % 10
        if (secondary_stage == 0) {
            if (progress_stage == 1) {
                return this._converse_s301(recv)
            } else if (progress_stage == 2) {
                return this._converse_s302(recv)
            } else if (progress_stage == 3) {
                return this._converse_s303(recv)
            } else {
                // Bot is confused, stage stays at the current stage
                this._bot_confused = true
                return 0
            }
        } else if (secondary_stage == 1) {
            if (progress_stage == 1) {
                return this._converse_s311(recv)
            }
        }
    }

    _converse_s201(recv) {
        /* understanding workflow in stage 201 */
        var res = 0
        res = this._order.addFill(recv)
        if (res == 1) {
            this._bot_confused = true
            this._error_code = 2011
            return 0
        }
        var tuple = this._order.whatIsNotFilled()
        var index = tuple.index
        var missing_id = tuple.missing_id
        if ((index == this._dishno) && (missing_id != 0)) {
            this.stage = 202
        } else {
            this.stage = 209
        }
        return 0
    }

    _converse_s202(recv) {
        /* understanding workflow in stage 202 */
        this._order.fill(this._dishno, recv)
        var tuple = this._order.whatIsNotFilled()
        var index = tuple.index
        var missing_id = tuple.missing_id
        if (index == 0) {
            if (missing_id == 0) {
                this.stage = 209
            }
        }
        return 0
    }

    _converse_s209(recv) {
        /* understanding workflow in stage 209 */
        var yn = this._yn_parsing(recv)
        if (yn == 0) {
            // Only when explicitly declaring NO
            // will the stage advance to 301
            this.stage = 301
        } else if (yn == 1) {
            // Explicit ordering
            // Attempt to look for food_type in recv
            // if not possible, change stage to 201
            // if possible, change stage to 202 or 209
            var res = 0
            this._multiple_dish_flag = true
            this._dishno = this._dishno + 1
            this.stage = 201
            res = this._order.addFill(recv)
            if (res == 1) {
                return 0
            }
            var tuple = this._order.whatIsNotFilled()
            var index = tuple.index
            var missing_id = tuple.missing_id
            if ((index == this._dishno) && (missing_id != 0)) {
                this.stage = 202
                return 0
            } else {
                this.stage = 209
                return 0
            }
        } else {
            // Inexplicit ordering:
            // Try to look for food_type in recv
            // if possible, add the dish directly
            var res = 0
            res = this._order.addFill(recv)
            if (res == 1) {
                // If not possible, then confused
                // return prematurely and stay at
                // current stage 209
                this._bot_confused = true
                return 0
            }
            this._multiple_dish_flag = true
            this._dishno = this._dishno + 1
            var tuple = this._order.whatIsNotFilled()
            var index = tuple.index
            var missing_id = tuple.missing_id
            if ((index == this._dishno) && (missing_id != 0)) {
                this.stage = 202
                return 0
            } else {
                this.stage = 209
                return 0
            }
        }
        return 0
    }

    _converse_s301(recv) {
        /* understanding workflow in stage 301 */
        // Special instruction
        var yn = this._yn_parsing(recv)
        if (yn == 1) {
			// Explicit and inexplicit special inst
            this._special_inst_text = this._current_text
        }
        this.stage = 302
        return 0
    }

    _converse_s302(recv) {
        /* understanding workflow in stage 302 */
        // For here or togo
		if (FORTOGO in recv) {
            this._togo = true
            this.stage = 999
		} else if (FORHERE in recv) {
            this._togo = false
            this.stage = 999
		} else {
			this._bot_confused = true
		}
        return 0
    }

    _converse_s303(recv) {
        /* understanding workflow in stage 303 */
        // Nothing to do here, advance to stage 999
		this.stage = 999
        return 0
    }

    _converse_s311(recv) {
        
    }

    _response_ps1(recv) {
        /* understanding workflow in primary stage 1 */
        return new ReturnTuple(0, "")
    }

    _response_ps2(recv) {
        /* understanding workflow in primary stage 2 */
        var secondary_stage = Math.floor(this.stage / 10) % 10
        var progress_stage = this.stage % 10
        if (secondary_stage == 0) {
            var res = 0, text = null
            if (progress_stage != 1) {
                var tuple = _order_resp_module(
                    progress_stage,
                    this._order.dishlist[this._dishno].type,
                    this._multiple_dish_flag,
                    this._order.dishlist[this._dishno].whatIsNotFilled()
                )
                res = tuple.signal
                text = tuple.text
            } else {
                var tuple =  _order_resp_module(
                    progress_stage,
                    1,
                    this._multiple_dish_flag,
                    1
                )
                res = tuple.signal
                text = tuple.text
            }
            return new ReturnTuple(res, text)
        } else if (secondary_stage == 1) {
            return _reservation_resp_module(
                this._reservation.whatIsNotFilled()
            )
        } else if (secondary_stage == 2) {
            return _restaurant_resp_module(
                recv
            )
        } else if (secondary_stage == 3) {
            return _feedback_resp_module(
                progress_stage
            )
        } else {
            console.log("ERROR: In _response_ps2(), invalid progress stage number.")
            return -1   
        }
    }

    _response_ps3(recv) {
        /* understanding workflow in primary stage 3 */
        var secondary_stage = Math.floor(this.stage / 10) % 10
        var progress_stage = this.stage % 10
        if (secondary_stage == 0) {
            if (progress_stage == 1) {
                return new ReturnTuple(0, randomArrayPicker(SPECIAL_INST))
            } else if(progress_stage == 2) {
                return new ReturnTuple(0, randomArrayPicker(TOGO))
            } else {
                console.log("ERROR: In _response_ps3(), invalid progress stage number.")
                return -1
            }
        } else if (secondary_stage == 1) {
            if (progress_stage == 1) {
                return new ReturnTuple(0, this._reservation.customerReport())
            }
        }
    }

    _yn_parsing(recv) {
        /* parse positive and negative response in recv */
        // Case 1: yn in size_type
        if (SIZE_LIST in recv) {
            if (recv.size_type[0].value == YES) {
                return 1
            } else if (recv.size_type[0].value == NO) {
                return 0
            } else {
                // Case 2: yn in size_type/conversationEnd
                if (YN_LIST in recv.size_type[0]) {
                    if (recv.size_type[0].conversationEnd[0].value == YES) {
                        return 1
                    } else if (recv.size_type[0].conversationEnd[0].value == NO) {
                        return 0
                    } else {
                        console.log("ERROR: In _yn_parsing() case 2")
                        return -1
                    }
                } else {
                    console.log("ERROR: In _yn_parsing() case 1")
                    return -1
                }
            }
        }
        // Case 3: yn in conversationEnd
        if (YN_LIST in recv) {
            if (recv.conversationEnd[0].value == YES) {
                return 1
            } else if (recv.conversationEnd[0].value == NO) {
                return 0
            } else {
                // Case 4: yn in conversationEnd/size_type
                if (SIZE_LIST in recv.conversationEnd[0]) {
                    if (recv.conversationEnd[0].size_type[0].value == YES) {
                        return 1
                    } else if (recv.conversationEnd[0].size_type[0].value == NO) {
                        return 0
                    } else {
                        console.log("ERROR: In _yn_parsing() case 4")
                         return -1
                    }
                } else {
                    console.log("ERROR: In _yn_parsing() case 3")
                    return -1
                }
            }
        }
        // This happens, but I consider this to be a bad practise
        // return -1 if conversationEnd or size_type not in recv
        return -1
    }

    renew() {
        /* Conversation instance in index.js is considered a singleton
         * As such, a renew method is here to return a new instance
         */
        return new Conversation();
    }
}

// Module Export
module.exports = new Conversation()
