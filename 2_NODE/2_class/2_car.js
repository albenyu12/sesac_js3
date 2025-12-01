class Car {
    constructor(make, model) { // 객체가 만들어질 때 불리는 기본 함수
        this.brand = make;
        this.model = model;
    }

    brand = "현대";
    model = "K5";
}

const myCar = new Car();
console.log(myCar.brand);
console.log(myCar.model);

const yourCar = new Car();
console.log(myCar.brand);
console.log(myCar.model);