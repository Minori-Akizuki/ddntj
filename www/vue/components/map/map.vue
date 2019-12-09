<template>
<div>
	<characters
		v-bind:chits.sync="chits"
		@update:chit="updateChitStatusOwn"
		@delete:chit="deleteChit"
	>
	</characters>
  <!-- マップ -->
  <div id="map" class="draggable ui-widget-content">
    <!-- チット -->
		<div 
			v-bind:id="'chit_'+chit.id"
			v-for="chit in chits"
			v-bind:key="chit.id"
			class="draggable-chit ui-widget-content"
		>{{chit.name}}</div>
  </div>
</div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue'
import characters from './characters'


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
	constructor(id, name, position,character, initiative, status){
		this.id = id;
		this.name = name;
		this.position = position;
		this.initiative = initiative || 0
		this.status = status || [];
		this.character = character || false;
		this.memo = '';
		this.toString = function (){
			return `chit : ${id},${name},${position.x},${position.y}`
		};
		console.log(`create chit ` + this.toString());
	}
}

export default{
  data(){
	return{
    	mapfile: '',
		chits: [],
		snap: false
	}
  },
  props:[
	  'socketio'
  ],
  components:{
	  characters
  },
  created: function(){
	var _this = this;
	this.socketio.on('publish.requestChitUpdated', function(chit){
		console.log(`updated chit from other player ${chit}`);
		_this.updateChitStatusOther(chit);
	});
	this.socketio.on('publish.requestChitDelete',function(chit){
		console.log(`delete chit from other player ${chit.id}`);
		var index = _this.chits.findIndex((c)=>{
			console.log(`${c.id}<>${chit.id}`)
			return c.id==chit.id;
			});
		console.log(index);
		if(index!=-1){
			_this.chits.splice(index,1);
		}
	});
  },
  methods:{
	/*
		* update chit status in collection
		* @param {Chit} chit - chit
		*/
	updateChitStatus: function(chit){
		var _this = this;
		console.log(`update chit ${chit}`)
		var chitIndex = this.chits.findIndex((_chit)=>{return _chit.id==chit.id;});
		if(chitIndex >= 0){
			this.$set(this.chits,chitIndex,chit);
		} else {
			this.chits.push(chit);
		}
		$('#chit_'+chit.id).css({
			top: chit.position.y,
			left: chit.position.x
		})
		this.$nextTick( () => {_this.reAttachDraggable();} );
		return;
	},
	updateChitStatusOther:function(chit){
		this.updateChitStatus(chit);
	},
	updateChitStatusOwn:function(chit){
		this.updateChitStatus(chit);
		this.socketio.emit('publish.requestChitUpdated',chit);
	},
	deleteChit : function(chit){
		this.socketio.emit('publish.requestChitDelete',chit)
	},
	/**
	 * convert ui to chit
	 */
	convertUitoChit : function(ui){
		var _helper = ui.helper;
		console.log(_helper[0].id, ui.position.left, ui.position.top);
		var id  = _helper[0].id.slice(5);
		console.log(`taeget is <${this.chits.find((_chit)=>{return _chit.id==id;})}>`)
		var chit = this.chits.find((_chit)=>{return _chit.id==id;});
		chit.position = new Vector2d(ui.position.left,ui.position.top);
		console.log('conv chit [' + this.chits.findIndex((_chit)=>{return _chit.id==id;}) + '] to : ' +  chit.toString());
		return chit;
	},
	/**
	 * re-attach draggable
	 */
	reAttachDraggable : function(){
		console.log('reattach draggable');
		var _this = this
		$('.draggable').draggable();
		var option = this.snap ? { grid:[50,50] } : {}
		$('.draggable-chit')
			.draggable(option)
			.on(
				'dragstop',
				function(event,ui){
					console.log('dragged chit')
					console.log(ui);
					var chit =_this.convertUitoChit(ui);
					_this.updateChitStatusOwn(chit)
			});

	}
  },
  watch : {
	  chits : function(){
		  console.log('catch chit edited');
		  console.log(this.chits);
	  }
  },
  mounted : function(){
	  this.reAttachDraggable();
  }
}
</script>

<style>
#map{
	height: 500px;
	width: 500px;
	z-index: 1;
}

div[id^=chit]{
	height: 50px;
	width: 50px;
	transition: all 0.2s ease-in-out;
}

</style>