# CsvImporter
This is a program for medipass backend challenge.
This program read csv file with fs.createReadStream() from a url or path.
Then the program write the records in csv file to mongodb with mongoose.


# Usage
1. Clone the program.
2. Use `npm install` to install dependencies.
3. Go to the program folder.
4. Use `node app.js -u url/to/file.csv -m mongoDb_Connection_String` to run the app.


# Test
Use `npm test` to run unit test by MOCHA and chai.

# Arguments

**-h**  The help

**-u/--url**  the url or path to csv file

**-m/--mongo-connection** the connection string to mongoDb
