class NameGenerator {
    constructor() {
        this.lastames = ["김",,  "이", "박"];
        this.firstname = ["서준", "민준", "지윤"];
    }

    pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }
    
    generateName() {
        const lastname = this.pickRandom(this.lastnames);
        const firstname = this.pickRandom(this.firstname);
        return lastname + firstname;
    }
}

const gen = new NameGenerator();

console.log(gen.generateName());