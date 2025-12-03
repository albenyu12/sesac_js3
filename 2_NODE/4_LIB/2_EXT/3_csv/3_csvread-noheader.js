const csv = require("csv-parser");

const fs = require('fs');
const results = [];

fs.createReadStream('data-with-header.csv')
  .pipe(csv({
    header: ["이름", "나이", "성별", "생년월일"]
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });