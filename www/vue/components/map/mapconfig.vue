<template>
<div id="map-config-window" class="draggable resizable">
    <div id="map-preview">
        <img id="map-image" :src="mapImage(map)"><br/>
        <b-button
            @click="openImageWindow">画像変更</b-button>
    </div>
    <div>
      <imagewindow 
        v-if="showImageWindow"
        :socketio.sync="socketio"
        :imageList="imageList"
        @closeImageWindow="closeImageWindow"
        @decidedImage="decidedImage"
        :selection="true"
        :imagelist_prop="imageList"></imagewindow>
    </div>
    <hr/>
    <div id="map-config">
        <b-row>
        <b-col sm="3">
            縦マス
            <b-input 
                v-model.number="map.height"
                type="number"
                size="sm"></b-input>
        </b-col>
        <b-col sm="3">
            横マス
            <b-input 
                v-model.number="map.width"
                type="number"
                size="sm"></b-input>
        </b-col>
        <b-col sm="6">
            チットをスナップする
            <b-checkbox
                v-model="map.snapping"
                @change="$emit('snappingChange')"></b-checkbox>
        </b-col>
        </b-row>
        <b-button @click="$emit('closeMapConfig',map)">閉じる</b-button>
    </div>

</div>
</template>
<script>
import imagewindow from '../media/image'

export default{
    data(){
        return{
            map : this.map_prop,
            showImageWindow : false
        }
    },
    components: {
        imagewindow
    },
    props:[
        'map_prop',
        'socketio',
        'imageList'
    ],
    methods:{
        openImageWindow : function(){
            console.log('open');
            this.showImageWindow = true;
        },
        closeImageWindow : function(){
            this.showImageWindow = false;
        },
        decidedImage : function(i){
            console.log('--- decidedImage(map)')
            console.log(i);
            this.showImageWindow = false;
            var m_image = Object.assign({},i);
            delete m_image.bin;
            this.map.image = m_image;
        },
        mapImage : function(map){
            return map.image ? 
                this.imageList.fromId(map.image.id).bin :
                '';
        },
    },
    mounted(){
        $('.draggable').draggable();
        $(".resizable").resizable();
    }
}
</script>
<style scoped>
#map-config-window{
    position: absolute;
    border: 1px solid black; 
    height: 300px;
    width: 500px;
    overflow: scroll;
    z-index: 2;
}
#map-image{
    height: 100px;
}

</style>