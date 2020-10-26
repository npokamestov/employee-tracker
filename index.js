const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/database');

const { createDepartment, deleteDepartment} = require('./queries/departmentQueries');
const { createRole, deleteRole } = require('./queries/roleQueries');
const { createEmployee, deleteEmployee, updateEmpManager, updateEmpRole } = require('./queries/employeeQueries');


connection.connect(err => {
    if (err) {
        console.log(err)
    }
    console.log('Welcome to Employee Tracker');
    crudChoice();
});

const endConnection = () => {
    connection.end();
    console.log("Bye!");
};

const crudChoice = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'crudChoices',
            message: "Do you want to:",
            choices: ['Create', 'Read', 'Update', 'Delete', 'Leave']
        },
        {
            type: 'list',
            name: 'createChoices',
            message: 'What would you like to create?',
            choices: ['A new Department', 'A new Role', 'A new Employee', 'Go Back'],
            when: (answers) => answers.crudChoices === 'Create'
        },
        {
            type: 'list',
            name: 'readChoices',
            message: 'What would you like to read?',
            choices: ['All Departments', 'All Roles', 'All Employee\'s', 'Budget by Department', 'Go Back'],
            when: (answers) => answers.crudChoices === 'Read'
        },
        {
            type:'list',
            name: 'updateChoices',
            message: 'What would you like to Update?',
            choices: ['An Employee\'s Role', 'An Employee\'s manager', 'Go Back'],
            when: (answers) => answers.crudChoices === 'Update'
        },
        {
            type: 'list',
            name: 'deleteChoices',
            message: 'What would you like to delete?',
            choices: ['A Department', 'A Role', 'An Employee', 'Go Back'],
            when: (answers) => answers.crudChoices === 'Delete'
        }
    ])
    .then(answer => {
        if (answer.createChoices === 'A new Department') {
            createDepartmentPrompt();
        }
        else if (answer.createChoices === 'A new Role') {
            createRolePrompt();
        }
        else if (answer.createChoices === 'A new Employee') {
            createEmployeePrompt();
        }
        else if (answer.readChoices === 'All Departments') {
            const sql = `SELECT id AS "Department ID", name AS "Department Name" FROM department`;
            const params = [];
            connection.promise().query(sql,params)
            .then ( ([rows, fields]) => {
                console.table(rows)
            })
            .then(crudChoice)
        }
        else if (answer.readChoices === 'All Roles') {
            const sql = `SELECT role.id AS "Roles ID", 
                        role.title AS "Role Title",
                        department.name AS "Department Name",
                        role.salary AS "Salary"
                        FROM role
                        LEFT JOIN department
                        ON role.department_id = department.id`;
            const params = [];
            connection.promise().query(sql,params)
            .then ( ([rows, fields]) => {
                console.table(rows)
            })
            .then(crudChoice)
        }
        else if (answer.readChoices === 'All Employee\'s') {
            const sql = `SELECT e.id AS "Employee's ID",
                        e.first_name AS "First Name",
                        e.last_name AS "Last Name",
                        role.title AS "Role Title",
                        department.name AS "Department",
                        role.salary AS "Salary",
                        CONCAT(m.first_name, ' ', m.last_name) AS "Manager Name"
                        FROM employee e
                        LEFT JOIN role ON e.role_id = role.id
                        LEFT JOIN employee m ON m.id = e.manager_id
                        LEFT JOIN department ON role.department_id = department.id`;
            const params = [];
            connection.promise().query(sql,params)
            .then ( ([rows, fields]) => {
                console.table(rows)
            })
            .then(crudChoice)
        }
        else if (answer.readChoices === 'Budget by Department') {
            const sql = `SELECT department.name AS "Department Name",
                        SUM(salary) AS "Department Budget",
                        COUNT(role.title) AS "Employee Count"
                        FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        GROUP BY department.name`;
            const params = [];
            connection.promise().query(sql, params)
            .then( ([rows, fields]) => {
                console.table(rows)
            })
            .then(crudChoice)
        }
        else if (answer.updateChoices === 'An Employee\'s Role') {
            updateEmpRolePrompt();
        }
        else if (answer.updateChoices === 'An Employee\'s manager') {
            updateEmpManagerPrompt();
        }
        else if (answer.deleteChoices === 'A Department') {
            deleteDepartmentPrompt();
        }
        else if (answer.deleteChoices === 'A Role') {
            deleteRolePrompt();
        }
        else if (answer.deleteChoices === 'An Employee') {
            deleteEmployeePrompt();
        }
        else if (answer.createChoices === 'Go Back') {
            crudChoice();
        }
        else if (answer.readChoices === 'Go Back') {
            crudChoice();
        }
        else if (answer.updateChoices === 'Go Back') {
            crudChoice();
        }
        else if (answer.deleteChoices === 'Go Back') {
            crudChoice();
        }
        else if (answer.crudChoices === 'Leave') {
            endConnection();
        }
    });
};

const createDepartmentPrompt = () =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter a department name'
        }
    ])
    .then (answers => {
        createDepartment(answers.departmentName);
        console.log(answers.departmentName + " added to the department table!");
        crudChoice();
    });
};

const createRolePrompt = () => {
    connection.query('SELECT id as department_id, name as department_name FROM department',
    function(err,rows) {
        if (err) console.log(err)
        const departmentList = rows.map(Object => Object.department_name);
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter a Role Title'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the Role Salary'
            },
            {
                type: 'list',
                name: 'roleDepartment',
                message: 'Select a Department for this Role',
                choices: departmentList
            }
        ])
        .then(answers => {
            let departmentRow = rows.find(Object => Object.department_name === answers.roleDepartment);
            let departmentId = departmentRow.department_id;
            const newRole = {
                'title': answers.roleTitle,
                'salary': answers.roleSalary,
                'department_id': departmentId
            };
            createRole(newRole);
            console.log(answers.roleTitle + ' added to role table!');
            crudChoice();
        });
    });
};

const createEmployeePrompt = () => {
    connection.query(`SELECT id as role_id,
                    title as role_title,
                    null as manager_id,
                    null as manager_name
                    FROM role
                    UNION
                    SELECT null as role_id,
                    null as role_title,
                    id as manager_id,
                    CONCAT(first_name, ' ', last_name) as manager_name
                    FROM employee`,
    function(err,rows) {
        if (err) console.log(err);
        const uncutRoleList = rows.map(Object => Object.role_title);
        const roleList = uncutRoleList.filter(element => element !=null);
        const uncutMangerList = rows.map(Object => Object.manager_name);
        const managerList = uncutMangerList.filter(element => element !=null);
        managerList.unshift('None');

        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter the Employee\'s First Name'
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter the Employee\'s Last Name'
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'Select the Employee\'s Role',
                choices: roleList
            },
            {
                type: 'list',
                name: 'managerName',
                message: 'Select the Employee\'s Manager',
                choices: managerList
            }
        ])
        .then(answers => {
            let roleRow = rows.find(Object => Object.role_title === answers.employeeRole);
            let roleId = roleRow.role_id;
            let managerId = null;
            if (answers.managerName === 'None') {
                managerId = null
            }
            else {
                let managerRow = rows.find(Object => Object.manager_name === answers.managerName);
                managerId = managerRow.manager_id;
            }
            const newEmployee = {
                'first_name': answers.employeeFirstName,
                'last_name': answers.employeeLastName,
                'role_id': roleId,
                'manager_id': managerId
            };
            createEmployee(newEmployee);
            console.log(answers.employeeFirstName + ' ' + answers.employeeLastName + ' added to the employee table!');
            crudChoice();
        });
    });
};

const updateEmpRolePrompt = () => {
    connection.query(`SELECT id AS role_id,
                    title AS role_title,
                    null AS employee_id,
                    null AS employee_name
                    FROM role
                    UNION
                    SELECT null AS role_id,
                    null AS role_title,
                    id AS employee_id,
                    CONCAT(first_name, ' ', last_name) AS employee_name
                    FROM employee`,
    function (err,rows) {
        if (err) throw err;
        const uncutRoleList = rows.map(Object => Object.role_title);
        const roleList = uncutRoleList.filter(element => element !=null);
        const uncutEmployeeList = rows.map(Object => Object.employee_name);
        const employeeList = uncutEmployeeList.filter(element => element !=null);

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeSelect',
                message: 'Select an Employee',
                choices: employeeList
            },
            {
                type: 'list',
                name: 'roleSelect',
                message: 'Select a Role',
                choices: roleList
            }
        ])
        .then(answers => {
            let roleRow = rows.find(Object => Object.role_title === answers.roleSelect);
            let roleId = roleRow.role_id;
            let employeeRow = rows.find(Object => Object.employee_name === answers.employeeSelect);
            let employeeId = employeeRow.employee_id;
            const newRole = {
                'employee_id': employeeId,
                'role_id': roleId
            };
            updateEmpRole(newRole);
            console.log(answers.employeeSelect + '\'s role changed to ' + answers.roleSelect);
            crudChoice();
        });
    });
};

const updateEmpManagerPrompt = () => {
    connection.query(`SELECT id AS employee_id,
                    CONCAT(first_name, ' ', last_name) AS name
                    FROM employee`,
    function (err, rows) {
        if (err) throw err;
        const employeeList = rows.map(Object => Object.name);

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select an Employee',
                choices: employeeList
            }
        ])
        .then(employeeInfo => {
            const managerList = employeeList.filter(currentEmployee => currentEmployee !== employeeInfo.employee)
            managerList.unshift('None')

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Assign a Manager',
                    choices: managerList
                }
            ])
            .then(managerInfo => {
                let employeeRow = rows.find(Object => Object.name === employeeInfo.employee);
                let employeeId = employeeRow.employee_id;
                let managerId = null;
                if (managerInfo.manager === "None") {managerId = null}
                else {
                    let managerRow = rows.find(Object => Object.name === managerInfo.manager);
                    managerId = managerRow.employee_id;
                }
                const updatedManager = {
                    'manager_id': managerId,
                    'employee_id': employeeId
                };
                updateEmpManager(updatedManager);
                console.log(employeeInfo.employee + '\'s manager changed to '+ managerInfo.manager)
                crudChoice();
            });
        });
    });
};

const deleteDepartmentPrompt = () => {
    console.log('Warning!!! Deleting a department will delete the roles under it! Employee\'s will have to be manually updated.');
    connection.query(`SELECT id AS department_id,
                    name AS department_name
                    FROM department`,
    function(err, rows) {
        if (err) throw err;
        const departmentList = rows.map(Object => Object.department_name);

        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentSelect',
                message: 'Select a Department to DELETE',
                choices: departmentList
            }
        ])
        .then(answers => {
            let departmentRow = rows.find(Object => Object.department_name === answers.departmentSelect);
            let departmentId = departmentRow.department_id;
            deleteDepartment(departmentId);
            console.log(answers.departmentSelect + ' has been deleted!');
            crudChoice();
        })
    });
};

const deleteRolePrompt = () => {
    console.log('Warning!!! Employee\'s will have to be manually updated!');
    connection.query(`SELECT id, title FROM role`,
    function(err, rows) {
        if (err) throw err;
        const roleList = rows.map(Object => Object.title);

        inquirer.prompt([
            {
                type: 'list',
                name: 'roleSelect',
                message: 'Select a Role to DELETE',
                choices: roleList
            }
        ])
        .then(answers => {
            let roleRow = rows.find(Object => Object.title === answers.roleSelect);
            let roleId =  roleRow.id;
            deleteRole(roleId);
            console.log(answers.roleSelect + ' has been deleted!');
            crudChoice();
        });
    });
};

const deleteEmployeePrompt = () => {
    connection.query(`SELECT id AS employee_id,
                    CONCAT(first_name, ' ', last_name) AS name
                    FROM employee`,
    function(err, rows) {
        if (err) throw err;
        const employeeList = rows.map(Object => Object.name);

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeSelect',
                message: 'Select an employee to DELETE',
                choices: employeeList
            }
        ])
        .then(answers => {
            let employeeRow = rows.find(Object =>  Object.name === answers.employeeSelect);
            let employeeId = employeeRow.employee_id;
            deleteEmployee(employeeId);
            console.log(answers.employeeSelect + ' has been deleted!');
            crudChoice();
        });
    });
};