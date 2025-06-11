// Inventory Management System Console Based Application
const prompts = require('prompts');
const kleur = require('kleur');
const { Inventory } = require('./inventory.js');
const { PerishableItem, NonPerishableItem } = require('./item.js');

const inventory = new Inventory();

// Function to display the main menu
async function mainMenu() {
    console.clear();
    console.log(kleur.blue('Welcome to the Inventory Management System'));
    console.log(kleur.green('1. Add Item'));
    console.log(kleur.green('2. View Items'));
    console.log(kleur.green('3. Update Item'));
    console.log(kleur.green('4. Delete Item'));
    console.log(kleur.red('5. Exit'));

    const response = await prompts({
        type: 'number',
        name: 'choice',
        message: 'Please select an option (1-5):',
        validate: value => (value >= 1 && value <= 5) ? true : 'Please enter a number between 1 and 5'
    });

    switch (response.choice) {
        case 1:
            await addItemPrompt();
            break;
        case 2:
            await viewItems();
            break;
        case 3:
            await updateItemPrompt();
            break;
        case 4:
            await deleteItemPrompt();
            break;
        case 5:
            console.log(kleur.yellow('Exiting...'));
            process.exit(0);
            break;
        default:
            mainMenu();
            break;
    }
}

// Function to prompt for adding an item
async function addItemPrompt() {
    const questions = [
        { type: 'text', name: 'name', message: 'Enter item name:' },
        { type: 'number', name: 'quantity', message: 'Enter item quantity:', validate: value => !isNaN(value) || 'Please enter a number' },
        { type: 'number', name: 'price', message: 'Enter item price:', validate: value => !isNaN(value) || 'Please enter a number' },
        { type: 'confirm', name: 'isPerishable', message: 'Is the item perishable?', initial: false }
    ];

    const answers = await prompts(questions);

    if (answers.isPerishable) {
        const perishableAnswers = await prompts({
            type: 'date',
            name: 'expiryDate',
            message: 'Enter expiry date:',
            mask: 'YYYY-MM-DD'
        });
        const newItem = new PerishableItem(answers.name, answers.quantity, answers.price, perishableAnswers.expiryDate);
        inventory.addItem(newItem);
        console.log(kleur.green('Perishable item added successfully!'));
    } else {
        const newItem = new NonPerishableItem(answers.name, answers.quantity, answers.price);
        inventory.addItem(newItem);
        console.log(kleur.green('Non-perishable item added successfully!'));
    }
    mainMenu();
}

// Function to view all items
async function viewItems() {
    console.clear();
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(kleur.yellow('No items in inventory.'));
    } else {
        items.forEach(item => {
            console.log(kleur.cyan(item.getDescription()));
        });
    }

    const response = await prompts({
        type: 'confirm',
        name: 'back',
        message: 'Go back to main menu?',
        initial: true
    });

    if (response.back) {
        mainMenu();
    }
}

// Function to prompt for updating an item
async function updateItemPrompt() {
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(kleur.yellow('No items to update.'));
        mainMenu();
        return;
    }

    const itemChoices = items.map((item, index) => ({ title: item.getDescription(), value: index }));

    const response = await prompts({
        type: 'select',
        name: 'index',
        message: 'Select an item to update:',
        choices: itemChoices
    });
    
    const index = response.index;
    if (index === undefined) { mainMenu(); return; }


    const oldItem = items[index];

    const updateQuestions = [
        { type: 'text', name: 'name', message: 'Enter new item name:', initial: oldItem.name },
        { type: 'number', name: 'quantity', message: 'Enter new item quantity:', initial: oldItem.quantity, validate: value => !isNaN(value) || 'Please enter a number' },
        { type: 'number', name: 'price', message: 'Enter new item price:', initial: oldItem.price, validate: value => !isNaN(value) || 'Please enter a number' }
    ];

    const answers = await prompts(updateQuestions);

    let updatedItem;
    if (oldItem instanceof PerishableItem) {
        const perishableAnswers = await prompts({
            type: 'date',
            name: 'expiryDate',
            message: `Enter new expiry date`,
            initial: oldItem.expiryDate
        });
        updatedItem = new PerishableItem(answers.name, answers.quantity, answers.price, perishableAnswers.expiryDate);
    } else {
        updatedItem = new NonPerishableItem(answers.name, answers.quantity, answers.price);
    }

    inventory.updateItem(index, updatedItem);
    console.log(kleur.green('Item updated successfully!'));
    mainMenu();
}

// Function to prompt for deleting an item
async function deleteItemPrompt() {
    const items = inventory.viewItems();
    if (items.length === 0) {
        console.log(kleur.yellow('No items to delete.'));
        mainMenu();
        return;
    }

    const itemChoices = items.map((item, index) => ({ title: item.getDescription(), value: index }));

    const response = await prompts([
        {
            type: 'select',
            name: 'index',
            message: 'Select an item to delete:',
            choices: itemChoices
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (prev) => `Are you sure you want to delete "${items[prev].name}"?`,
            initial: false
        }
    ]);
    
    const index = response.index;
    if (index === undefined) { mainMenu(); return; }

    if (response.confirm) {
        inventory.deleteItem(index);
        console.log(kleur.green('Item deleted successfully!'));
    } else {
        console.log(kleur.yellow('Deletion cancelled.'));
    }
    mainMenu();
}

// Start the application
mainMenu();