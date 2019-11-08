// OSSライブラリ群
var Log4js = require('log4js');
var $ = require('jquery');
var url = require('url');
var cradle = require('cradle');

// log4js設定
Log4js.configure('./js/config/log-config.json');
var systemLogger = Log4js.getLogger();
systemLogger.level='debug';

// 自作ライブラリ群
var constants = require('./js/constants.js').constants();
var dicebot = require('./js/dicebot.js').dicebot();

// パブリックパス
const publicPath = './dist'

// DB関連
// セットアップ
var conn = new(cradle.Connection)(
  constants.DB_URL,
  constants.DB_PORT
);

var db_master = conn.database('ddntj');
var rooms = [];

/**
 * make master db if not exists
 */
db_master.exists(function (err, exists) {
  if (err) {
    systemLogger.info('DB error', err);
  } else if (exists) {
    systemLogger.info('found DB ddntj.');
  } else {
    systemLogger.info('database ddntj does not exists.');
    systemLogger.info('ddntj will make database.');
    db_master.create();
  }
});


/**
 * 部屋初期化のための関数
 * @callback initRoomCallback
 * @param {*} err
 * @param {bool} created 
 * @param {Database} database 
 */
/**
 * 部屋の存在を確認しコールバックを呼ぶ
 * @param {initRoomCallback} callback 
 * @param {Number} roomNo roomNo
 */
var roomDB = function(callback,roomNo){
  if( isNaN(roomNo) || roomNo > constants.ROOM_TOTAL){
    systemLogger.info('requested over total Numver or NaN');
    callback('requested over total Numver or NaN', false, null);
    return;
  } else {
    var roomDbName = 'ddntj_room_' + roomNo;
    systemLogger.debug('find ' + roomDbName)
    var dbRoom = conn.database(roomDbName);
    dbRoom.exists(function (err, exists) {
      if (err) {
        systemLogger.info('DB error', err);
        callback('DB error', false, null);
      } else if (exists) {
        systemLogger.info('found DB room : ' + roomNo);
        callback(false, false, dbRoom);
      } else {
        systemLogger.info(`room ${roomNo} does not exists.`);
        systemLogger.info('ddntj will make database.');
        dbRoom.create();
        // createに時間かかるから少しだけ待つ
        setTimeout(()=>callback(false, true, dbRoom),1000);
      }
    })
  }
}

// サーバ関連
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
    var msg = ''
    // 部屋のDBを用意
    roomDB(
      function (err, created, db){
        systemLogger.debug(db);
        if(err){
          systemLogger.error('DB error.');
          msg = 'エラーです';
          return;
          // todo: ここで選択画面に戻したい
        }else if(created){
          systemLogger.info('created room DB : ' + roomNo);
          msg = data.name + 'が入室しました';
          // 部屋初期化処理
          systemLogger.debug('/-- init room DB --/');
          db.save(
            'chatlog',
            {
              log : []
            },
            function(err, res){
              systemLogger.debug('/-init log-/')
              systemLogger.debug(err);
              systemLogger.debug(res);
            }
          );
        }else{
          systemLogger.info('found room DB : ' + roomNo);
          msg = data.name + 'が入室しました';
          // チャット等等よみこみ処理
          db.get(
            'chatlog',
            function(err, doc){
              io.to(socket.id).emit('chatinit', {chats:doc.log});
            }
          )
        }
        if(!err){
          rooms[roomNo] = rooms[roomNo] || {};
          rooms[roomNo].db = db;
          systemLogger.debug('find/create room db');
        }
        systemLogger.debug(msg);
        socket.join(roomNo);
        io.to(roomNo).emit('publish.chat', {'text': msg});
      },
      roomNo
    );

  });

  // メッセージ送信カスタムイベント
  socket.on('publish.chat', function (data) {
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
        io.to(roomNo).emit('publish.chat', {'text': msg});
        rooms[roomNo].db.get('chatlog',function(err, doc){
          systemLogger.debug(doc);
          var _log = doc.log;
          _log.push(msg);
          rooms[roomNo].db.save('chatlog', { log:_log});
        });
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