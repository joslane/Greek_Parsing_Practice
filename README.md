# Greek Parsing Tool

This quiz-style web application allows students to practice determining the tense, voice, person, number, aspect, and gender of Greek verbs on sight.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Features
* **Random selection:** given words for each question are randomized to increase quiz effectiveness
* **Checking by attribute:** provides feedback on which answers are correct and incorrect
* **Simple UI:** easy to use dropdown selections for each attribute
* **Score tracking:** shows the user how many correct and incorrect to track progress


# Credit

Most files in this repository were provided by the template.
The files that I created are:
* dbConfig.js
* dbOperation.js

These files were provided but heavily modified, containing the main logic of the application:
* App.css
* App.js
* server.js

These files were provided and slightly modified for the implementation of the database:
* package.json

The rest of the files were provided and untouched from the template linked above.

# Setup

1. Clone the repository

   ```
   git clone https://github.com/joslane/Greek-parsing-practice.git
   cd Greek-parsing-practice
   ```
   
2. Install dependencies

   ```
   npm install
   ```

3. Set up the SQL database using the data and queries provided in the "data" folder. My procedure is as follow:
   * Set up a database in SQL Server Management Studio
   * Run the provided queries in the SetupScripts.sql file
   * Connect the data provided in the RawData.xlsx file using Microsoft Access

4. Connect to the database in the dbConfig.js file

    ```
    const config = {
    user: 'user',
    password: '',
    host: 'localhost',
    database: 'GreekParsing',
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename:'SQLEXPRESS' 
        },
    port: 1433
    }
    ```
5. Start the server
    ```
   node server.js
    ```

# Running Screenshot

<img width="406" alt="image" src="https://github.com/user-attachments/assets/6868e949-06f5-4d62-af8e-f6417f482574" />


