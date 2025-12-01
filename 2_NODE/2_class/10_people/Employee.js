const Person = require("./Person");

class Employee extends Person {
    constructor(name, company) {
        super(name);
        this.company = company;
    }

    greet() {
        console.group(`안녕, 나는 ${this.name}이고 ${this.company}에서 일하고 있어`);
    }
}

module.exports = Employee;