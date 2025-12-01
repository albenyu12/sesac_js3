class Animal {
    constructor(name) {
        this.name = name;
    }

    makeSound() {
        return "아무말이나..."
    }
}

// 아래 dog 함수는 위의 Animal 의 기능을 받아옴... 그래서 +@ 더 가져갈 수 있음
class Dog extends Animal {
    makeSound() { // 원래 상속 받은 부모의 기능을 대체... overriding
        return "멍멍"
    }
}

class Cat extends Animal {
    makeCatSound() {
        return "야옹"
    }
}

class Cow extends Animal {
    makeCowSound() {
        return "음메"
    }
}

const myDog = new Animal("Doggy");
console.log(myDog.name);
console.log(myDog.makeSound());

const myCat = new Animal("kitty");
console.log(myCat.name);
console.log(myCat.makeSound());

const myCow = new Animal("한우");
console.log(myCow.name);
console.log(myCow.makeSound());


