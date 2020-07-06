const request = require('request');
var mysql = require('mysql');

var con = mysql.createConnection({
	host	: "do",
	user	: "an",
	password: "s7",
	database: "dn"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
	
	
	
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
  
      //connection = mysql.createConnection(connection.config);
      handleDisconnect(connection);
      connection.connect();
    });
  }
  

	

function fetchBattles(limit = 51, offset = 0) {
	console.log('reading')
    request({
        uri: 'https://gameinfo.albiononline.com/api/gameinfo/battles?limit=' + limit + '&offset=' + offset + '&sort=recent',
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            parseBattle(body);
        } else {
            console.log('Error: ', error); // Log the error
        }
    });
}

function parseBattle(events){
	events.some(function (battle, index){
        let group 			=	new Map();
		var winner_is_guild =	false;
		var loser_is_guild 	=	false;
        var winner 			=	"";
		var winner_name 	=	"";
		var winner_count	=	0;
		var winner_kills	=	0;
		var winner_deaths	=	0;
		var loser_count 	=	0;
		var loser_kills		=	0;
		var loser_deaths	=	0;
        var loser 			=	"";
		var loser_name		=	"";
		con.query("SELECT battleId FROM Battles WHERE battleId = '"+battle.id+"'", function (err, result) {
			if (err) throw err;
			console.log(result)
			if(result.length <1){
				for(var guild in battle.guilds){
					con.query("INSERT INTO Battles_Guilds (battleId, name, id, alliance, allianceId, kills, deaths, killFame) VALUES ('"+battle.id+"','"+ battle.guilds[guild].name+"','"+ battle.guilds[guild].id+"','"+ battle.guilds[guild].alliance+"','"+ battle.guilds[guild].allianceId+"','"+ battle.guilds[guild].kills+"','"+ battle.guilds[guild].deaths+"','"+ battle.guilds[guild].killFame+"')");
        		}

        //싸움 참여한 길드, 혹은 연합내 길드들 리스트를 맵으로 저장한다.
        		for(var i in battle.alliances){
            		con.query("INSERT INTO Battles_Alliances (battleId, name, id, kills, deaths, killFame) VALUES ('"+battle.id+"','"+battle.alliances[i].name+"','"+battle.alliances[i].id+"','"+battle.alliances[i].kills+"','"+ battle.alliances[i].deaths+"','"+battle.alliances[i].killFame+"')");
            		var guild_list=[];
            		for(var guild in battle.guilds){
                		if (battle.guilds[guild].alliance == battle.alliances[i].name){
                    		guild_list.push(battle.guilds[guild].id)
                		}
                		if (battle.guilds[guild].alliance == ""){
                    		group.set("G:"+battle.guilds[guild].id, battle.guilds[guild].killFame)
                		}             
            		}

            		group.set(battle.alliances[i].id+":"+guild_list.join(','), battle.alliances[i].killFame)
        		}


        //맵을 내림차순으로 정리한다.
        group[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }

        //가장 큰 페임 수부터 1 등: 승자, 2등: 패자, 나머지는 기타쩌리 취급.
        counter = 0
        for (let [key, value] of group) {
            if (counter === 0){
                winner=key;
				temp = winner.split(':');
				if (temp[0] == "G"){
					winner_is_guild = true;
					winner 			= temp[1]
					winner_kills 	= battle.guilds[winner].kills
					winner_deaths 	= battle.guilds[winner].deaths
					winner_name 	= battle.guilds[winner].name
				}else{
					winner		 	= temp[0]
					winner_kills 	= battle.alliances[winner].kills
					winner_deaths 	= battle.alliances[winner].deaths
					winner_name 	= "["+battle.alliances[winner].name+"]"
				}
				
				
            }
            if (counter === 1){
                loser=key;
				temp = loser.split(':');
				if (temp[0] == "G"){
					loser_is_guild 	= true;
					loser 			= temp[1]
					loser_kills		= battle.guilds[loser].kills
					loser_deaths	= battle.guilds[loser].deaths
					loser_name		= battle.guilds[loser].name
				}else{
					loser 			= temp[0]
					loser_kills 	= battle.alliances[loser].kills
					loser_deaths 	= battle.alliances[loser].deaths
					loser_name 		= "["+battle.alliances[loser].name+"]"
				}
				break;
            }
            counter++;
          }
				
				
				
        //참여 인원 수를 세고 플레이어 데이터를 저장.
        var player_count=0;
        for(var player in battle.players){
			con.query("INSERT INTO Battles_Players (battleId, name, id, alliance, allianceId, guild, guildId, kills, deaths, killFame) SELECT VALUES ('"+battle.id+"','"+battle.players[player].name+"','"+battle.players[player].id+"','"+battle.players[player].allianceName+"','"+battle.players[player].allianceId+"','"+battle.players[player].guildName+"','"+battle.players[player].guildId+"','"+battle.players[player].kills+"','"+battle.players[player].deaths+"','"+battle.players[player].killFame+"') WHERE NOT EXISTS (SELECT BattleId, name FROM Battles_Players WHERE BattleId = "+battle.id+" AND name = "+battle.players[player].name+")", function(err){if(err)console.log(err)});
            player_count++;
			if (winner_is_guild){
				if(battle.players[player].guildId == winner){
					winner_count++;
				}
			}
			if(!winner_is_guild){
				if(battle.players[player].allianceId == winner){
					winner_count++;
				}
			}
			
			if (loser_is_guild){
				if(battle.players[player].guildId == loser){
					loser_count++;
				}
			}
			if (!loser_is_guild){
				if(battle.players[player].allianceId == loser){
					loser_count++;
				}
			}
        }

        //db에 전투 기록함
		con.query("INSERT INTO Battles (battleId, time, playerCount, winnerG, winner, winnerId, winnerCount, winnerKills, winnerDeaths, loserG, loser, loserId, loserCount, loserKills, loserDeaths, totalKills, totalFame) SELECT VALUES ('"+battle.id+"','"+battle.startTime+"','"+player_count+"','"+winner_is_guild+"','"+winner_name+"','"+winner+"','"+winner_count+"','"+winner_kills+"','"+winner_deaths+"','"+loser_is_guild+"','"+loser_name+"','"+loser+"','"+loser_count+"','"+loser_kills+"','"+loser_deaths+"','"+battle.totalKills+"','"+battle.totalFame+"') WHERE NOT EXISTS (SELECT battleId FROM Battles WHERE battleId = "+battle.id+")");
console.log('newdata sent')
			}
	
		});

    });
    

}
	
start_fetching = setInterval(fetchBattles, 36000)

  handleDisconnect(con);

