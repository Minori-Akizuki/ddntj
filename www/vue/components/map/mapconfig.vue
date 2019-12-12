<template>
<div id="map-config-window" class="draggable resizable">
    <div id="map-preview">
        <img id="map-image" :src="mapImage.bin"><br/>
        <b-button>画像変更</b-button>
    </div>
    <hr/>
    <div id="map-config">
        <b-row>
        <b-col sm="3">
            縦マス
            <b-input 
                v-model.number="mapHeight"
                type="number"
                size="sm"></b-input>
        </b-col>
        <b-col sm="3">
            横マス
            <b-input 
                v-model.number="mapWidth"
                type="number"
                size="sm"></b-input>
        </b-col>
        <b-col sm="6">
            チットをスナップする
            <b-checkbox
                v-model="mapSnapping"></b-checkbox>
        </b-col>
        </b-row>
    </div>
</div>
</template>
<script>
export default{
    data(){
        return{
            mapHeight : this.mapHeight_prop,
            mapWidth : this.mapWidth_prop,
            mapImage : this.mapImage_prop,
            mapSnapping : this.mapSnapping_prop
        }
    },
    props:[
        'mapHeight_prop',
        'mapWidth_prop',
        'mapImage_prop',
        'mapSnapping_prop'
    ]
}
</script>
<style scoped>
#map-config-window{
    position: absolute;
    border: 1px solid black; 
    height: 300px;
    width: 500px;
    overflow: scroll;
}
#map-image{
    height: 100px;
}

</style>