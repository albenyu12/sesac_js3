class Shape { // shape이라는 generic 클래스를 정의해서 넓이를 구하게 한다
    getArea() {
        return 0;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super(); // 나의 부모의 메모리 공간도 초기화한다
        this.base = base;
        this.height = height;
    }

    getArea() {
        return this.base * this.length / 2;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super(); // this는 나, super은 부모
        this.length = sideLength;
    }

    getArea() {
        return this.length * this.length;
    }
}

const mySquare = new Square(8);
console.log("정사각형의 넓이: " + mySquare.getArea());

const myTriangle = new Triangle(4, 6);
console.log("삼각형의 넓이: " + myTriangle.getArea());