<template>
<div>
	<characters
		v-bind:chits_prop.sync="chits"
		:socketio.sync="socketio"
		:imageList="imageList"
		@update:chit="updateChitStatusOwn"
		@delete:chit="deleteChit"
		@openimagewindow="openimagewindow"
	>
	</characters>
  <!-- マップ -->
  <div 
  	id="map" 
	class="draggable ui-widget-content"
	v-bind:style="mapStyle">
	<!-- 背景画像 -->
		<img 
			:src="mapImage(map)"
			v-bind:style="mapStyle">
    <!-- チット -->
		<div
			v-bind:id="'chit_'+chit.id"
			v-for="chit in chits"
			v-bind:key="chit.id"
			class="draggable-chit ui-widget-content">
			<img 
				:src="chitimage(chit)"
				:id="'chitimg_'+chit.id">
			{{chit.name}}
			<b-tooltip 
				v-if="chit.memo!=''"
				:target="'chit_'+chit.id"
				triggers="hover">
				<pre>{{chit.memo}}</pre>
			</b-tooltip>
		</div>
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
    	map : this.map_prop,
		chits: [],
	}
  },
  props:[
	  'socketio',
	  'map_prop',
	  'imageList'
  ],
  components:{
		characters,
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
	this.socketio.on('mapinit', function(d){
		console.log('mapinit');
		console.log(d);
		console.log(_this.map);
		Object.assign(_this.map,d.map);
		console.log(_this.map);
	});
	this.socketio.on('publish.mapConfigChanged',function(m){
		console.log('map changed');
		console.log(m);
		Object.assign(_this.map, m);
	});
  },
  methods:{
	/*
		* update chit status in collection
		* @param {Chit} chit - chit
		*/
	updateChitStatus: function(chit){
		var _this = this;
		console.log(`update chit`);
		console.log(chit);

		var chitIndex = this.chits.findIndex((_chit)=>{return _chit.id==chit.id;});
		if(chitIndex >= 0){
			this.$set(this.chits,chitIndex,chit);
		} else {
			this.chits.push(chit);

		}
		this.chits.sort(function(a,b){
			return b.initiative - a.initiative;
		})
		this.$nextTick( () => {
			_this.reAttachDraggable();
			$('#chit_'+chit.id).css({
				top: chit.position.y,
				left: chit.position.x
			})
		} );
		return;
	},
	updateChitStatusOther:function(chit){
		this.updateChitStatus(chit);
	},
	updateChitStatusOwn:function(chit){
		// this.updateChitStatus(chit);
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
	openimagewindow : function(callback){
		this.$emit('openimagewindow', callback);
	},
	chitimage : function(chit){
		if(chit.img){
			var image = this.imageList.fromId(chit.img.id);
			return image ? image.bin : '' ;
		}
		return '';
	},
	mapImage : function(map){
		if(map.image){
			var image = this.imageList.fromId(map.image.id);
			return image ? image.bin : '' ;
		}
		return '';
	},
	/**
	 * re-attach draggable
	 */
	reAttachDraggable : function(){
		console.log('reattach draggable');
		if(this.map.snapping){
			this.chits.map(
				(c)=>{
					c.position.x = Math.floor(c.position.x/50)*50;
					c.position.y = Math.floor(c.position.y/50)*50;
				}
			)
		}
		var _this = this
		$('.draggable').draggable();
		var option = this.map.snapping ? { grid:[50,50] } : { grid:[1,1] };
		$('.draggable-chit')
			.draggable(option)
			.off('dragstop')
			.on(
				'dragstop',
				function(event,ui){
					console.log('------ dragged chit')
					console.log(ui);
					var chit =_this.convertUitoChit(ui);
					_this.updateChitStatusOwn(chit)
			});

	},
  },
  computed:{
	  mapStyle : function(){
		  return {
			  'height' : this.map.height*50 + 'px',
			  'width' : this.map.width*50 + 'px',
		  }
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

<style scoped>
#map{
	z-index: 0;
}

div[id^=chit]{
	height: 50px;
	width: 50px;
	position: absolute;
	text-align: bottom;
}

img[id^=chitimg]{
	height: 50px;
	width: 50px;
}

pre{
	color: white;
}

</style>