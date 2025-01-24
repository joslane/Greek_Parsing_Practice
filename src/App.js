/*
 * This file encompasses the front end of this project.
 * It is rather bulky as it contains the js functions that fetch data from the 
 * back-end as well as the HTML that creates the page itself.
 * 
 * There are quite a few fun little tricks I learned while creating this!
*/

import './App.css';
import React, {useState} from 'react'


// globals to keep track of accuracy & program flow
let correct = 0;
let incorrect = 0;
let allowGuess = 1;   // changes to 0 when a correct parse is provided & back to 1 when a new word is generated
let goalParse = {ParsedWordID: 1, ParsedWord: 'λύω', InflectedMeaning: 'I am loosing', WordID: 53, PersonID: 1, NumberID: 1, TenseID: 1, VoiceID: 1, MoodID: 1, CaseID: 0, GenderID: 0}


// the app!
function App() {
  // store the data in the front end in a usable object format
  const [returnedData, setReturnedData] = useState([]);
  const [parse, setParse] = useState({ParsedWordID: 0, ParsedWord: '', InflectedMeaning: '', WordID: 0, PersonID: 0, NumberID: 0, TenseID: 0, VoiceID: 0, MoodID: 0, CaseID: 0, GenderID: 0})


  // a function that updates the vaues in the parse object when the user changes the value of a front-end element
  const setInput = (e) => {
    const {name, value} = e.target;
    console.log(value);
    if (name === 'LexicalFormID' || name === 'WordID' || name === 'PersonID' || name === 'NumberID' || name === 'TenseID' || name === 'VoiceID' || name === 'MoodID' || name === 'CaseID' || name === 'GenderID'){
      setParse(prevState => ({
        ...prevState,
        [name]: parseInt(value)
      }));
      return;
    }
    setParse(prevState => ({
      ...prevState,
      [name]: value
    }));
  }


  // chooses a new word for the user to parse
  const newWord = () => {
    // clear the old correct information (lexical form & inflected meaning) to reduce confusion
    let e = document.getElementById("correctInfo");
    e.textContent = "";

    // allows the user to guess again
    allowGuess = 1;
    fetch('/retrieveNextWordContents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        goalParse = data[0];
        for (const key in goalParse) {
          if (goalParse.hasOwnProperty(key)) {
            if (goalParse[key] === null) {
              goalParse[key] = 0;
            }
          }
        }
        console.log(goalParse);
        //console.log(parse);

        const wordHereElement = document.getElementById('wordHere');
      if (wordHereElement) {
        wordHereElement.textContent = `Your word: ${goalParse.ParsedWord}`;
      } else {
        console.error('Element with id "wordHere" not found');
      }
      clearFields();
      })
      .catch(error => console.error('Error:', error));
  };


  // displays the lexical form and inflected meaning of the given word to the user when called
  const displayLexicalAndParse = () => {
    fetch('/getLexical', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      let lexical = data[0]["LexicalForm"];
      console.log(lexical);
      let element = document.getElementById("correctInfo");
      element.textContent = `Lexical Form: ${lexical} Inflected Meaning: ${goalParse.InflectedMeaning}`;
    })
    .catch(error => console.error('Error:', error));
  };


  // This function compares the values in the front-end to the correct values for the provided word
  // It then updates the correct/incorrect tags appropriately to help the user and updates the score counters
  const checkParse = () => {
    // prevent the user from continually submitting the same correct parse repeatedly
    if (allowGuess === 0){
      return;           // I hope Dr. Poole doesn't see this. It's not single-exit!
    }

    let numWrong = 0;   // variable to see if the user has any errors
    console.log(parse);
    console.log(goalParse);
    
    // for loop that compares each value to the goalValue
    Object.keys(parse).forEach(key => {
      const parseValue = parse[key];
      const goalParseValue = goalParse[key];
      const result = parseValue === goalParseValue ? 'Correct' : 'Incorrect'; // fancy ternary
      
      // Update <p> tag with the id matching the key
      const pElement = document.getElementById(key);
      if (pElement) {
        pElement.textContent = `${result}`;
        if (result !== 'Correct'){
          numWrong += 1;                  // note that something is wrong
          pElement.style.color = "red";   // make it pretty
        }
        else{
          pElement.style.color = "green"; // make it pretty
        }
      }
    });
    // if the parse is fully correct, give a point and display the lexical form & meaning
    if(numWrong === 0){
      correct += 1;
      allowGuess = 0;
      displayLexicalAndParse();
    }
    else{
      incorrect += 1;
    }
    
    // update right & wrong counters
    const stat = document.getElementById("stats");
    stat.textContent = `Correct: ${correct} Incorrect: ${incorrect}`;
    console.log(numWrong);
  };


  // a function that clears the front-end to not save previous user-selected options and clear the correct/incorrect tags
  const clearFields = () => {
    // clear the parse object
    setParse(prevState => ({ParsedWordID: 0, ParsedWord: '', InflectedMeaning: '', WordID: 0, PersonID: 0, NumberID: 0, TenseID: 0, VoiceID: 0, MoodID: 0, CaseID: 0, GenderID: 0}));
    
    // clear out the <select> elements
    let elements = ["Person", "Number", "Tense", "Voice", "Mood", "Case", "Gender"];
    elements.forEach(elementName => {
      let element = document.getElementById(elementName);
      if (element) {
        element.value = 0;
      } else {
        console.error(`Element with id "${elementName}" not found`);
      }
    });

    // empty the correct/incorrect labels
    let labels = ["PersonID", "NumberID", "TenseID", "VoiceID", "MoodID", "CaseID", "GenderID"];
    labels.forEach(labelName => {
      let label = document.getElementById(labelName);
      if (label) {
        label.textContent = "";
      } else {
        console.error(`Element with id "${labelName}" not found`);
      }
    });
  }

  

  // HTML woot woot!
  return (
    <div className="App">
      <h1>Greek Parsing Tool</h1>
      <h2 id="wordHere">Your word: λύω</h2>
      <h2 id="correctInfo"> </h2>
      <h3 id="stats">Correct: 0 Incorrect: 0</h3>
      
      <table border="1">
        <thead>
          <tr>
            <th>Label</th>
            <th>Selection</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><label htmlFor="Person">Person:</label></td>
            <td>
              <select name="PersonID" id="Person" onChange={setInput}>
                <option value="0"></option>
                <option value="1">First Person</option>
                <option value="2">Second Person</option>
                <option value="3">Third Person</option>
              </select>
            </td>
            <td><span id="PersonID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Number">Number:</label></td>
            <td>
              <select name="NumberID" id="Number" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Singular</option>
                <option value="2">Plural</option>
              </select>
            </td>
            <td><span id="NumberID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Tense">Tense:</label></td>
            <td>
              <select name="TenseID" id="Tense" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Present</option>
                <option value="2">Future</option>
                <option value="3">Aorist</option>
                <option value="4">Perfect</option>
                <option value="5">Imperfect</option>
              </select>
            </td>
            <td><span id="TenseID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Voice">Voice:</label></td>
            <td>
              <select name="VoiceID" id="Voice" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Active</option>
                <option value="2">Middle</option>
                <option value="3">Passive</option>
                <option value="4">Middle/Passive</option>
              </select>
            </td>
            <td><span id="VoiceID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Mood">Mood:</label></td>
            <td>
              <select name="MoodID" id="Mood" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Indicative</option>
                <option value="2">Subjuctive</option>
                <option value="3">Participle</option>
                <option value="4">Infinitive</option>
                <option value="5">Imperative</option>
              </select>
            </td>
            <td><span id="MoodID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Case">Case:</label></td>
            <td>
              <select name="CaseID" id="Case" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Nominative</option>
                <option value="2">Genitive</option>
                <option value="3">Dative</option>
                <option value="4">Accusative</option>
              </select>
            </td>
            <td><span id="CaseID"></span></td>
          </tr>
          <tr>
            <td><label htmlFor="Gender">Gender:</label></td>
            <td>
              <select name="GenderID" id="Gender" onChange={setInput}>
                <option value="0"></option>
                <option value="1">Masculine</option>
                <option value="2">Feminine</option>
                <option value="3">Neuter</option>
                <option value="4">Masculine/Neuter</option>
              </select>
            </td>
            <td><span id="GenderID"></span></td>
          </tr>
        </tbody>
      </table>
      <table><tbody><tr>
        <td><button id="newButton" className="button" onClick={() => newWord()}>New Word</button></td>
        <td><button id="checkButton" className="button" onClick={() => checkParse()}>Check</button></td>
      </tr></tbody></table>
      
      

      {returnedData}
    </div>
  );
}


export default App;
