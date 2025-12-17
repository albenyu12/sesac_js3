const { join } = require("path");
const { v4: uuidv4 } = require("uuid");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const lastNames = [
    '김', '이', '박', '최', '정',
    '강', '조', '윤', '장', '임',
    '한', '오', '서', '신', '권',
    '황', '안', '송', '전', '홍'
  ];

const firstNames = [
    '민준', '서준', '도윤', '예준', '시우',
    '하준', '주원', '지후', '준우', '현우',
    '지훈', '건우', '우진', '선우', '서진',
    '민서', '서연', '지우', '하윤', '서현',
    '수빈', '지민', '예은', '지윤', '채원',
    '은서', '유진', '윤서', '다은', '소율',
    '예린', '나연', '서영', '혜원', '수아',
    '아린', '가은', '유나', '시은', '채은',
    '태윤', '승민', '동현', '정우', '성민',
    '현서', '민지', '하늘', '지안', '은우'
  ];

function generateUUID() {
    const myId = uuidv4();
    
    return myId;
}

function generateName() {
    const firstNamesIndex = Math.floor(Math.random() * firstNames.length);
    const lastNamesIndex = Math.floor(Math.random() * lastNames.length);
    const fullName = lastNames[lastNamesIndex] + firstNames[firstNamesIndex];

    return fullName;
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
    path: 'userData.csv',
    header: [
        {id: 'id', title: '아이디'},
        {id: 'name', title: '이름'},
        {id: 'gender', title: '성별'},
        {id: 'age', title: '나이'},
        {id: 'bod', title: '생년월일'},
    ]
});

const lineCount = 10;

const records = Array.from({ length: lineCount }, () => (
    { id: generateUUID(), name: generateName(), age: generateAge(), gender: generateGender(), bod: generateBirthday() }
));

function generateCSV(list) {
    csvWriter.writeRecords(list);
}

generateCSV(records);