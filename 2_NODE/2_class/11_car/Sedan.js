const Car = require("./Car");

class Sedan extends Car {

    say() {
        console.log(`${this.brand} ${this.model}의 세단입니다. `);
    }
}