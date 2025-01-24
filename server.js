/*
 * This file serves as the server.
 * It is the middleman between the database and the front-end.
 * The functions are called from the App.js file and call functions from the dbOperation.js file.
 * The only value stored here is the ID of the current word, as it is easier to pass to the 
 * dbOperation.js file directly rather than going from App.js -> server.js -> dbOperation.js
*/

const express       = require('express'),
    dbOperation     = require('./dbFiles/dbOperation'),
    cors            = require('cors');

const API_PORT = process.env.PORT || 5000;
const app = express();

let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


// keep track of the ID of which ParsedWord is current
let randomWordID = 1;

// function that takes the values from the database of the next word and can pass the object to the front-end
app.post('/retrieveNextWordContents', async(req, res) => {
    randomWordID = getRandomInt(1,160);         // go to next random word
    console.log(`Checking '${randomWordID}`);
    const result = await dbOperation.getCorrespondingData(randomWordID);
    console.log(result.recordset);
    res.send(result.recordset);
})


// function that returns the lexical form associated with a specific LexicalFormID since the front-end
// doesn't have the lexical form on hand, just the ID
app.post('/getLexical', async(req, res) => {
    console.log('Called');
    const result = await dbOperation.getLexicalForm(randomWordID);
    res.send(result.recordset);
})

// calculates a random ID for the next parsedword
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// allow connections as a server
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));