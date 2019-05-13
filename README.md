# CsvImporter
This is a program for medipass backend challenge.

This program read csv file with request() from a url as stream. Read file as a stream can handle large files better, comparing with download or loading the whole file to local.

Then the program process the csv stream and write data to mongodb with mongoose.

Author: Zhe Chen

Email: zhechen0213@gmail.com

# Usage
1. Clone the repository.
2. Go to the program folder.
3. Use `npm install` to install dependencies.
4. Use `node app.js -u https://url/to/file.csv -m mongoDb_Connection_String` to run the app.

# Test
Use `npm test` to run unit test by MOCHA and chai.

# Arguments

**-h**  The help

**-u/--url**  the url or path to csv file

**-m/--mongo-connection** the connection string to mongoDb
