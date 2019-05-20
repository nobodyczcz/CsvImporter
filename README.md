# CsvImporter
This is a program for medipass backend challenge.

Then the program process the csv stream and write data to mongodb with mongoose.

Author: Zhe Chen

Email: zhechen0213@gmail.com

## Development

1. The program first check does given url or mongodb connection esist. If exist move to next step.
2. Then the program use request to open the url as stream.
3. Processing the stream with Fast-csv package.
4. In order to save internet/database resource, the program will try to group orders with same ID together. Then only one time customerId check for all the collections of data. If check successful, insert all the data with mongoose collection.insert()
5. Report insertion results.

## Usage
1. Clone the repository.
2. Go to the program folder.
3. Use `npm install` to install dependencies.
4. Use `node app.js -u https://url/to/file.csv -m mongoDb_Connection_String` to run the app.

## Test
Use `npm test` to run unit test by MOCHA and chai.

### Test Design

**Exception handle** The first part of the unit test, tests the program's ability to handle wrong url or wrong database connections.

**Data Exception hanle** The second part of unit test, tests the program's ability to handle data exceptions.

**Performce Test** The third part measure the performance of the program.

## Arguments

**-h**  The help

**-u/--url**  the url or path to csv file

**-m/--mongo-connection** the connection string to mongoDb
