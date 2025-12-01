const Shape = require("./Shape");

class Triangle extends Shape {
    constructor(base, height) {
        super("triangle")
        this.base = base;
        this.height = height;
    }

    getArea() {
        return this.base * this.height * 0.5;
    }
}

module.exports = Triangle;