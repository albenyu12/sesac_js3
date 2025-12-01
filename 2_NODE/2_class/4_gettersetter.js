class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    get diameter() { // getter 함수
        return this.radius * 2;
    }

    set diameter(diameter) {
        this.radius = diameter / 2;
    }
}

const myCircle = new Circle(5);
console.log("1. 반지름: " + myCircle.radius);
// console.log(myCircle.diameter());
console.log("1. 지름: " + myCircle.diameter);

myCircle.diameter = 20;
console.log("2. 반지름: " + myCircle.radius);