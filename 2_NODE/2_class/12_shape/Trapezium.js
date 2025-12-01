const Shape = require("./Shape");

class Trapezium extends Shape {
    constructor(base, height, length) {
        super("Trapezium")
        this.base = base;
        this.height = height;
        this.length = length;
    }

    getArea() {
        return (this.base + this.height) * this.length * 0.5;
    }
}

module.exports = Trapezium;