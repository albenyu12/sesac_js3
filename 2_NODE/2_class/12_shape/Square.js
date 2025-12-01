const Shape = require("./Shape");

class Square extends Shape {
    constructor(length) {
        super(length);
    }

    getArea() {
        return this.length ** 2
    }
}

module.exports = Square;