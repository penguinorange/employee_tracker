const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: "rootroot",
    database: "employees"
});

connection.connect();

// Setting up connection.query to use promises instead of callbacks
// This allows us to use the async/await syntax
connection.query = util.promisify(connection.query);

function mainPrompts() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            {
                name: "View Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Departments",
                value: "ADD_DEPARTMENTS"
            },
            {
                name: "View Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Roles",
                value: "ADD_ROLES"
            },
            {
                name: "View Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "Add Employees",
                value: "ADD_EMPLOYEES"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOY_ROLE"
            },
            {
                name: "Exit",
                value: "EXIT"
            }
        ]
    }]).then(({ choice }) => {
        switch (choice) {
            case "VIEW_DEPARTMENTS":
                displayDepartments();
                break;
            case "ADD_DEPARTMENTS":
                addDepartments();
                break;
            case "VIEW_ROLES":
                displayRoles();
                break;
            case "ADD_ROLES":
                addRoless();
                break;
            case "VIEW_EMPLOYEES":
                displayEmployees();
                break;
            case "ADD_EMPLOYEES":
                addEmployees();
                break;
            case "UPDATE_EMPLOY_ROLE":
                updateEmployRole();
                break;
            case "EXIT":
            default:
                process.exit();
        }
    })
}

function displayDepartments() {
    console.log("\n");
    connection.query("SELECT * FROM department").then(response => {
        console.table(response);
        mainPrompts();
    })
}

