const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

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
    start();
});

start = () => {
    inquirer
      .prompt([
            {
            name: "schedule",
            type: "list",
            message: "What would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
      ])
      .then(answers => {
        if(answers.schedule === "View Products for Sale"){
            viewInventory();
        } else if(answers.schedule === "View Low Inventory"){
            lowInventory();
        } else if(answers.schedule === "Add to Inventory"){
            addInentory();
        } else if(answers.schedule === "Add New Product"){
            newProduct();
        }
      });
}

let viewInventory = () => {
    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);
        console.log("-------------------------------------------------------------");
        start();
    });
}

let lowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity < 15", function(err, res) {
        console.table(res);
        console.log("-------------------------------------------------------------");
        start();
    });
}

let addInentory = () => {
    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);
        if (err) throw err;
        inquirer
          .prompt([
            {
                name: "addProduct",
                type: "input",
                message: "What is the ID of the product you would like to add to?"
            },
            {
                name: "addQuantity",
                type: "input",
                message: "How many would you like to add?"
            }
          ])
          .then(answer => {
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[(answer.addProduct - 1)].stock_quantity + parseInt(answer.addQuantity) 
                    },
                    {
                        item_id: answer.addProduct
                    },
                ],
                function(err) {
                  if (err) throw err;
                  console.log("-------------------------------------------------------------");
                  console.log(`You've added ${ answer.addQuantity } more units to your ${ answer.addProduct } stock`);
                  console.log("-------------------------------------------------------------");
                  viewInventory();
                }
            );
        });
        // console.table(res);
    });
}

let newProduct = () => {
    inquirer
    .prompt([
        {
        name: "product",
        type: "input",
        message: "What product would you like to add?"
        },
        {
        name: "department",
        type: "input",
        message: "What department are we adding this product to?"
        },
        {
        name: "price",
        type: "input",
        message: "How much does this item sell for?"
        },
        {
        name: "stock",
        type: "input",
        message: "How many do we want to add?"
        }
    ])
    .then(answers => {
        connection.query(
        "INSERT INTO products SET ?",      
            {
                product_name: answers.product,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.stock
            },
        function(err, res) {
            if (err) throw err;
        });
        console.table(res);
        start();
    });
}
