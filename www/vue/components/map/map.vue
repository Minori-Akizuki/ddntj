<template>
  <!-- マップ -->
  <div id="map" class="draggable ui-widget-content">
    <!-- チット -->
		<div 
			 id="chit"
		   v-for="chit in chits"
			 v-bind:key="chit.id"
			 class="draggable ui-widget-content"
		>{{chit.id}}{{chit.name}}</div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue'

const serverUrl = location.href;
const socketio = io.connect(serverUrl);

class Vector2d{
	constructor(x,y){
		this.x = x ? 0 : x;
		this.y = y ? 0 : y;
	}
}

class Chit {
	/*
	 * create chit
	 * @param {number} id - chitid
	 * @param {number} name - chit name
	 * @param {Vector2d} position - position
	 */
	constructor(id,name,position){
		this.id = id;
		this.name = name;
		this.position = position;

		console.log(`create chit ${this.toString()}`)
	}
}

export default{
  data(){
		return{
      mapfile: '',
		  chits: []
		}
  },
  created: function(){
		socketio.on('publish.chitUpdated', function(chit){
			console.log(`updated chit from pther player ${chit}`);
			this.updateChitStatus(chit);
		});
		// debug v
			 this.updateChitStatus(
				 new Chit(0, 'test', new Vector2d(0,0))
			 );
		// debug ^
  },
  methods:{
		/*
		 * update chit status in collection
		 * @param {Chit} chit - chit
		 */
		updateChitStatus: function(chit){
			console.log(`update chit ${chit}`)
			this.chits[chit.id]=chit;
			return;
		},
		/*
		 * send chit data to server
		 * @param {Chit} chit - chit 
		 */
		sendChitStatus: function(chit){
			socketio.emit(
				"publish.requestChitUpdate",
				chit
		  );
	  }
  },
  mounted : function(){
    $('.draggable').draggable();
  }
}
</script>

<style>
#map{
	height: 500px;
	width: 500px;
}

#chit{
	height: 50px;
	width: 50px;
}

</style>