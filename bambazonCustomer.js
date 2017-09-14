const inquirer = require("inquirer");
const mysql    = require("mysql");

const connection = mysql.createConnection({
    "host"    : "localhost",
    "port"    : 3306,
    "user"    : "root",
    "password": "",
    "database": "bambazon"
});


console.log("Welcome to BAMBAZON, your exquisitely-curated source for all things in life!");
console.log("");



connection.connect(function (err){
	if (err) throw err;
    buy();    
});

function buy() {
	var query = connection.query(
	  "SELECT * FROM products", function(err, res) {

	  //turns the results into a formatted array to display product name and price	
	  var itemList = listify(res);

	  //purchase menu
	  inquirer.prompt([
	  	{
	  	"type" : "list",
	  	"choices" : itemList,
	  	"name" : "selection",
	  	"message" : "What would you like to purchase?"
	  	},
	  	{
	  	"type" : "input",
	  	"default" : 1,
	  	"name" : "quantity",
	  	"message" : "And how many of those do you want?"
	  	}
	  ])
	  .then(function(inqRes){
	  	
	  	var itemId = itemList.indexOf(inqRes.selection);
	  	var stock = res[itemId].stock_quantity;
	  	var newStock = stock - inqRes.quantity;
	  	var cost = res[itemId].price * inqRes.quantity;

	  	if(stock < inqRes.quantity){
	  		console.log("Sorry, we only have " + stock + " of those in stock.")

	  		inquirer.prompt([
	    		{
	    			"type":"confirm",
	    			"message":"Would you like to buy the rest of, what we have?",
	    			"name":"buyStock",
	    			"default":true
	    		}
	    	])
	    	.then(function(confirmation){

	    		if (confirmation.buyStock){
	    			console.log("Here ya go! " + stock + " units of " + inqRes.selection + ".");
	    			console.log("That'll be $" + cost + ", please."); 
	    			updateStock((itemId + 1), 0);

	    		}
	    		else{
	    			console.log("Okay, your loss. Clearly, that's a hot item!");
	    			another();
	    		}
	    	});
	    }
	    else{
	    	console.log("Here ya go! " + stock + " units of " + inqRes.selection + ".");
	    	console.log("That'll be $" + cost + ", please."); 
	    	updateStock((itemId + 1), newStock); 
	    }
	  });
	});
};

//turns the results into a formatted array to display product name and price	
function listify(array){
	list = [];
	for (var i=0; i<array.length; i++){
		list.push(array[i].product_name + "  |  $" + array[i].price);
	}
	return list
}; 

function updateStock(id, newstock){
	var query = connection.query(
	    "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newstock, id], function(err, res) {
	  console.log("Purchase Complete");
	  another();
	});
};	

function another(){
	inquirer.prompt([
		{
			"type":"confirm",
			"message":"Would you like to buy more stuff?",
			"name":"buyAgain",
			"default":true
		}
	])
	.then(function(confirmation){
		if(confirmation.buyAgain){
			buy();
		}
		else{
			console.log("Thanks for shopping with BAMBAZON!");
			connection.end();
		}
	});
};

