
var mongoose = require('mongoose');
const CustomersSchema = require('./customers');
const OrdersSchema = require('./orders');
/**
 * This module handles the connection to database
 */
class DataBase {
    /**
    * @param {string} connectionStr the connection string to mongoDB 
    */
    constructor(connectionStr){
        this.connectionStr = connectionStr;

    }

    /**
    * @param {function} callBack the callback function that will be called after connection setup or meet error
    */
    setUpConnection(callBack){
        mongoose.connect(this.connectionStr, {useNewUrlParser: true}).then(
            () => { 
                callBack(true);
            },
            err => { 
                //If the connection failed
                callBack(false,err);
             }
          );
        this.db=mongoose.connection;
        this.Customer = this.db.model('Customers',CustomersSchema);
        this.Order = this.db.model('Orders',OrdersSchema);
    }

    /**
     * @param {string} id the customerId need to check
    * @param {function} next the callback function that will be called to handle check result
    */
    checkCustomerId(id,next){
        this.Customer.findOne({customerId:id}).select("customerId").lean().then(next)
    }

    /**
     * @param {Order} theOrder the new order object that will be inserted to databse
    * @param {function} callBack the callback function that will be called to handle insert result
    */
    createOrder(theOrder,callBack){
        var newOrder = new this.Order(theOrder)
        newOrder.save((err)=>{
            callBack(err)
        })
    }

    /**
     * @param {string} id the customer id
     * @param {Array<Object>} data array of order object that need to insert to database 
    * @param {function} callBack the callback function that will be called to handle insert reply from server
    * @param {function} curIdErr callback function to handle customer id don't exist error
    * @param {function} finalCall the function that might be used for handle program exit
    */
    collectionInsert(id,data,callback,curIdErr,finalCall=null){
        this.checkCustomerId(id,(result)=>{
            if(result){
                this.Order.insertMany(data,(err,docs)=>{
                    callback(err,id,finalCall)
                })
            }
            else{
                curIdErr(id,finalCall)
            }
        })
    }

};

module.exports.DataBase=DataBase;

