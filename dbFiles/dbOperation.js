/* 
 * This file defines functions that can retrieve data from the SQL database. These
 * functions are called in the server.js back-end JavaScript file.
*/

const config                = require('./dbConfig'),
    sql                     = require('mssql');
    

// for testing: returns all words with IDs; unpresentable to the user (unimplemented and not useful to implement)
const getAllWords = async() => {
    try {
        let pool = await sql.connect(config);
        let words = pool.request().query("SELECT * from ParsedWords");
        console.log(words);
        return words;
    }
    catch(error){
        console.log(error);
    }
}


// gives a list of all words with associated names replacing IDs; presentable to the user (unimplemented)
const getAllWordsPretty = async(lexical) => {
    try {
        let pool = await sql.connect(config);
        let words = await pool.request().query(`select pw.ParsedWordID, pw.ParsedWord, p.Person, n.Number, t.Tense, v.Voice, m.Mood, c.WordCase, g.Gender, lf.LexicalForm, pw.InflectedMeaning from ParsedWords as pw left outer join Persons as p on p.PersonID = pw.PersonID left outer join Numbers as n on n.NumberID = pw.NumberID left outer join Tenses as t on t.TenseID = pw.TenseID left outer join Voices as v on v.VoiceID = pw.VoiceID left outer join Moods as m on m.MoodID = pw.MoodID left outer join Cases as c on c.CaseID = pw.CaseID left outer join Genders as g on g.GenderID = pw.GenderID left outer join LexicalForms as lf on lf.WordID = pw.WordID WHERE lf.WordID = '${lexical}'`);
        console.log(words);
        return words;
    }
    catch(error){
        console.log(error);
    }
}

// adds a new parse to the list (unimplemented)
const addNewParse = async(Parse) => {
    try {
        let pool = await sql.connect(config);
        let parse = pool.request().query(`INSERT INTO ParsedWords VALUES 
        (${Parse.ParsedWordID}, '${Parse.ParsedWord}', '${Parse.InflectedMeaning}', ${Parse.WordID}, ${Parse.PersonID}, ${Parse.NumberID}, ${Parse.TenseID}, ${Parse.VoiceID}, ${Parse.MoodID}, ${Parse.CaseID}, ${Parse.GenderID})`);
        return parse;
    }
    catch(error){
        console.log(error);
    }
}


// retrieves a lexical form given the ID. This is used when the user gets
// the parsing correct and the front-end has the LexicalFormID but is
// missing the corresponding lexical form, necessitating this function
const getLexicalForm = async(lexicalFormID) => {
    try {
        let pool = await sql.connect(config);
        let form = pool.request().query(`SELECT LexicalForm
        from LexicalForms as l
        inner join ParsedWords as p
        on l.WordID = p.WordID
        where p.ParsedWordID = '${lexicalFormID}'`);
        console.log(form);
        return form;
    }
    catch(error){
        console.log(error);
    }
}


// This retrieves all of the data corresponding to an entry in the ParsedWords table
// given the ParsedWordID. It is called when a new word is sent to the front end
// so it has the corresponding values to check for accuracy.
const getCorrespondingData = async(id) => {
    try {
        let pool = await sql.connect(config);
        let goals = pool.request().query(`SELECT * from ParsedWords WHERE ParsedWordID = ${id}`);
        console.log(goals);
        return goals;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    addNewParse,
    getAllWords,
    getAllWordsPretty,
    getCorrespondingData,
    getLexicalForm
}