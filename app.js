#!/usr/bin/env node
'use strict';

//import modules
const argParser = require('./supportive/argparser').argParser; //argument parser
const DataBase = require('./model/db').DataBase;

//Parse arugments. --url-csv and --mongo-connection are required
var args = argParser.parseArgs();
console.log(`Csv url: ${args.url_csv}`)
console.log(`MongoDB connection string: ${args.mongo_connection}`)

//Initialize the connection to mongodb and exit the program if the connection string is invalid
var db = new DataBase(args.mongo_connection);

//process.exit(0);