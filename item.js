// item.js

//  Represents a base item in the inventory.
//  This class is not meant to be instantiated directly.
class Item {
    // Constructor for the Item class.
    constructor(name, quantity, price) {
        if (this.constructor === Item) {
            throw new Error("You should not make an instance of ITEM! This is an ABSTRACT class");
        }
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
    
    // Returns a description of the item.
    getDescription() {
        return `Item: ${this.name}, Quantity: ${this.quantity}, Price: ${this.price}`;
    }
}


// Represents a perishable item, which is a subclass of Item.
class PerishableItem extends Item {
    // Constructor for the PerishableItem class.
    constructor(name, quantity, price, expiryDate) {
        super(name, quantity, price);
        this.expiryDate = expiryDate;
    }

    
    // Returns a description of the perishable item, including the expiry date.
    // This method overrides the base class method to demonstrate polymorphism. 
    getDescription() {
        return `${super.getDescription()}, Expiry Date: ${this.expiryDate.toDateString()}`;
    }
}

// Represents a non-perishable item, which is a subclass of Item.
class NonPerishableItem extends Item {
    // Constructor for the NonPerishableItem class.
    constructor(name, quantity, price) {
        super(name, quantity, price);
    }
}

module.exports = {
    Item,
    PerishableItem,
    NonPerishableItem
};