var Log4js = require('log4js');
// log4js設定
Log4js.configure('js/config/log-config.json');
var systemLogger = Log4js.getLogger();

var https = require('https');
const BOTURL = 'https://bcdice.aimsot.net/v1/'

exports.dicebot = function(){

  var _dicebot = {

    roll : function(callback, system, command){
      var _command = encodeURIComponent(command);
      var reqUrl = `${BOTURL}diceroll?system=${system}&command=${_command}`;
      systemLogger.debug(`requrl : ${reqUrl}`);
      const options ={
        'headers' : {
          // todo: ヘッダで強制的にjson返すようにしたい
        }
      }
      https.get(
        reqUrl,
        options,
        (res)=>{
          var body='';
          if(res.headers['content-type']=='text/html'){
            callback({'ok': false});
            return;
          }
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', (res) => {
            _res = JSON.parse(body);
            callback(_res);
          });
          
        }
      );
    },

    systeminfo : function(callback, system){
      $.getJSON(
        BOTURL + '/systeminfo?callback=?',
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
