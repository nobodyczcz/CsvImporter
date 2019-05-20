const DataBase = require('./model/db').DataBase;

function clearOrders(testDb){
    testDb.Order.deleteMany({},()=>{
        process.exit(1)
    });
   }

   var validString = 'mongodb+srv://czcz213:no.04792@csvdb-wsoun.mongodb.net/test?retryWrites=true'
   var testDb = new DataBase(validString);
testDb.setUpConnection((success,error=null) => {
    if(error){
        process.exit(1);
        
    }
    clearOrders(testDb);

});