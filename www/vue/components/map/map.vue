<template>
  <!-- マップ -->
  <div id="map" class="draggable ui-widget-content">
    <!-- チット -->
		<div 
			v-bind:id="'chit_'+chit.id"
			v-for="chit in chits"
			v-bind:key="chit.id"
			class="draggable-chit ui-widget-content"
		>{{chit.id}}{{chit.name}}</div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue'

const serverUrl = location.href;

class Vector2d{
	constructor(x,y){
		this.x = x ? x : 0;
		this.y = y ? y : 0;
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
		this.toString = function (){
			return `chit : ${id},${name},${position.x},${position.y}`
		};

		console.log(`create chit ${id},${name},${position}`)
	}
}

export default{
  data(){
	return{
    	mapfile: '',
		chits: []
	}
  },
  props:[
	  'socketio'
  ],
  created: function(){
	  var _this = this;
		this.socketio.on('publish.requestChitUpdated', function(chit){
			console.log(`updated chit from other player ${chit}`);
			_this.updateChitStatus(chit);
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
		$('#chit_'+chit.id).css({
			top: chit.position.y,
			left: chit.position.x
		})
		return;
	},
	/**
	 * convert ui to chit
	 */
	convertUitoChit : function(ui){
		var _helper = ui.helper;
		console.log(_helper[0].id, ui.position.left, ui.position.top);
		var id  = _helper[0].id.slice(5);
		var chit = new Chit(
			id,
			this.chits[id].name,
			new Vector2d(ui.position.left,ui.position.top)
		);
		console.log('conv chit to : ' +  chit.toString());
		return chit;
	},
	/**
	 * re-attach draggable
	 */
	reAttachDraggable : function(snap){
		var _this = this
		$('.draggable').draggable();
		var option = snap ? { grid:[50,50] } : {}
		$('.draggable-chit')
			.draggable(option)
			.on(
				'dragstop',
				function(event,ui){
					console.log('dragged chit')
					console.log(ui);
					var chit =_this.convertUitoChit(ui);
					_this.updateChitStatus(chit)
					_this.socketio.emit('publish.requestChitUpdated',chit);
			});

	}
  },
  mounted : function(){
	  this.reAttachDraggable(true);
  }
}
</script>

<style>
#map{
	height: 500px;
	width: 500px;
}

div[id^=chit]{
	height: 50px;
	width: 50px;
	transition: all 0.2s ease-in-out;
}

</style>