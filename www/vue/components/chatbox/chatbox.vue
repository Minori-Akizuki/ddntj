<template>
  <div id="chatbox" class="draggable resizable ui-widget-content">
    <div id="chatmessages" @scroll="manageUpdateFlag()">
      <div class="spacer"></div>
      <div class="message" v-for="message in messages" v-cloak :key="message.id">{{message.text}}</div>
    </div>
    <div class="input-settings">
      <!-- 名前 -->
      <input
        v-model="name"
      >
      <!-- システム選択 -->
      <select v-model="selectedSystem" name="systems" size="1">
        <option selected></option>
        <option v-for="system in systems" :key="system.system">{{system.name}}</option>
      </select>
    </div>
    <div class="input-area">
      <textarea
        v-model="inputbox"
        @keydown.enter="sendMessage"
        placeholder="input message here"
        class="input-box"
      />
      <button
        @click="sendMessage"
        id="button"
        class="enter-button"
      >
      send Message
      </button>
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
    this.socketio.on('connected', function(data){
      console.log(data);
      _addMessage(data.text);
    });
    this.socketio.on('publish',function(data){
      console.log('receve publsh : ' + data);
      _addMessage(data.text);
    });
    this.addMessage("貴方は" + this.roomNo + "番の部屋に入室しました");
    return;
  },
  methods:{
    addMessage: function(msg){
      const messageBox = document.getElementById('chatmessages');
      this.messages.push({
        id:(this.totalMessageId++),
        text:msg
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

      if(textInput === ''){ return; }
      const _msg = "[" + name + "] " + textInput;
      this.socketio.emit(
        "publish",
        {
          'system': system,
          'text': textInput,
          'name': name
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
    selectedSystem: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update:selected', newVal);
      }
    },
    name: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update:yourname', newVal);
      }
    }
  },
  mounted : function(){
    $('.draggable').draggable();
  }
}
</script>
<style>
#chatbox{
  border: solid #808080;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  height: 150px;
  left: 10px;
  padding: 0.5em;
  position: absolute;
  width: 800px;
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

