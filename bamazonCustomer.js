const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
var total;

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "ExcuseBarrel12",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showInventory();
});

function showInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
      for (let i = 0; i < res.length; i++) {
        console.table([
            {
                item_id: res[i].item_id,
                product_name: res[i].product_name,
                department_name: res[i].department_name,
                price: res[i].price,
                stock_quantity: res[i].stock_quantity
            }
          ]);
      }
      console.log("-------------------------------------------------------------");
      start();
    //   connection.end();
    });
}

let start = () => {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
 
        inquirer
          .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the ID of the product you would like to buy today?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            }
          ])
          .then(answer => {
            if(res[(answer.product - 1)].stock_quantity > answer.quantity){
            total = res[(answer.product - 1)].price * answer.quantity;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[(answer.product - 1)].stock_quantity - answer.quantity
                    },
                    {
                        item_id: answer.product
                    },
                ],
                function(err) {
                  if (err) throw err;
                  console.log("-------------------------------------------------------------");
                  console.log(`That will be a total of $${ total }.  Enjoy your purchase!`);
                  console.log("-------------------------------------------------------------");
                }
            );
            } else { console.log("-------------------------------------------------------------");
                     console.log("Insufficient quantity!");
                     console.log("-------------------------------------------------------------");
             } 
            showInventory();
        });
    });
}