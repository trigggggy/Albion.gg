var mysql      = require('serverless-mysql')(
    {
        config: {
            host    : "db.albion.gabia.io",
            user    : "albion",
            password: "sang091817",
            database: 'dbalbion'
        }
    }
);
/*
var connection = mysql.createConnection({
    host    : "db.albion.gabia.io",
    user    : "albion",
    password: "sang091817",
    database: 'dbalbion'
});
*/

mysql.connect();
module.exports = mysql;
