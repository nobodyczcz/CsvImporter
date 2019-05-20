var expect = require('chai').expect;
const DataBase = require('../model/db').DataBase;
const CsvReader = require('../supportive/csvReader').CsvReader;

const validString = 'mongodb+srv://czcz213:no.04792@csvdb-wsoun.mongodb.net/test?retryWrites=true'
//clear orders

if (!validString){
    throw "Please provide a valid connection string to perform test"
}

async function clearOrders(testDb){
 await testDb.Order.deleteMany({});
}

//test db connection
describe('#DataBase.setUpConnection()', function() {

    context('with valid connection string', function() {
        it('should return true', function(done) {
        
            var db = new DataBase(validString);
            db.setUpConnection((success,error=null) => {
                expect(success).to.be.true;
                done(error)
            });
          
        })
    })

    context('with invalid connection string', function() {
        it('shoud return false', function(done) {
        
            var db = new DataBase('this.is.a.fake.address');
            db.setUpConnection((success,error=null) => {
                expect(success).to.be.false;
                done()
            });
          
        })
      })


});

var testDb = new DataBase(validString);
testDb.setUpConnection((success,error=null) => {
    if(error){
        process.exit(1);
        
    }
    clearOrders(testDb);

});

//test checkCustomerId() function
describe('#DataBase.checkCustomerId()', function() {

    context('with exist customerId', function() {
        it('should return non empty data', function(done) {
            testDb.checkCustomerId('1',result=>{
                expect(!result).to.be.false;
                done()
            })
           
          
        })
    })

    context('with un-exist customerId', function() {
        it('should return empty data', function(done) {
            testDb.checkCustomerId('5555555',result=>{
                expect(result).to.be.null;
                done()
            })
        })
    })
});




// test createOrder()
describe('#DataBase.createOrder()', function() {

    context('insert valid data to createOrder', function() {
        it('should success insert data', function(done) {
            var newOrder = {
                orderId: '1',
                customerId:'1',
                item: '',
                quantity:1,
            }
            testDb.createOrder(newOrder,error=>{
                if(error){
                    done(error)
                }
                else{
                    expect(!error).to.be.true;
                    done()
                }

            })
           
          
        })
    })

    context('insert data with duplicated orderId to createOrder', function() {
        it('should return error', function(done) {
            var newOrder = {
                orderId: '1',
                customerId:'1',
                item: '',
                quantity:1,
            }
            testDb.createOrder(newOrder,error=>{
                expect(!error).to.be.false;
                done()
            })
        })
    })

    context('insert data with invalid type to createOrder', function() {
        it('should return error', function(done) {
            var newOrder = {
                orderId: '2',
                customerId:'1',
                item: '',
                quantity:'xxxxx',
            }
            testDb.createOrder(newOrder,error=>{
                expect(!error).to.be.false;
                done()

            })
        })
    })

    context('insert number to string data type createOrder', function() {
        it('should success insert data', function(done) {
            var newOrder = {
                orderId: 3,
                customerId:1,
                item: '',
                quantity:1,
            }
            testDb.createOrder(newOrder,error=>{
                    expect(!error).to.be.true;
                    done()

            })
           
          
        })
    })
});

//Test set up connection to a files
describe('#CsvReader.setUpReader()', function() {

    context('with valid url', function() {
        it('should return true', function(done) {
        
            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/orders.csv');
            reader.setUpReader((success,error=null)=>{
                    expect(success).to.be.true;
                    done()
            });
          
        })
    })

    context('With url but file do not exist', function() {
        it('should return false', function(done) {
        
            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/xxxxx.csv');
            reader.setUpReader((success,error=null)=>{
                expect(success).to.be.false;
                done();
            });
          
        })
    })

    context('with invalid url', function() {
        it('should return false', function(done) {
        
            var reader = new CsvReader('thisisinvalid');
            reader.setUpReader((success,error=null)=>{
                expect(success).to.be.false;
                clearOrders(testDb);
                done();
            });
          
        })
    })


});


//test processCsv() function
describe('#CsvReader.processCsv()', function() {
    this.timeout(10000);
    context('with empty file', function() {
        it('result count should all be 0', function(done) {


            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/emptyfile.csv');
            reader.setUpReader((success,error=null)=>{
                reader.processCsv(testDb,()=>{
                    testDb.Order.count({},(err,result)=>{
                        expect(result).to.be.equal(0)
                        done();
                    })
                    
            });
               
            })
            
          
        })
    })

    context('with file but not csv', function() {
        it('result count should be 0,0,1', function(done) {


            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/notCsv.csv');
            reader.setUpReader((success,error=null)=>{
                reader.processCsv(testDb,()=>{
                    testDb.Order.count({},(err,result)=>{
                        expect(result).to.be.equal(0)
                        done();
                    })
                    
                });
               
            })
            
          
        })
    })
    
    context('with valid data', function() {
        it('result count should be 3,0,0', async function(done) {
            const count = await testDb.Order.count()
            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/valid.csv');
            reader.setUpReader((success,error=null)=>{
                reader.processCsv(testDb,()=>{
                    testDb.Order.count({},(err,result)=>{
                        expect(result).to.be.equal(3)
                        done();
                    })
                    
                });
                
            })

           
          
        })
    })

    context('with data contain invalid customer id', function() {
        it('result count should be 2,0,1', function(done) {

            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/inValidCusId.csv');
            reader.setUpReader((success,error=null)=>{
                reader.processCsv(testDb,()=>{
                    testDb.Order.count({},(err,result)=>{
                        expect(result).to.be.equal(5)
                        done();
                    })
                    
                });
            
            })
            
          
        })
    })

    context('with data contain duplicated order id', function() {
        it('result count should be 2,1,0', function(done) {
 
            var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/duplicateOrderId.csv');
            reader.setUpReader((success,error=null)=>{
                reader.processCsv(testDb,()=>{
                    testDb.Order.count({},(err,result)=>{
                        expect(result).to.be.equal(7)
                        done();
                    })
                    
                });
            
            })
            
          
        })
    })

    context('with data do not have orderId', function() {
        it('result count should be 0,3,0', function(done) {
                var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/noOrderId.csv');
                reader.setUpReader((success,error=null)=>{
                    reader.processCsv(testDb,()=>{
                        testDb.Order.count({},(err,result)=>{
                            expect(result).to.be.equal(7)
                            done();
                        })
                        
                    });
               
            })
           
          
        })
    })

    context('with data do not have customerId', function() {
        it('result count should be 0,0,3', function(done) {
                var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/noCustomerId.csv');
                reader.setUpReader((success,error=null)=>{
                    reader.processCsv(testDb,()=>{
                        testDb.Order.count({},(err,result)=>{
                            expect(result).to.be.equal(7)
                            done();
                        })
                });
            })
            
          
        })
    })

    context('Insert 1000 row to database', function() {
        it('should take a few time', function(done) {
                var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/1000row.csv');
                reader.setUpReader((success,error=null)=>{
                    reader.processCsv(testDb,()=>{
                            done();
                        })
            })
            
          
        })
    })

    context('Insert 10000 row to database', function() {
        it('Should take some time', function(done) {
                var reader = new CsvReader('https://raw.githubusercontent.com/nobodyczcz/CsvImporter/master/test/10000row.csv');
                reader.setUpReader((success,error=null)=>{
                    reader.processCsv(testDb,()=>{
                        clearOrders(testDb);
                            done();
                });
            })
            
          
        })
    })

    



});



