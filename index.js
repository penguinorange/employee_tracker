const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
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
                addRoles();
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

// async/await method
async function addDepartments() {
    const department = await inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);
    await connection.query("INSERT INTO department SET ?", department);
    console.log(`Added ${department.name} to the database`);
    mainPrompts();
}

function displayRoles() {
    console.log("\n");
    connection.query("SELECT * FROM role").then(response => {
        console.table(response);
        mainPrompts();
    })
}

// async/await method
async function addRoles() {
    const role = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "department_id",
            message: "Please enter the department ID for this role",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "You must enter a number";
            }
        }
    ]);
    await connection.query("INSERT INTO role SET ?", role);
    console.log(`Added ${role.title} to the database`);
    mainPrompts();
}

function displayEmployees() {
    console.log("\n");
    connection.query("SELECT * FROM employee").then(response => {
        console.table(response);
        mainPrompts();
    })
}

// async/await method
async function addEmployees() {
    const employee = await inquirer.prompt([
        {
            name: "first_name",
            message: "What is the first name of this employee?"
        },
        {
            name: "last_name",
            message: "What is the last name of this employee?"
        },
        {
            name: "role_id",
            message: "What is this employee's ID number?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "You must enter a number";
            }
        },
        {
            name: "manager_id",
            message: "What is this employee's manager ID number?",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "You must enter a number";
            }
        }
    ]);
    await connection.query("INSERT INTO employee SET ?", employee);
    console.log(`Added ${employee.name} to the database`);
    mainPrompts();
}



async function updateEmployRole() {
    const employeeUpdate = await inquirer.prompt([
        {
            name: "id",
            message: "Please select an employee by ID number",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "You must enter a number";
            }
        },
        {
            name: "role_id",
            message: "Please enter the new role ID number for their update",
            validate: answer => {
                const pass = answer.match(
                    /^[1-9]\d*$/
                );
                if (pass) {
                    return true;
                }
                return "You must enter a number";
            }
        }
    ]);
    // const employUpdate = employeeUpdate.map(v => parseInt(v, 10));
    // console.log(employUpdate)
    console.log(employeeUpdate)
    var arr = [];
for (var i = 0; i < employeeUpdate.length; i++) {
    arr.push(employeeUpdate[i].value);
}
    console.log(arr)




    // console.log(Object.entries(employeeUpdate))
    // await connection.query("UPDATE employee SET role_id = ? WHERE id = ?", employUpdate);
    // console.log(parseInt(employeeUpdate))
    console.log(`Updated employee #${employeeUpdate.id} to the database`);
    mainPrompts();
};

mainPrompts();

