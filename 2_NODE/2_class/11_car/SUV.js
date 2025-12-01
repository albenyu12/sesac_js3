const Car = require("./Car");

class SUV extends Car {
    constructor(brand, model, autopilot) {
        super(brand, model);
        this.autopilot = autopilot;
    }

    autoPilot(where) {
        console.log(`${this.brand}${this.model}가 ${where}으로 자율주행중입니다.  `)
    }
}

module.exports = SUV;