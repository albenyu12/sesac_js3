const { v4: uuidv4 } = require("uuid");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const names = ["홍길동", "김길동", "박길동", "이길동"];

function generateUUID() {
    const myId = uuidv4();
    
    return myId;
}

function generateName() {
    const index = Math.floor(Math.random() * names.length);
    
    return names[index];
}

function generateGender() {
    const prob = Math.random();
    if (prob < 0.5) {
        return "남성";
    } else {
        return "여성";
    }
}

function generateBirthYear() {
    const year = Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950;

    return year;
}

function generateBirthday() {
    const year = generateBirthYear();
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 30) + 1;

    return `${year}-${month}-${day}`
}

function generateAge() {
    const year = generateBirthYear();
    const age = 2025 - year +1;
    return age;
}

const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        {id: 'id', title: '아이디'},
        {id: 'name', title: '이름'},
        {id: 'gender', title: '성별'},
        {id: 'bod', title: '생년월일'},
        {id: 'age', title: '나이'},
    ]
});

const records = [
    { id: generateUUID(), name: generateName(), age: generateAge(), gender: generateGender(), bod: generateBirthday() },
];

function generateCSV(list) {
    csvWriter.writeRecords(list);
}

generateCSV(records);