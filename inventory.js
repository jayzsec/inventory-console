// inventory.js
// Inventory Management System Logic
import fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { mainMenu } from './index.js';
import { Item, PerishableItem, NonPerishableItem } from './item.js';

// Class to manage inventory operations
export class Inventory {
    constructor() {
        this.items = [];
        this.transactionLog = [];
        this.loadInventory();
    }

    // Loads inventory from a JSON file.
    // Change JSON to TXT later
    // It recreates the item objects based on their type. 
    loadInventory() {
        try {
            const data = fs.readFileSync("./inventory.json", 'utf8');
            const inventoryData = JSON.parse(data);
            this.items = inventoryData.map(itemData => {
                if (itemData.type === 'Perishable') {
                    return new PerishableItem(itemData.name, itemData.quantity, itemData.price, new Date(itemData.expiryDate));
                }
                return new NonPerishableItem(itemData.name, itemData.quantity, itemData.price);
            });
            this.logTransaction("Inventory loaded from JSON data.");
        } catch (err) {
            this.items = [];
            this.logTransaction("No inventory file found. Starting with an empty inventory.");
        }
    }

    
    // Saves the current inventory to a JSON file.
    // It stores the type of each item so it can be correctly loaded later.
    saveInventory() {
        const inventoryData = this.items.map(item => {
            const itemData = {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                type: item instanceof PerishableItem ? 'Perishable' : 'NonPerishable'
            };
            if (item instanceof PerishableItem) {
                itemData.expiryDate = item.expiryDate;
            }
            return itemData;
        });
        fs.writeFileSync("./inventory.json", JSON.stringify(inventoryData, null, 2));
        this.logTransaction("Inventory saved to JSON file.");
    }

    
    // Logs a transaction to the transaction log.     
    logTransaction(transaction) {
        this.transactionLog.push(`${new Date().toISOString()}: ${transaction}`);
        console.log(chalk.gray(`[LOG] ${transaction}`));
    }

    
    // Adds an item to the inventory.
    addItem(item) {
        this.items.push(item);
        this.logTransaction(`Added item: ${item.name}`);
        this.saveInventory();
    }

    
    // Returns all items in the inventory.
    // returns { Item[] }
    viewItems() {
        this.logTransaction("Viewed all items.");
        return this.items;
    }

    
    // Updates an item in the inventory.
    updateItem(index, updatedItem) {
        // index - The index of the item to update
        // updatedItem - The updated item.
        this.items[index] = updatedItem; 
        this.logTransaction(`Updated item: ${updatedItem.name}`);
        this.saveInventory();
    }

    
    //  Deletes an item from the inventory.
    deleteItem(index) {
        // index - The index of the item to delete
        const itemName = this.items[index].name;
        this.items.splice(index, 1);
        this.logTransaction(`Deleted item: ${itemName}`);
        this.saveInventory();
    }
}