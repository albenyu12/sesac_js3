const Employee = require("./Employee");
const Student = require("./Student");

const myEmployee1 = new Employee("박진영", "JYP 엔터");
const myEmployee2 = new Employee("아이유", "이담 엔터");

myEmployee1.greet();
myEmployee2.greet();

const myStudent1 = new Student("학생1", "컴학");
const myStudent2 = new Student("학생2", "소프트");
const myStudent3 = new Student("학생3", "글미");

myStudent1.greet();
myStudent2.greet();
myStudent3.greet();