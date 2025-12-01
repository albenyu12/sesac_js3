const Shape = require("./Shape");
const Square = require("./Square");
const Triangle = require("./Triangle");
const Trapezium = require("./Trapezium");
const Circle = require("./Circle");

const square = new Square(5);
const triangle = new Triangle(4, 3);
const trapezium = new Trapezium(4, 6, 5);
const circle = new Circle(3);

console.log(`사각형의 넓이: ${square.getArea()}`);
console.log(`삼각형의 넓이: ${triangle.getArea()}`);
console.log(`사다리꼴의 넓이: ${trapezium.getArea()}`);
console.log(`원의의 넓이: ${circle.getArea().toFixed(2)}`);