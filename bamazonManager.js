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
    start();
});

start = () => {
    inquirer
      .prompt([
        /* Pass your questions in here */
      ])
      .then(answers => {
        // Use user feedback for... whatever!!
      });
}