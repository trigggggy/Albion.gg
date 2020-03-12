const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
//const con = require('./lib/db.js')
var mysql      = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



var connection = mysql.createConnection({
    host     : "db.albion.gabia.io",
    user     : "albion",
    password : "sang091817",
    database : "dbalbion"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected')
});
 function handleDisconnect(connection) {
    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
  
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw err;
      }
  
      console.log('Re-connecting lost connection: ' + err.stack);

      handleDisconnect(connection);
      connection.connect();
    });
  }
  






  
  handleDisconnect(connection);


app.get('/api/:type/:name', (req, res) => {
    var type = req.params.type
    var prequery = new Date().getTime();
    connection.query('SELECT * FROM Battles_'+req.params.type+" as a INNER JOIN Battles as b ON a.battleId = b.battleId WHERE a.name = '"+req.params.name+"' ", function (error, results, fields) {
        if (error){
            console.log("Error: "+error)
        }
        else{
            string=JSON.stringify(results);
            res.send(string)
        }
        var post_query = new Date().getTime();
        var duration =(post_query-prequery)/1000;
        console.log("Execution Time: "+duration)
      });
      


});

app.get('/api/:battleid/:G/:Id', (req, res) => {
    //console.log('hello');
    var SEARCHTYPE = 'guildId';
    if(req.params.G=='true'){
        SEARCHTYPE = 'guildId';
    }else{
        SEARCHTYPE = 'allianceId';
    }
    console.log('hi')
    connection.query("SELECT * FROM Battles_Players WHERE battleId = '"+req.params.battleid+"' AND "+SEARCHTYPE+" = '"+req.params.Id+"'", function (error, results, fields) {
        if (error){
            console.log("Error: "+error)
        }
        else{
            //console.log(results)
            //console.log(req.params.G+" "+req.params.battleid+" "+ SEARCHTYPE+" "+req.params.Id)
            set=[]
            for(i in results){
                data={
                    "name": results[i].name,
                    "kd": results[i].kills+"/"+results[i].deaths
                }
                set.push(data)
                //console.log(data)
                if(set.length == results.length){
                    res.send(set)
                    //console.log(set)
                }
            }
        }
      });

});

app.listen(port, () => console.log(`Listening on port ${port}`));

/*
app.get('/api/:type/:name', (req, res) => {
    var type = req.params.type
    var prequery = new Date().getTime();
    connection.query('SELECT battleId FROM Battles_'+req.params.type+" WHERE name = '"+req.params.name+"' ", function (error, results, fields) {
        if (error){
            console.log("Error: "+error)
        }
        else{
            //string=JSON.stringify(results);
            var set=[]
            for (i in results){
                console.log(i)
                connection.query("SELECT * FROM Battles WHERE battleId = '"+results[i].battleId+"'", function (error, bresults, fields) {
                    handleDisconnect(connection);
                    if (error){
                        console.log("Error: "+error)
                    }
                    temp = bresults[0].winner.split(';')
                    ltemp = bresults[0].loser.split(';')
                    ttemp = bresults[0].time.split('T')
                    data ={
                        "time": ttemp[0],
                        "battleId": bresults[0].battleId,
                        "winnerG": temp[0],
                        "winnerId": temp[1],
                        "winner": temp[2],
                        "winnerCount": temp[3],
                        "winnerKills": temp[4],
                        "winnerDeaths": temp[5],
                        "loserG": ltemp[0],
                        "loserId": ltemp[1],
                        "loser": ltemp[2],
                        "loserCount": ltemp[3],
                        "loserKills": ltemp[4],
                        "loserDeaths": ltemp[5],
                    }
                    //console.log(data)
                    set.push(data);
                    if (set.length == results.length){
                        res.send(set);

                    }
                    var post_query = new Date().getTime();
                    var duration =(post_query-prequery)/1000;
                    console.log("Execution Time: "+duration)

                });

                
        }

            //connection.end();
        }
      });
      


});
*/