const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/database');

connection.connect(err => {
    if (err) throw err;
    console.log('Welcome to Employee Tracker');
    console.log('Connected to database as id ' + connection.threadId);
    crudChoice();
});

const endConnection = () => {
    connection.end();
    console.log("Bye");
};

const crudChoice = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'crudChoice',
            message: "Do you want to:",
            choices: ['Create', 'Read', 'Update', 'Delete', 'Leave']
        },
        {
            type: 'list',
            name: 'createChoices',
            message: 'What would you like to create?',
            choices: ['A new Department', 'A new Role', 'A new Employee'],
            when: (answers) => answers.crudChoice === 'Create'
        },
        {
            type: 'list',
            name: 'readChoices',
            message: 'What would you like to read?',
            choices: ['All Departments', 'All Roles', 'All Employee\'s', 'Budget by Department'],
            when: (answers) => answers.crudChoice === 'Read'
        },
        {
            type:'list',
            name: 'updateChoices',
            message: 'What would you like to Update?',
            choices: ['An Employee\'s Role', 'An Employee\'s Salary', 'An Employee\'s manager'],
            when: (answers) => answers.crudChoice === 'Update'
        },
        {
            type: 'list',
            name: 'deleteChoices',
            message: 'What would you like to delete?',
            choices: ['A Department', 'A Role', 'An Employee'],
            when: (answers) => answers.crudChoice === 'Delete'
        }
    ])
}