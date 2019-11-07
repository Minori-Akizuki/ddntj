// OSSライブラリ群
var Log4js = require('log4js');
var $ = require('jquery');
var url = require('url');

// log4js設定
Log4js.configure('./js/config/log-config.json');
var systemLogger = Log4js.getLogger();
systemLogger.level='debug';

// 自作ライブラリ群
var constants = require('./js/constants.js').constants();
var dicebot = require('./js/dicebot.js').dicebot();

// パブリックパス
const publicPath = './dist'

// サーバの初期化
var fs = require('fs');
var server = require('http').createServer(
  function(req, res) {
    systemLogger.debug(req.url);
    var urlinfo = url.parse(req.url, true)
    var requestpath =  urlinfo.pathname;
    var output;
    systemLogger.info(`request to ${requestpath}`);

    if(requestpath==='/'){
      // トップページ
      res.writeHead(200, {'Content-Type':'text/html'});
      output = fs.readFileSync(publicPath + '/index.html', 'utf-8');
      systemLogger.debug('return top page');
      res.end(output);
      return;
    }
    // 各種リソース
    try{
      requestpath = publicPath + requestpath;
      if(requestpath.indexOf('/js/')>=0 || /.js$/.test(requestpath)){
        // JS群
        res.writeHead(200, {'Content-Type':'text/javascript'});
      }else if(requestpath.indexOf('/css/images/')>=0){
        res.writeHead(200, {'Content-Type':'image/png'});
      }else if(requestpath.indexOf('/css/')>=0){
        res.writeHead(200, {'Content-Type':'text/css'});
      }
      output = fs.readFileSync(requestpath, 'utf-8');
    } catch (err){
      res.writeHead(404,{'Content-Type': 'text/plain'})
      res.write(`the URL ${requestpath} is not found!`);
      return res.end();
    }
    res.end(output);
    return;
  }
).listen(
  process.env.PORT || constants.LISTEN_PORT,
  () => {systemLogger.info(`listening on *:${constants.LISTEN_PORT}`);}
);

// socket.io イベント定義 (分割できないかな……)
var io = require('socket.io')(server)
// 2.イベントの定義
io.sockets.on('connection', function (socket) {

  var roomNo = '';
  var username = '';

  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  socket.on('connected', function (data) {
    systemLogger.info(`connect : ${data.name} to ${data.room}`);
    roomNo = data.room;
    var msg = data.name + 'が入室しました';
    socket.join(roomNo);
    io.to(roomNo).emit('publish', {'text': msg});
  });

  // メッセージ送信カスタムイベント
  socket.on('publish', function (data) {
    var msg;
    systemLogger.info(`${data.name} : ${data.system} : ${data.text}`);
    dicebot.roll(
      function(res){
        systemLogger.debug(res);
        if(res.ok){
          msg = ' ' + res.result;
        } else {
          msg = ' : ' + data.text;
        }
        systemLogger.debug(msg);
        msg = `${data.name}${msg}`;
        io.to(roomNo).emit('publish', {'text': msg});
      },
      data.system,
      data.text
    );
  });

  // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
  socket.on('disconnect', function () {
    systemLogger.debug('user disconnected')
    // nothing todo
  });

  // チットのアップデートイベント
  socket.on('publish.requestChitUpdated',function(chit){
    systemLogger(`chit update ${chit}`);
    io.to(roomNo).emit('publish.chitUpdated',chit);
  });
});