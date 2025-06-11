# Inventory Management Console

A Node.js-based command-line application for managing inventory with object-oriented principles.

## Features

- Entity-based inventory management system
- Inheritance-based class structure
- File-based data persistence
- Interactive command-line interface
- Comprehensive error handling and validation
- Transaction logging
- Automated testing

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository:
```bash
    git clone https://github.com/jayzsec/inventory-console.git
    cd inventory-console
```

2. Install dependencies:
```bash
    npm install
```

## Usage

To start the application:
```bash
    node index.js
```

To run tests:
```bash
    node test
```

## Project Structure

```
├── index.js              # Application entry point
├── inventory.js          # Core inventory management logic
├── item.js               # Item class definition
├── inventory.json        # Data storage file
├── inventory.test.js     # Test suite
├── package.json          # Project configuration
└── README.md             # Project documentation
```

### Core Components

- **Main Application**
  - `index.js` - Entry point and CLI interface
  - `inventory.js` - Inventory management implementation
  - `item.js` - Item class and related business logic

- **Data Storage**
  - `inventory.json` - Persistent storage for inventory data

- **Testing**
  - `inventory.test.js` - Unit tests for core functionality

## Features

1. **Inventory Management**
   - Add, update, and remove items
   - View inventory status
   - Search and filter functionality
   - Data persistence

2. **Object-Oriented Design**
   - Class-based architecture
   - Inheritance implementation
   - Encapsulation of business logic
   - Polymorphic behaviors

3. **User Interface**
   - Interactive command-line interface
   - Color-coded output for better readability
   - User-friendly prompts and menus
   - Error feedback and validation

4. **Data Management**
   - JSON-based data persistence
   - Transaction logging
   - Data validation
   - Error handling

5. **Testing**
   - Unit test coverage
   - Error case testing
   - Integration tests

## Dependencies

- `kleur` (^4.1.5) - Terminal styling and colors
- `prompts` (^2.4.2) - Interactive CLI interface
- `jest` (^29.7.0) - Testing framework

## License

MIT

## Author

JC II