<template>
  <div>
    <div>
      <menubar
        :enterd_room="enterd"
        @manageImage="openImageWindow"
        @openMapConfig="openMapConfig"
      ></menubar>
    </div>
    <div>
      <enter v-if="!this.enterd" v-on:enterRoom="enterRoom"></enter>
    </div>
    <div>
      <imagewindow 
        v-show="showImageWindow"
        :socketio.sync="socketio"
        @closeImageWindow="closeImageWindow"
        @initImages="initImages"
        @decidedImage="closeImageWindow"
        :selection="imgSelection"
        :imagelist_prop="imageList"
        :decidedCallback="decidedCallback"></imagewindow>
    </div>
    <div>
      <mapconfig
        v-if="showMapConfig"
        :map_prop="map"
        :imageList="imageList"
        :socketio="socketio"
        @closeMapConfig="closeMapConfig"
        @snappingChange="snappingChange"
        ></mapconfig>
    </div>
    <div>
      <rpgmap 
        v-if="this.enterd"
        ref="rpgmap"
        :roomNo="roomNo"
        :socketio.sync="socketio"
        :map_prop="map"
        :imageList="imageList"
        @openimagewindow="openImageWindow">
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
import mapconfig from './components/map/mapconfig'

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
      showMapConfig:false,
      imageList : [],
      imgSelection : false,
      map : {
        height : 10,
        width : 10,
        image : {bin:''},
        snapping : false
      },
      decidedCallback : null
    }
  },
  components: {
    menubar,
    chatbox,
    rpgmap,
    enter,
    imagewindow,
    mapconfig
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
    openImageWindow: function(callback){
      if(callback){
        this.imgSelection = true;
      } else {
        this.imgSelection = false;
      }
      this.decidedCallback = callback;
      this.showImageWindow=true;
    },
    closeImageWindow: function(){
      this.showImageWindow=false;
    },
    initImages : function(is){
      console.log('init images in app');
      this.imageList = is;
    },
    openMapConfig : function(){
      this.showMapConfig = true;
    },
    closeMapConfig : function(m){
      this.showMapConfig = false;
      Object.assign(this.map,m);
      this.socketio.emit('publish.mapConfigChanged',m);
    },
    snappingChange : function(){
      var _this = this;
      this.$nextTick( ()=>
        _this.$refs.rpgmap.reAttachDraggable()
      )
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

