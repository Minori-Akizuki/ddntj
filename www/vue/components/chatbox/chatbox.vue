<template>
  <div id="chatbox" class="draggable resizable ui-widget-content">
    <div id="chatmessages" @scroll="manageUpdateFlag()">
      <div class="spacer"></div>
      <div 
        class="message" 
        v-for="message in messages" 
        v-cloak :key="message.id"
        v-bind:style="{color:message.color}" >{{message.text}}</div>
    </div>
    <div class="input-settings">
      <b-container fluid>
        <!-- 名前 -->
        <b-row>
          <b-col sm="3">
            <input
              v-model="name"
            >
          </b-col>
          <!-- システム選択 -->
          <b-col sm="5">
            <select v-model="selectedSystem" name="systems" size="1">
              <option selected></option>
              <option v-for="system in systems" :key="system.system" :value="system.system">{{system.name}}</option>
            </select>
          </b-col>
          <b-col sm="1">
            <b-form-input
              id="textcolor"
              type="color"
              v-model="inputColor"></b-form-input>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div class="input-area">
      <textarea
        v-model="inputbox"
        @keydown.enter="sendMessage"
        placeholder="input message here"
        class="input-box"
      />
      <b-button
        @click="sendMessage"
        id="button"
        class="enter-button"
        v-model="inputColor"
      >
      send Message
      </b-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';

const serverUrl = location.href;

export default {
  data() {
    return {
      messages: [],
      totalMessageId: 0 ,
      inputbox: '',
      inputColor:'',
      selectedSystem: 'DiceBot',
      name: this.yourname,
      update: true,
    }
  },
  props: [
    'yourname',
    'selected',
    'socketio',
    'systems',
    'roomNo'
  ],
  created: function() {
    var _addMessage = this.addMessage;
    this.socketio.on('chatinit', function(data){
      console.log(data);
      data.chats.forEach(log => {
        _addMessage(log);
      });
    });
    this.socketio.on('connected', function(data){
      console.log(data);
      _addMessage(data);
    });
    this.socketio.on('publish.chat',function(data){
      console.log('receve publsh : ' + data);
      _addMessage(data);
    });
    this.addMessage("貴方は" + this.roomNo + "番の部屋に入室しました");
    return;
  },
  methods:{
    addMessage: function(msg){
      const messageBox = document.getElementById('chatmessages');
      this.messages.push({
        id:(this.totalMessageId++),
        text:msg.text,
        color:msg.color
      });
      if (this.update) {
        this.$nextTick(function() {
          const messageBox = document.getElementById('chatmessages');
          messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight;
        });
      }
    },
    sendMessage: function(event){
      console.log(event.getModifierState('Shift'))
      if (event.getModifierState('Shift')) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const textInput = this.inputbox;
      const name = this.yourname;
      const system = this.selectedSystem;
      const color = this.inputColor

      if(textInput === ''){ return; }
      const _msg = "[" + name + "] " + textInput;
      this.socketio.emit(
        "publish.chat",
        {
          'system': system,
          'text': textInput,
          'name': name,
          'color' : color
        }
      );
      this.inputbox = '';
    },
    manageUpdateFlag: function() {
      const messageBox = document.getElementById('chatmessages');
      if (messageBox.scrollTop === messageBox.scrollHeight - messageBox.clientHeight) {
        this.update = true;
      } else {
        this.update = false;
      }
    }

  },
  watch: {
    name: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update:yourname', newVal);
      }
    }
  },
  mounted : function(){
    $('.draggable').draggable();
    $(".resizable").resizable();
  }
}
</script>
<style scoped>
#chatbox{
  border: solid #808080;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  height: 200px;
  left: 10px;
  padding: 0.5em;
  position: absolute;
  width: 800px;
  z-index: 3;
}

#chatmessages{
  background: #fff;
  display: flex;
  flex: 1 0 0px;
  flex-direction: column;
  font-size: 12px;
  margin: 0 0 5px;
  overflow-y: scroll;
  position: relative;
  white-space: pre-line;
}

.input-area {
  align-items: stretch;
  display: flex;
  flex: 0 0 auto;
}

.input-box {
  align-items: flex-start;
  display: flex;
  flex: 1 0 0px;
  height: 50px;
  padding: 0;
  resize: none
}

.enter-button {
  flex: 0 0 auto;
}

.input-settings {
  flex: 0 0 auto;
  margin-bottom: 5px;
}

.message {
  flex: 0 0 auto;
}

.spacer {
  flex: 1 0 0px;
}
</style>

