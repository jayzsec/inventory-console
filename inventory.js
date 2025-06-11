// inventory.js
// Inventory Management System Logic
import fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import inventoryData from './inventory.json' with {type: 'json'};
import { mainMenu } from './index.js';

// Class to manage inventory operations
export class Inventory {
    constructor() {
        this.loadInventory();
    }

    loadInventory() {
        if (inventoryData && inventoryData.length >= 0) {
            this.items = inventoryData;
            console.log('Inventory loaded from JSON data.');
        } else {
            this.items = [];
        }
    }

    saveInventory() {
        fs.writeFileSync("./inventory.json" , JSON.stringify(this.items, null, 2));
    }

    addItem(item) {
        this.items.push(item);
        this.saveInventory();
    }

    viewItems() {
        return this.items;
    }

    updateItem(index, updatedItem) {
        this.items[index] = updatedItem;
        this.saveInventory();
    }

    deleteItem(index) {
        this.items.splice(index, 1);
        this.saveInventory();
    }
}


// Function to add an item to the inventory
export function addItem() {
    console.clear();
    inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter item name:' },
        { type: 'input', name: 'quantity', message: 'Enter item quantity:' },
        { type: 'input', name: 'price', message: 'Enter item price:' }
    ]).then(answers => {
        const i = new Inventory();
        i.addItem(answers);
        console.log(chalk.green('Item added successfully!'));
        mainMenu();
    });
}

// Function to view all items in the inventory
export function viewItems() {
    console.clear();
    const i = new Inventory();
    const items = i.viewItems();
    if (items.length === 0) {
        console.log(chalk.yellow('No items in inventory.'));
    } else {
        console.table(items);
    }
    inquirer.prompt([
        { type: 'confirm', name: 'back', message: 'Go back to main menu?' }
    ]).then(answers => {
        if (answers.back) {
            mainMenu();
        } else {
            process.exit(0);
        }
    });
}

// Function to update an item in the inventory
export function updateItem() {
    console.clear();
    const i = new Inventory();
    const items = i.viewItems();
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
            choices: items.map((item, index) => ({ name: `${item.name} (Quantity: ${item.quantity}, Price: ${item.price})`, value: index }))
        },
        { type: 'input', name: 'name', message: 'Enter new item name:' },
        { type: 'input', name: 'quantity', message: 'Enter new item quantity:' },
        { type: 'input', name: 'price', message: 'Enter new item price:' }
    ]).then(answers => {
        i.updateItem(answers.index, { name: answers.name, quantity: answers.quantity, price: answers.price });
        console.log(chalk.green('Item updated successfully!'));
        mainMenu();
    });
}

// Function to delete an item from the inventory
export function deleteItem() {
    console.clear();
    const i = new Inventory();
    const items = i.viewItems();
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
            choices: items.map((item, index) => ({ name: `${item.name} (Quantity: ${item.quantity}, Price: ${item.price})`, value: index }))
        },
        { type: 'confirm', name: 'confirm', message: 'Are you sure you want to delete this item?' }
    ]).then(answers => {
        if (answers.confirm) {
            i.deleteItem(answers.index);
            console.log(chalk.green('Item deleted successfully!'));
        } else {
            console.log(chalk.yellow('Deletion cancelled.'));
        }
        mainMenu();
    });
}