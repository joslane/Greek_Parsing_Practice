/*
 * This file creates the connection bewteen the database and the back-end.
 * It is specific to my system since the database is hosted on my system.
 * A user with "database owner" privelidges was added on SSMS to allow for
 * data retrieval and manipulation without permissions issues.
*/

const config = {
    user: 'dbGenericUser',
    password: 'password',
    server: 'SERVER-NAME',
    database: 'GreekParsing',
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename:'SQLEXPRESS' 
    },
    port: 1433
}

module.exports = config;
