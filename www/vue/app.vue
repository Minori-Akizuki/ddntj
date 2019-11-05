<template>
  <div>
    <enter v-if="!this.enterd" v-on:enterRoom="enterRoom"></enter>
		<rpgmap v-if="this.enterd"
      :roomNo="roomNo">
		</rpgmap >
    <chatbox v-if="this.enterd"
      :yourname="yourname"
      :roomNo="roomNo"
      :socketio.sync="socketio"
      :systems="systems"
    ></chatbox>
  </div>
</template>
<script>
import chatbox from './components/chatbox/chatbox';
import rpgmap from './components/map/map';
import enter from './components/enter/enter'
import dicebot from '../js/dicebot';
import io from 'socket.io-client';
import Vue from 'vue';

const serverUrl = location.href;
// const socket = io();

export default {
  data() {
    return {
      roomNo : '',
      yourname: '',
      password: '',
      systems: [],
      enterd : false,
      socketio : io()
    }
  },
  components: {
    chatbox,
    rpgmap,
    enter
  },
  methods: {
    enterRoom: function(roomNo, password, yourname){
      console.log("enterRoom to " + roomNo);
      this.yourname = yourname;
      this.roomNo = roomNo;
      this.password = password;
      // this.socketio = 
      this.socketio.emit('connected', yourname);
      this.enterd = true;
    }
  },
  created: function() {
    dicebot.getsystems((systems) => {
      this.systems = systems;
    });
  }
}
</script>
<style>

</style>

