//To do list
//Create food map (look at the database) (Check!)
// return jason, once it loaded
//return table for the recent orderes
//display popluar order decent orders
//display sales figures using the table




const foodMap = {
    0: "Hamburger", 1: "Cheesburger", 2: "Double-Double Burger", 3: "Frech Fries",
    4: "Hamburger Combo", 5: "Cheesburgher Combo", 6: "Double-Double Burger Combo",
    7: "Small Soft Drink", 8: "Meduim Soft Drink", 9: "Large Soft Drink", 10: "Extra Large Soft Drink",
    11: "Shakes", 12: "Milk", 13: "Coffee"
};

const foodPrice = {
    0: 2.1, 1: 2.4, 2: 3.45, 3: 1.6, 4: 5.35,
    5: 5.65, 6: 6.7, 7: 1.5, 8: 1.65, 9: 1.85,
    10: 2.05, 11: 2.15, 12: 0.99, 13: 1.35
};

//Helper Functions
function convertTime(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function getOrderNumber(UID, timeStamp) {
    return UID + timeStamp;
}


function showOrders() {
    console.log("show_order_clicked");
    console.log("Start test");
    var request = new XMLHttpRequest();
    request.open('GET', 'https://afternoon-atoll-58440.herokuapp.com/test', true);
    request.responseType = 'json';
       request.onload = function () {
           if (this.status == 200) {
               console.log(this.response);
               var htmlDoc = "<h2>Show the current orders below: </h2> <h2> Time &nbsp;&nbsp;&nbsp;&nbsp;Orders </h2>"; 
               var n = this.response.length;
               for (let i = 1; i <= n; i++) {
                   console.log(i);
                   htmlDoc = htmlDoc + "<h4>" + convertTime(this.response[n - i]["Time"]) + " : " + foodMap[this.response[n - i]["FoodType"]] +  "</h4>";
               }
               document.getElementById('display_orders').innerHTML = htmlDoc;

               
            }
        }
    request.send();
   
};

function showSales() {
    console.log("show_sales_clicked");
    var salesMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 };
 
    var request = new XMLHttpRequest();
    request.open('GET', 'https://afternoon-atoll-58440.herokuapp.com/test', true);
    request.responseType = 'json';
    request.onload = function () {
        if (this.status == 200) {
            console.log(this.response);
            var n = this.response.length;
            for (let i = 0; i < n; i++) {
                salesMap[this.response[i]["FoodType"]] += this.response[i]["Price"]
            }

            var htmlDoc = "<br /><h3> Show Sales Figures </h3><h2> Food Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Total Sales </h2>";
            for (keys in salesMap) {
                if (salesMap[keys] != 0) {
                    htmlDoc += "<h4>" + foodMap[keys] + ":&nbsp;&nbsp;&nbsp;$" + salesMap[keys] + "</h4>"
                } 
                
            }
            document.getElementById('display_sales').innerHTML = htmlDoc;


        }
    }
    request.send();


};

function showPopular() {
    var popMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 };
    console.log("most poplar items clicked");
    var request = new XMLHttpRequest();
    request.open('GET', 'https://afternoon-atoll-58440.herokuapp.com/test', true);
    request.responseType = 'json';
    request.onload = function () {
        if (this.status == 200) {
            console.log(this.response);
            var n = this.response.length;
            for (let i = 0; i < n; i++) {
                popMap[this.response[i]["FoodType"]] += this.response[i]["Quantity"]
            }

            //sort the items
            var items = Object.keys(popMap).map(function (key) {
                return [key, popMap[key]];
            });

            items.sort(function (first, second) {
                return second[1] - first[1];
            });

            var poplist = items.slice(0, 10);
            console.log(poplist)

            //Display Top Three Results
            var htmlDoc = "<h2> Show Top 10 Poplar Items </h2>"
            var i = 0
            for (food in poplist) {
                htmlDoc += "<h4>#" + (i+1) + ":" + foodMap[poplist[i][0]] + "</h4>";
                i += 1;
            }

            document.getElementById('display_popular').innerHTML = htmlDoc


        }
    }
    request.send();

};

