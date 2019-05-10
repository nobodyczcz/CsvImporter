
var mongoose = require('mongoose');

/**
 * This module handles the connection to database
 */
class DataBase {
    /**
    * @param {string} connectionStr the connection string to mongoDB 
    */
    constructor(connectionStr){
        this.connectionStr = connectionStr;
        this.db =mongoose.connect(connectionStr, {useNewUrlParser: true}).then(
            () => { 
                console.log('Successful connect to database')
                console.log('MongoDB initialized') },
            err => { 
                //If the connection failed, exit the program
                console.error(err)
                console.error('Cannot connect to mongoDB, please check your connection string. Exiting the program now.');
                process.exit(1);
             }
          );;
        this.connection=mongoose.connection;

    }

};

module.exports.DataBase=DataBase;

