#!/usr/bin/env node
'use strict';


function printResult(successCount,insertErrorCount,cusNotExistCount){
    console.log(`${successCount} rows successful inserted to databse`);
    console.log(`${insertErrorCount} insert failed because insert error`)
    console.log(`${cusNotExistCount} insert failed because customerId do not exist`)
    process.exit(0)
}

//import modules
const argParser = require('./supportive/argparser').argParser; //argument parser
const DataBase = require('./model/db').DataBase;
const CsvReader = require('./supportive/csvReader').CsvReader;


//Parse arugments. --url-csv and --mongo-connection are required
var args = argParser.parseArgs();
console.log(`Csv url: ${args.url_csv}`)
console.log(`MongoDB connection string: ${args.mongo_connection}`)

//set the csv url
var reader = new CsvReader(args.url_csv);

//Initialize the connection to mongodb. If the connection string is invalid, exit the program 
var db = new DataBase(args.mongo_connection);
db.setUpConnection((success,error=null) => {
    if(success){
        console.log('Successful connect to database');
        console.log('MongoDB initialized');

        //Initialize the connection csv file. If the connection string is invalid, exit the program 
        reader.setUpReader(readerCallBack)
    }
    else {
        console.error(error);
        console.error('Cannot connect to mongoDB, please check your connection string. Exiting the program now.');
        process.exit(1);
    }
});


function readerCallBack (success,error=null){
    if(success){
        console.log('Success open the file as stream')
        //Start processing csv file
        reader.processCsv(db,printResult);
    }
    else{
        console.error(error);
        console.error('Cannot open the file as stream, please check your file url. Exiting the program now.');
        process.exit(1);
    }
}
