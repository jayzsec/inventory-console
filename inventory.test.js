// inventory.test.js

const { Inventory } = require('./inventory.js');
const { PerishableItem, NonPerishableItem } = require('./item.js');

describe('Inventory', () => {
    let inventory;

    beforeEach(() => {
        inventory = new Inventory();
        // Mock fs to avoid actual file system operations during tests
        jest.spyOn(inventory, 'saveInventory').mockImplementation(() => {});
    });

    test('should add a new non-perishable item', () => {
        const item = new NonPerishableItem('Laptop', 10, 1500);
        inventory.addItem(item);
        expect(inventory.viewItems()).toContain(item);
        expect(inventory.transactionLog.some(log => log.includes('Added item: Laptop'))).toBe(true);
    });

    test('should add a new perishable item', () => {
        const expiryDate = new Date('2025-12-31');
        const item = new PerishableItem('Milk', 2, 3, expiryDate);
        inventory.addItem(item);
        expect(inventory.viewItems()).toContain(item);
        expect(inventory.transactionLog.some(log => log.includes('Added item: Milk'))).toBe(true);
        expect(item.getDescription()).toContain('Dec 31 2025');
    });
});