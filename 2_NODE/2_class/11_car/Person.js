class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    say() {
        return 0;
    }

    getInCar(car) {
        console.log(`${this.name}이/가 ${car.brand}${car.model}에 탑승했습니다. `);
    }
}

module.exports = Person;