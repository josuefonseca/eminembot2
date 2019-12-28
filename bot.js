console.log('eminem bot rodando');
console.log();

var Twit = require('twit');
var config = require('./config');
/*
	console.log(config);
	console.log();
*/
var T = new Twit(config);
console.log(T);
console.log();

var fs = require('fs');
var lastTweetId;

var params = {
	q: '"muse"',
	lang: 'pt',
	result_type: 'recent',
	count: 100
	since: lastTweetId
};
var tt = 0;

function loop(){ 
	var log = fs.readFileSync('./tweet_id.log', 'utf8');
	var linhas = log.split(/\r\n/);
	lastTweetId = linhas[linhas.length-2];
	console.log('Último tweet: ' + lastTweetId);
	
	T.get('search/tweets', params, function(err, data, response) {
		if(!err){  
			var last = -1;
			for(var i = 0; i < data.statuses.length && tt == 0; i++){
				
				var text = data.statuses[i].text;				
				
				if(eValido(text)){
					last++;
					console.log('@' + data.statuses[i].user.screen_name + ': ' + text);
					//tt++;
					responder(data.statuses[i], (last == 0));
				}
				
			}
			} else {
			console.log(err);
		}
	});
}

function responder(twt, log){
	//console.log('responder');
	//console.log(twt);		
	
	var novaResposta = {
		status: '@' + twt.user.screen_name + ' Eminem',
		in_reply_to_status_id: twt.id_str
	}
	
	T.post('statuses/update', novaResposta, tweeted);
	
	function tweeted(err, data, response){
		if(err){
			console.log('Algo deu errado.');
			console.log(err);
			console.log();
		} else {
			if(log){
				var newLine = data.id_str + '\r\n';
				fs.writeFile('./tweet_id.log', newLine,{enconding:'utf-8',flag: 'a'}, function (err) {
					if (err) {
						console.log('Erro ao salvar registro');
					} else {
						console.log(data.id_str + ' > tweet_id.log');
					}
				});
			}
			console.log('Tuitado com sucesso!');						
		}	
	}	
	
}
	
	
function eValido(txt){
	str = new String(txt);
	str = str.toLowerCase();

	if(str.length = 4)
	return str.endsWith('muse');
	else
	return str.endsWith(' muse') || str.endsWith(' @muse') || str.endsWith(' #muse');
}

setInterval(loop, 60000);
