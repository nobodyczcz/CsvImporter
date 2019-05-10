#!/usr/bin/env node
'use strict';

//import packages
var ArgumentParser = require('argparse').ArgumentParser;

//initialize argument parser
var argParser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'This program import csv file from a url and write data to mangoDB'
});

argParser.addArgument(['-u','--url'],{
    help:'the url of csv file',
    required: true
});

argParser.addArgument(['-m','--mongo-Connection'],{
    help:'the connection string of mongoDB',
    required:true
});
var args = argParser.parseArgs();

