const { v4: uuidv4 } = require("uuid");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nameList = ["스타벅스","이디야커피","투썸플레이스","할리스","메가커피","컴포즈커피","빽다방","파리바게뜨","뚜레쥬르","배스킨라빈스","던킨","맘스터치","롯데리아","버거킹","맥도날드","도미노피자","피자헛","피자알볼로","교촌치킨","BHC","BBQ","굽네치킨","노랑통닭","서브웨이","청년다방","역전우동","이차돌","놀부보쌈","홍콩반점0410","본죽"];
const cityList = ["서울","부산","대구","인천","광주","대전","울산","세종","수원","창원","고양","용인","성남","청주","전주","천안","포항","김해","제주","춘천","안양","부천","경주","진주"];

function generateUUID() {
    const myId = uuidv4();
    
    return myId;
}

function generateName() {
    const index = Math.floor(Math.random() * nameList.length);
    
    return nameList[index];
}

function generateAddress() {
    const cityIndex = Math.floor(Math.random() * cityList.length);
    
    return cityList[cityIndex];
}

const csvWriter = createCsvWriter({
    path: 'storeData.csv',
    header: [
        {id: 'id', title: '아이디'},
        {id: 'name', title: '이름'},
        {id: 'address', title: '주소'}
    ]
});

const records = [
    { id: generateUUID(), name: generateName(), address: generateAddress() }
];

function generateCSV(list) {
    csvWriter.writeRecords(list);
}

generateCSV(records);