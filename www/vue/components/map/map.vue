<template>
  <!-- マップ -->
  <div id="map" class="draggable ui-widget-content">
    <!-- チット -->
		<div 
			 id="chit"
		   v-for="chit in chits"
			 class="draggable ui-widget-content"
		>{{chit.name}}</div>
  </div>
</template>

<script>
import io from 'socket.io-client';

const serverUrl = location.href;
const socketio = io.connect(serverUrl);

export default{
  data(){
		return{
      mapfile: '',
		  chits: [{}]
		}
  },
  created: function(){
		socketio.on(
			'publish.chitUpdated',
			(chit)=>{
				console.log(`update chit ${chit.id}`);
				this.changeChitStatus(chit);
			}
		)
  },
  methods:{
		changeChitStatus: function(chit){
			this.chits[chit.id]=chit;
			return;
		},
		sendChitStatus: function(chit){
			socketio.emit(
				"publish.chitUpdated",
				chit
		  );
	  }
  }
}
</script>

