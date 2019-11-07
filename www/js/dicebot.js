'use strict';
var dicebot = dicebot || {};

dicebot.systems = [];
dicebot.url = 'https://bcdice.aimsot.net';
dicebot.url_roll = dicebot.url + '/v1/diceroll';

dicebot.getsystems = function(callback){
  if(!dicebot.systems.length){
    $.getJSON(
      dicebot.url + '/v1/names'
    ).done(
      function(data){
        console.log(data);
        dicebot.systems = data.names;
        callback(dicebot.systems);
      }
    );
  }
}

export default dicebot;
