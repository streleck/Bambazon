# Bambazon

Bambazon is an application that models how an online store might work.  There are two main parts to this - "customer view" and "manager view".

Customer View: The user is able to scroll through a list of items for sale, select one, and enter the quantity desired. A list of the items, their prices, the amount in stock, and depatrment category, are all saved in a mySQL database.  When the user chooses to buy a set of items, the program calculates and displays the total cost and updates the stock in the database.  If there is not enough of that item in stock to fill the order, the customer is presented with the choice of buying the rest of the stock or canceling.  After each transaction, the customer is asked if they would like to make another and brought back into the buy menu if they do.

Manager View: In manager view, the user may perform any of four actions: view items for sale, view items low in stock, restock items, or add new item. The program opens to a scrolling menu which displays each of these options.  
  -The 'view item's action for sale displays a list of each item in the database along with an ID number, the department name, the price,   and the number in stock.  
  -The 'low in stock' action displays the same information, but only for items that have 5 or fewer in stock.  
  -The 'restock items' action allows the user to scroll through the list of items and select one to restock, then enter a number for how many to add to stock.
  -The 'add new item' action allows the user to create a new item by inputting into each of the four data fields - item name, department, price, and number in stock.
After any of these actions, the user is asked if they would like to perform any more actions. If they select yes they are returned to the beginning menu.
