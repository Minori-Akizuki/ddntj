var Log4js = require('log4js');
// log4js設定
Log4js.configure('js/config/log-config.json');
var systemLogger = Log4js.getLogger();

var https = require('https');
const BOTURL = 'https://www2.taruki.com/bcdice-api/v1/'
// http://www2.taruki.com/bcdice-api/v1/diceroll?system=Cthulhu&command=2d10>10

exports.dicebot = function(){

  var _dicebot = {

    roll : function(callback, system, command){
      var _command = encodeURIComponent(command);
      var reqUrl = `${BOTURL}diceroll?system=${system}&command=${_command}`;
      systemLogger.debug(`requrl : ${reqUrl}`);
      https.get(
        reqUrl,
        (res)=>{
          var body='';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', (res) => {
            _res = JSON.parse(body);
            systemLogger.debug(_res);
            callback(_res);
          });
        }
      );

    },

    systeminfo : function(callback, system){
      $.getJSON(
        'https://www2.taruki.com/bcdice-api/v1/systeminfo?callback=?',
        {
          'system': system
        }
      ).done(
        callback
      );
    },
  };
  return _dicebot;
}
