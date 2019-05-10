/*
This module defines the argument parser for the app.
*/

//import packages
var ArgumentParser = require('argparse').ArgumentParser;

//initialize argument parser
var argParser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'This program import csv file from a url and write data to mangoDB. You must provide the url of csv file and the connection string of mangoDB'
});

argParser.addArgument(['-u','--url-csv'],{
    help:'the url of csv file',
    required: true
});

argParser.addArgument(['-m','--mongo-connection'],{
    help:'the connection string of mongoDB',
    required:true
});

exports.argParser = argParser;

