class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    greet() {
        console.log(`안녕하세요, 저는 ${this.age}살, ${this.name}입니다. `);
    }

    walk() {
        console.log(`${this.name}은/는 걷고 있습니다. `);
    }

    eat() {
        console.log(`${this.name}은/는 ${this.place}에서 밥을 먹고 있습니다. `);
    }

    goto(place) {
        this.place = place;
    }
}

const person1 = new Person("철수", 25, "남성");
person1.greet();
// person1.place = "공원"; 할 수 있지만, 하지 마라
person1.goto("공원");
person1.walk();

const person2 = new Person("영희", 23, "여성");
person2.greet();
person2.walk();
person2.goto("편의점");
person2.eat();