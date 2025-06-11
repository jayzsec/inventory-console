// Inventory Management System Console Based Application
import inquirer from 'inquirer';
import chalk from 'chalk';
import { Inventory } from './inventory.js';
import { PerishableItem, NonPerishableItem } from './item.js';

const inventory = new Inventory();

// Function to display the main menu
export function mainMenu() {
    console.clear();
    console.log(chalk.blue('Welcome to the Inventory Management System'));
    console.log(chalk.green('1. Add Item'));
    console.log(chalk.green('2. View Items'));
    console.log(chalk.green('3. Update Item'));
    console.log(chalk.green('4. Delete Item'));
    console.log(chalk.red('5. Exit'));

    // Prompt user for their choice
    inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'Please select an option (1-5):',
            // Validate input to ensure it's a number between 1 and 5
            // validate is a inquirer function that checks the input
            validate: function (value) {
                const pass = value.match(/^[1-5]$/);
                if (pass) {
                    return true;
                }
                return 'Please enter a valid option.';
            }
        }
    ]).then(answers => {
        switch (answers.choice) {
            case '1':
                addItemPrompt();
                break;
            case '2':
                viewItems();
                break;
            case '3':
                updateItemPrompt();
                break;
            case '4':
                deleteItemPrompt();
                break;
            case '5':
                console.log(chalk.yellow('Exiting...'));
                process.exit(0);
        }
    });
}

// Function to prompt for adding an item
function addItemPrompt() {
    inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter item name:' },
        { type: 'input', name: 'quantity', message: 'Enter item quantity:', validate: input => !isNaN(parseFloat(input)) || 'Please enter a number' },
        { type: 'input', name: 'price', message: 'Enter item price:', validate: input => !isNaN(parseFloat(input)) || 'Please enter a number' },
        { type: 'confirm', name: 'isPerishable', message: 'Is the item perishable?' }
    ]).then(answers => {
        if (answers.isPerishable) {
            inquirer.prompt([
                { type: 'input', name: 'expiryDate', message: 'Enter expiry date (YYYY-MM-DD):' }
            ]).then(perishableAnswers => {
                const newItem = new PerishableItem(answers.name, parseFloat(answers.quantity), parseFloat(answers.price), new Date(perishableAnswers.expiryDate));
                inventory.addItem(newItem);
                console.log(chalk.green('Perishable item added successfully!'));
                mainMenu();
            });
        } else {
            const newItem = new NonPerishableItem(answers.name, parseFloat(answers.quantity), parseFloat(answers.price));
            inventory.addItem(newItem);
            console.log(chalk.green('Non-perishable item added successfully!'));
            mainMenu();
        }
    });
}

// Function to view all items
function viewItems() {
    console.clear();
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(chalk.yellow('No items in inventory.'));
    } else {
        items.forEach(item => {
            console.log(chalk.cyan(item.getDescription()));
        });
    }
    inquirer.prompt([
        { type: 'confirm', name: 'back', message: 'Go back to main menu?' }
    ]).then(answers => {
        if (answers.back) {
            mainMenu();
        }
    });
}

// Function to prompt for updating an item
function updateItemPrompt() {
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(chalk.yellow('No items to update.'));
        mainMenu();
        return;
    }
    inquirer.prompt([
        {
            type: 'list',
            name: 'index',
            message: 'Select an item to update:',
            choices: items.map((item, index) => ({ name: item.getDescription(), value: index }))
        },
        { type: 'input', name: 'name', message: 'Enter new item name:' },
        { type: 'input', name: 'quantity', message: 'Enter new item quantity:', validate: input => !isNaN(parseFloat(input)) || 'Please enter a number' },
        { type: 'input', name: 'price', message: 'Enter new item price:', validate: input => !isNaN(parseFloat(input)) || 'Please enter a number' }
    ]).then(answers => {
        const oldItem = items[answers.index];
        let updatedItem;
        if (oldItem instanceof PerishableItem) {
            inquirer.prompt([
                { type: 'input', name: 'expiryDate', message: `Enter new expiry date (current: ${oldItem.expiryDate.toISOString().split('T')[0]}):` }
            ]).then(perishableAnswers => {
                updatedItem = new PerishableItem(answers.name, parseFloat(answers.quantity), parseFloat(answers.price), new Date(perishableAnswers.expiryDate));
                inventory.updateItem(answers.index, updatedItem);
                console.log(chalk.green('Item updated successfully!'));
                mainMenu();
            });
        } else {
            updatedItem = new NonPerishableItem(answers.name, parseFloat(answers.quantity), parseFloat(answers.price));
            inventory.updateItem(answers.index, updatedItem);
            console.log(chalk.green('Item updated successfully!'));
            mainMenu();
        }
    });
}

// Function to prompt for deleting an item
function deleteItemPrompt() {
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(chalk.yellow('No items to delete.'));
        mainMenu();
        return;
    }
    inquirer.prompt([
        {
            type: 'list',
            name: 'index',
            message: 'Select an item to delete:',
            choices: items.map((item, index) => ({ name: item.getDescription(), value: index }))
        },
        { type: 'confirm', name: 'confirm', message: 'Are you sure you want to delete this item?' }
    ]).then(answers => {
        if (answers.confirm) {
            inventory.deleteItem(answers.index);
            console.log(chalk.green('Item deleted successfully!'));
        } else {
            console.log(chalk.yellow('Deletion cancelled.'));
        }
        mainMenu();
    });
}

// Start the application
mainMenu();