var fs = require('fs');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

let writeStream = fs.createWriteStream("./test/10000row.csv")
writeStream.write('orderId,customerId,item,quantity', 'utf-8');


for(var i=1030;i<11030;i++){
    var custId = Math.round(getRandomArbitrary(1,8))
    writeStream.write(`${i},${custId},xxx,1\n`, 'utf-8');
}
writeStream.end();