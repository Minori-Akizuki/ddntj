'use strict';
var dicebot = dicebot || {};

dicebot.systems = [];

dicebot.getsystems = function(callback){
  if(!dicebot.systems.length){
    $.getJSON(
      'https://www2.taruki.com/bcdice-api/v1/systems?callback=?'
    ).done(
      function(data){
        dicebot.systems = data.systems;
        callback(data.systems);
      }
    );
  }
}

export default dicebot;
