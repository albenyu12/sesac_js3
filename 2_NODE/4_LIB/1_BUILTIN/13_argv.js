// const args = process.argv;
const args = process.argv.slice(2);

console.log(args);
console.log("사용자수: ", args[0]); 
console.log("상점수: ", args[1]); 
console.log("주문수: ", args[2]); 

console.log("사용자를 몇명 생성할까요?");