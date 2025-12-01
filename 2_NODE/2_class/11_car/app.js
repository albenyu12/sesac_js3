const SUV = require("./SUV");
const Parent = require("./Parent");
const Child = require("./Child");

const dad = new Parent("빌게이츠", 40, "남성", "회사원");
const son = new Child("빌주니어", 20, "남성", "4.5");

dad.say();
son.say();

const dadCar = new SUV("테슬라", "Model X", true);

dad.getInCar(dadCar);
son.getInCar(dadCar);

dadCar.start();
dadCar.autoPilot("미술관");
son.playInCar();
dadCar.stop();