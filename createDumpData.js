const DataBase = require('./model/db').DataBase;
var testDb = new DataBase('mongodb+srv://czcz213:no.04792@csvdb-wsoun.mongodb.net/test?retryWrites=true');
testDb.setUpConnection((success,error=null) => {
    
    console.log()
});

var createCustomer = (customer)=>{
    var newCustomer = new testDb.Customer(customer)
    newCustomer.save((err)=>{
            console.log(err)
        })

}

var customers=[
    {
        customerId: 1,
        firstName: 'a',
        lastName: 'b'
    },
    {
        customerId: 2,
        firstName: 'a',
        lastName: 'b'
    },
    {
        customerId: 3,
        firstName: 'a',
        lastName: 'b'
    },
    {
        customerId: 4,
        firstName: 'a',
        lastName: 'b'
    },
    
]

for (var key in customers){
    createCustomer(customers[key]);
}