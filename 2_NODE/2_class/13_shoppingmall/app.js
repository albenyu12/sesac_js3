const User = require("./shop/User");
const { Electronics, Clothing } = require("./shop/Product");
const Order = require("./shop/Order");

const user1 = new User("홍길동", "honggildong@gmail.com", "서울시 강남구");

const laptop = new Electronics("갤럭시북", 1_000_000, 5, "2년보증");
const mouse = new Electronics("마우스", 10_000, 100, "1년보증");
const tShirtM = new Clothing("플레인티셔츠", 50_000, 25, "M");
const tShirtY = new Clothing("플레인티셔츠", 50_000, 10, "L");

const order1 = new Order(user1);
order1.addProduct(laptop, 1);
order1.addProduct(mouse, 2);
order1.addProduct(tShirtM, 5);

user1.addOrder(order1);

console.log("주문 내역: ", order1.getOrderSummary());
console.log("사용자의 구매 이력: ", user1.getOrderHistory());