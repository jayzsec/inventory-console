// Inventory Management System Console Based Application
import inquirer from 'inquirer';
import chalk from 'chalk';

// import functions from './inventory.js';
import { addItem, viewItems, updateItem, deleteItem } from './inventory.js';

// Function to display the main menu
export function mainMenu() {
    console.clear();
    console.log(chalk.blue('Welcome to the Inventory Management System'));
    console.log(chalk.green('1. Add Item'));
    console.log(chalk.green('2. View Items'));
    console.log(chalk.green('3. Update Item'));
    console.log(chalk.green('4. Delete Item'));
    console.log(chalk.red('5. Exit'));

    inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'Please select an option (1-5):'
        }
    ]).then(answers => {
        switch (answers.choice) {
            case '1':
                addItem();
                console.log(chalk.green('Item added successfully!'));
                break;
            case '2':
                // viewItems();
                viewItems();
                console.log(chalk.green('Items viewed successfully!'));
                break;
            case '3':
                updateItem();
                console.log(chalk.green('Item updated successfully!'));
                break;
            case '4':
                deleteItem();
                console.log(chalk.green('Item deleted successfully!'));
                break;
            case '5':
                console.log(chalk.yellow('Exiting...'));
                process.exit(0);
            default:
                console.log(chalk.red('Invalid choice, please try again.'));
                mainMenu();
        }
    });
}

// Start the application by displaying the main menu
mainMenu();