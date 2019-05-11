#!/usr/bin/env node
'use strict';

//import modules
const argParser = require('./supportive/argparser').argParser; //argument parser
const DataBase = require('./model/db').DataBase;
const CsvReader = require('./supportive/csvReader').CsvReader;


//Parse arugments. --url-csv and --mongo-connection are required
var args = argParser.parseArgs();
console.log(`Csv url: ${args.url_csv}`)
console.log(`MongoDB connection string: ${args.mongo_connection}`)

//Initialize the connection to mongodb. If the connection string is invalid, exit the program 
var db = new DataBase(args.mongo_connection);
db.setUpConnection((success,error=null) => {
    if(success){
        console.log('Successful connect to database');
        console.log('MongoDB initialized');
    }
    else {
        console.error(error);
        console.error('Cannot connect to mongoDB, please check your connection string. Exiting the program now.');
        process.exit(1);
    }
});

//Initialize the connection csv file. If the connection string is invalid, exit the program 
var reader = new CsvReader(args.url_csv);
reader.setUpReader((success,error=null)=>{
    if(success){
        console.log('Success open the file as stream')
    }
    else{
        console.error(error);
        console.error('Cannot open the file as stream, please check your file url. Exiting the program now.');
        process.exit(1);
    }
});


var printResult=(successCount,insertErrorCount,cusNotExistCount)=>{
    console.log(`${successCount} rows successful inserted to databse`);
    console.log(`${insertErrorCount} insert failed because insert error`)
    console.log(`${cusNotExistCount} insert failed because customerId do not exist`)
    process.exit(0)
}
//Start processing csv file
reader.processCsv(db,printResult);