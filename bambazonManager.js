const inquirer = require("inquirer");
const mysql    = require("mysql");

// Add New Products

const connection = mysql.createConnection({
    "host"    : "localhost",
    "port"    : 3306,
    "user"    : "root",
    "password": "",
    "database": "bambazon"
});


console.log("Welcome, manager.");
connection.connect(function (err){
	if (err) throw err;
   menu();    
});

function menu(){
	inquirer.prompt([
	  	{
	  	"type" : "list",
	  	"choices" : ["View products", "Check for low inventory", "Add inventory", "Add new product"],
	  	"name" : "menu",
	  	"message" : "What would you like to do, milord?"
	  	}
	])
	  .then(function(inquiryRes, err){
	  	if (err) throw err;

	  	if (inquiryRes.menu == "View products"){
	  		productView();
	  	}
	  	else if (inquiryRes.menu == "Check for low inventory"){
	  		lowInventory();
	  	}
	  	else if (inquiryRes.menu == "Add inventory"){
	  		addInventory();
	  	}
	  	else if (inquiryRes.menu == "Add new product"){
	  		addProduct();
	  	}
	  }, function(){
	  	console.log("REJECTED");
	  });
};

function productView(){
	console.log("OH NO ROBOTS");
	var query = connection.query(
	  "SELECT * FROM products", function(err, res) {
	  	if (err) throw err;
	  for (var i=0; i<res.length; i++){
	  	console.log("--------------------------------------------------------------------------------------------------");
	  	console.log("");
		  var info = "ID: " + res[i].item_id + "  ||  " ;
		  info += "Product: " + res[i].product_name + "  ||  " ;
		  info += "Department: " + res[i].department_name + "  ||  " ;
		  info += "Price: " + res[i].price + "  ||  " ;
		  info += "In Stock: " + res[i].stock_quantity;
		  console.log(info);
		  console.log("");
		}
		newAction();
	});
};

function lowInventory(){
	var query = connection.query(
	  "SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
	  	if (err) throw err;
	  for (var i=0; i<res.length; i++){
	  	console.log("--------------------------------------------------------------------------------------------------");
	  	console.log("");
		  var info = "ID: " + res[i].item_id + "  ||  " ;
		  info += "Product: " + res[i].product_name + "  ||  " ;
		  info += "Department: " + res[i].department_name + "  ||  " ;
		  info += "Price: " + res[i].price + "  ||  " ;
		  info += "In Stock: " + res[i].stock_quantity;
		  console.log(info);
		  console.log("");
		}
		newAction();
	});
};

function addInventory(){
	var query = connection.query(
	"SELECT * FROM products", function(err, res) {
		if (err) throw err;

		 //turns the results into a formatted array to display product name and stock in menu	
		var itemList = [];
		for (var i=0; i<res.length; i++){
			itemList.push(res[i].product_name + ", " + res[i].stock_quantity + " currently in stock.");
		};
	  //restock menu
	  inquirer.prompt([
	  	{
	  	"type" : "list",
	  	"choices" : itemList,
	  	"name" : "restock",
	  	"message" : "What would you like to restock?"
	  	},
	  	{
	  	"type" : "input",
	  	"default" : 10,
	  	"name" : "quantity",
	  	"message" : "How many should we order?"
	  	}
	  ])
	  .then(function(inquiryRes, err){
	  	if (err) throw err;
	  	var itemIndex = itemList.indexOf(inquiryRes.restock);
	  	var query = connection.query(
				"UPDATE products SET stock_quantity = ? WHERE item_id = ?", [(inquiryRes.quantity + res[itemIndex].stock_quantity), (itemIndex + 1)], function(err, response){
						if (err) throw err;
				console.log("Stock Updated. " + res[itemIndex].product_name + " now has " + (inquiryRes.quantity + res[itemIndex].stock_quantity) + " units in stock.");
				newAction();
			})
		});
	});
}; 	

function addProduct(){
	inquirer.prompt([
  	{
  	"type" : "input",
  	"name" : "productName",
  	"message" : "What do you call this new item? "
  	},
  	{
  	"type" : "input",
  	"name" : "department",
  	"message" : "In which department would this be classified? ",
  	"default" : "General"
  	},
  	{
  	"type" : "input",
  	"name" : "price",
  	"message" : "How much we charging for this thing? "
  	},
  	{
  	"type" : "input",
  	"name" : "quantity",
  	"message" : "How many should we order, boss? "
  	}
  ])
  .then(function(inqRes){

		var query = connection.query(
		  "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)", [inqRes.productName, inqRes.department, inqRes.price, inqRes.quantity], function(err, res) {
		 			if (err) throw err;
		 		
		 		console.log("");
		 		console.log("You got it boss. I'm sure it's gonna be a great seller.")
		  	console.log(inqRes.productName + " added.");
		  	console.log("")
		  	newAction();
		});		  
	});
};

function newAction(){
	inquirer.prompt([
  	{
  	"type" : "confirm",
  	"name" : "again",
  	"message" : "Is there more you'd like to do here, boss?"
  	}
  ])
  .then(function(inqRes){
  	if (inqRes.again){
  		menu();
  	}
  	else{
  		connection.end();
  	}
	});
};