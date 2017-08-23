<template>
  <div id="chatbox" class="draggable ui-widget-content">
    <!-- 名前 -->
    <input
      v-model="name"
    >
    <!-- システム選択 -->
    <select v-model="selectedSystem" name="systems" size="1">
      <option selected></option>
      <option v-for="system in systems" :key="system">{{system}}</p></option>
    </select>
    <input
      v-model="inputbox"
      v-on:keyup.enter="sendMessage(yourname,selectedSystem)"
      placeholder="input message here"
      style="width:400px"
    >
    <button
      @click="sendMessage(yourname,selectedSystem)"
      id="button"
    >
    send Message
    </button>
    <div id="chatmessages">
      <div v-for="message in messages" v-cloak :key="message.id">{{message.text}}</div>
    </div>
  </div>
</template>
<script>
import io from 'socket.io-client';

const serverUrl = location.href;
const socketio = io.connect(serverUrl);

export default {
  data() {
    return {
      messages: [],
      totalMessageId: 0 ,
      inputbox: "",
      selectedSystem: this.selected,
      name: this.yourname
    }
  },
  props: [
    'systems',
    'yourname',
    'selected'
  ],
  created: function() {
    socketio.on("publish", (data) => {
      console.log(data);
      this.addMessage(data.text);
    });
    this.addMessage("貴方は" + this.yourname + "として入室しました");
    return;
  },
  methods:{
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
  }
}
</script>


