
// サーバへの接続
var serverUrl = location.href;
var socketio = io.connect(serverUrl);

// 1.イベントとコールバックの定義
socketio.on("connected", function(name) {});
socketio.on("publish", function (data) {
  console.log(data);
  addMessage(data);
});
socketio.on("disconnect", function () {});

// vue
var chatbox = new Vue({
  el: '#chatbox',
  data: {
    messages: [],
    totalMessageId: 0 ,
    yourname: '',
    inputbox: "",
    systems: [],
    selectedSystem: 'DiceBot'
  },
  created: function(){
    dicebot.getsystems(function(systems){
      chatbox.systems = systems;
    });
  },
  methods: {
    addMessage: function(msg){
      this.messages.push({
        id:(this.totalMessageId++),
        text:msg
      });
    },
    sendMessage: function(name, system){
      var textInput = this.inputbox;
      if(textInput === ''){ return; }
      var _msg = "[" + name + "] " + textInput;
      socketio.emit(
        "publish",
        {
          'system': system,
          'text': textInput,
          'name': name
        }
      );
      this.inputbox = '';
    },
    initname:function(name){
      this.yourname = name;
    }
  }
})

// 2.イベントに絡ませる関数の定義
function start(name) {
  socketio.emit("connected", name);
}

function addMessage (msg) {
  var _msg =  new Date().toLocaleTimeString() + ' ' + msg.text;
  chatbox.addMessage(_msg);
}

// 3.開始処理
var defname = Math.floor(Math.random()*100) + "さん";
chatbox.initname(defname);
chatbox.addMessage("貴方は" + defname + "として入室しました");
start(defname);

