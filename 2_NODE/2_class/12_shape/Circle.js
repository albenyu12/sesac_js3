const Shape = require("./Shape");

class Circle extends Shape {
    constructor(radius) {
        super("Circle")
        this.radius = radius;
    }

    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

module.exports = Circle;