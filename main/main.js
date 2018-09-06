const database= require('./datbase');

module.exports = function printInventory(inputs) {
    print(inputs);
};

const printTitle = () => {
    // console.log("***<没钱赚商店>购物清单***");
    return "***<没钱赚商店>购物清单***\n";
};

const printLine = () => {
    // console.log("----------------------");
    return "----------------------\n";
};

const printStar = () => {
    // console.log("**********************");
    return "**********************";
};

const printDiscountMsg = () => {
    // console.log("挥泪赠送商品：");
    return "挥泪赠送商品：\n";
};



const processInput = input => {
    let res = {};
    input.map(str => {
        if (str.indexOf('-') !== -1){
            let temp = str.split('-');
            res[temp[0]] = temp[1];
        } else {
            res[str] === undefined ? res[str] = 1 : res[str]++ ;
        }
    });
    return res;
};

const getList = inputObj => {
    let res = {};
    res["list"] = [];
    res["discountList"] =[];
    res["amount"] = [];
    let amount = 0;
    let saveAmount = 0;
    Object.keys(inputObj).map(key =>{
        database.loadAllItems().forEach(it => {
            if (key === it.barcode) {
                let temp = {};
                temp["名称"] = it.name;
                temp["数量"] = inputObj[key]+it.unit;
                temp["单价"] = it.price.toFixed(2)+"(元)";
                if (isItemDiscount(key) && inputObj[key] > 2) {
                    temp["小计"] = (it.price * (parseInt(inputObj[key])-1)).toFixed(2) +"(元)";
                    amount += (it.price * (parseInt(inputObj[key])-1));
                    res['discountList'].push({"名称": it.name, "数量": 1+it.unit });
                    saveAmount += it.price;
                }else{
                    temp["小计"] = (it.price * parseInt(inputObj[key])).toFixed(2) +"(元)";
                    amount += (it.price * parseInt(inputObj[key]));
                }

                res['list'].push(temp);

            }
        });
    });
    res["amount"].push({"总计": amount.toFixed(2)+"(元)"});
    res["amount"].push({"节省": saveAmount.toFixed(2)+"(元)"});
    return res;
};

const printList = array => {
    let str = "";
    array.map(item => {
        for (let key in item){
            str += key + "："+item[key] + "，";
        }
        str = str.substring(0,str.length-1)+"\n";
    });
    return str;
};

const isItemDiscount = item => {
    return database.loadPromotions()[0]["barcodes"].filter(it => it === item).length > 0;
};

const print = input => {
    console.log(
        printTitle() +
        printList(getList(processInput(input))['list']) +
        printLine() +
        printDiscountMsg() +
        printList(getList(processInput(input))['discountList']) +
        printLine() +
        printList(getList(processInput(input))["amount"])+
        printStar()
    );
};

inputs = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];

print(inputs);

