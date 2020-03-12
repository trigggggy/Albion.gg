const request = require('request');

const Database = require('better-sqlite3');
const db = new Database('albiondb.db', { verbose: console.log });

	

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
	const insertGuild = db.prepare('INSERT INTO Battles_Guilds (battleId, name, id, alliance, allianceId, kills, deaths, killFame) VALUES (@battleId, @name, @id, @alliance, @allianceId, @kills, @deaths, @killFame)');
	const insertAlliance = db.prepare('INSERT INTO Battles_Alliances (battleId, name, id, kills, deaths, killFame) VALUES (@battleId, @name, @id, @kills, @deaths, @killFame)');
	//전투 참여 길드데이터 저장 
	events.some(function (battle, index){
			var guildDataArray=[]
			//길드 데이터 가져와서 순서대로 추출후 오브젝트로 때려박은다음 flat_array에 푸쉬
			Object.keys(battle.guilds).forEach(function(keys){
				guild = battle.guilds[keys]; 
				guildDataArray.push({"battleId": battle.id, "name":guild.name, "id":guild.id, "alliance":guild.alliance, "allianceId":guild.allianceId, "kills":guild.kills, "deaths":guild.deaths, "killFame":guild.killFame});
			})
			const insertGuilds = db.transaction((guildsData)=>{guildsData.map(guildData=>insertGuild.run(guildData))});
			insertGuilds(guildDataArray)
			//전투 참여 길드 데이터 저장 완료

			//전투 참여 연합 데이터 저장
			var allianceDataArray=[]
			//길드 데이터 가져와서 순서대로 추출후 오브젝트로 때려박은다음 flat_array에 푸쉬
			Object.keys(battle.alliances).forEach(function(keys){
				alliance = battle.alliances[keys]; 
				allianceDataArray.push({"battleId": battle.id, "name":alliance.name, "id":alliance.id, "kills":alliance.kills, "deaths":alliance.deaths, "killFame":alliance.killFame});
			})
			const insertAlliances = db.transaction((alliancesdata)=>{alliancesdata.map(alliancedata=>insertAlliance.run(alliancedata))});
			insertAlliances(allianceDataArray)



	});
}
fetchBattles()	
//start_fetching = setInterval(fetchBattles, 36000)