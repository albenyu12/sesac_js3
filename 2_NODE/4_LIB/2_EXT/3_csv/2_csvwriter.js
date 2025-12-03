const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const csvWriter = createCsvWriter({
    path: 'data2.csv',
    header: [
        {id: 'name', title: '이름'},
        {id: 'age', title: '나이'},
        {id: 'gender', title: '성별'},
        {id: 'bod', title: '생년월일'},
    ]
});
 
const records = [
    { name: "정하늘", age: 24, gender: "남성", bod: "2000-01-01" },
    { name: "윤다연", age: 22, gender: "여성", bod: "2001-05-14" },
    { name: "오도윤", age: 27, gender: "남성", bod: "1998-09-03" },
    { name: "배시온", age: 23, gender: "여성", bod: "2002-02-27" },
    { name: "고준우", age: 25, gender: "남성", bod: "2000-12-11" },
];
 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...저장완료');
    });