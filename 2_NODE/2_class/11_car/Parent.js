const Person = require("./Person");

class Parent extends Person {
    constructor(name, age, gender, job) {
        super(name, age, gender);
        this.job = job;
    }

    say() {
        console.log(`부모님의 성함은 ${this.name}이고 ${this.age}세 ${this.job}입니다. `);
    }
}

module.exports = Parent;