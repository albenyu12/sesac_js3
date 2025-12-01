const Person = require("./Person");

class Child extends Person {
    constructor(name, age, gender, grade) {
        super(name, age, gender);
        this.grade = grade;
    }

    say() {
        console.log(`아이이름은 ${this.name}, 학점은 ${this.grade}입니다. `);
    }

    playInCar() {
        console.log(`${this.name}이/가 차 안에서 놀고 있습니다. `);
    }
}

module.exports = Child;