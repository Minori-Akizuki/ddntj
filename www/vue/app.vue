<template>
  <div>
    <div>
      <menubar
        @manageImage="openImageWindow"
      ></menubar>
    </div>
    <div>
      <enter v-if="!this.enterd" v-on:enterRoom="enterRoom"></enter>
    </div>
    <div>
      <imagewindow 
        v-show="showImageWindow"
        :socketio.sync="socketio"
        v-bind:imageList_prop.sync="imageList"
        @closeImageWindow="closeImageWindow"
        @initImages="initImages"></imagewindow>
    </div>
    <div>
      <rpgmap v-if="this.enterd"
        :roomNo="roomNo"
        :socketio.sync="socketio">
      </rpgmap >
      <chatbox v-if="this.enterd"
        :yourname="yourname"
        :roomNo="roomNo"
        :socketio.sync="socketio"
        :systems="systems"
      ></chatbox>
    </div>
  </div>
</template>
<script>
import menubar from './components/menubar/menubar'
import chatbox from './components/chatbox/chatbox';
import rpgmap from './components/map/map';
import enter from './components/enter/enter'
import imagewindow from './components/media/image'

import dicebot from '../js/dicebot';
import io from 'socket.io-client';
import Vue from 'vue';

const serverUrl = location.href;

export default {
  data() {
    return {
      roomNo : '',
      yourname: '',
      password: '',
      systems: [],
      enterd : false,
      socketio : io(),
      showImageWindow:false,
      imageList : []
    }
  },
  components: {
    menubar,
    chatbox,
    rpgmap,
    enter,
    imagewindow
  },
  methods: {
    enterRoom: function(roomNo, password, yourname){
      console.log("enterRoom to " + roomNo);
      this.yourname = yourname;
      this.roomNo = roomNo;
      this.password = password;
      this.socketio.emit('connected', {'name' : yourname, 'room' : roomNo });
      this.enterd = true;
    },
    getParam: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    openImageWindow: function(){
      this.showImageWindow=true;
    },
    closeImageWindow: function(){
      this.showImageWindow=false;
    },
    initImages : function(is){
      console.log('init images in app');
      this.imageList = is;
    }
  },
  created: function() {
    var _this = this
    dicebot.getsystems(
      function(systems){
        _this.systems = systems;
      }
    );
    var room = this.getParam('room');
    var pass = this.getParam('pass');
    var name = this.getParam('name');
    if(room){
      this.enterRoom(room,pass,name);
    }
  }
}
</script>
<style>

</style>

