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
    makeDogSound() {
        return "멍멍"
    }
}

class Cat extends Animal {
    makeCatSound() {
        return "야옹"
    }
}


const myDog = new Animal("Doggy");
console.log(myDog.name);
console.log(myDog.makeSound());
console.log(Dog.makeDogSound());

const myCat = new Cat("kitty");
console.log(myCat.name);
console.log(myCat.makeSound());
console.log(myCat.makeCatSound());

const myCow = new Animal("한우");

