<template>
    <div>
        <div id="header">
            <b-dropdown 
                id="room" 
                text="部屋" 
                class="m-md-2 button" 
                size="sm"
                :disabled="!enterd_room">
                <b-dropdown-item 
                    @click="$emit('openMapConfig')">マップ変更</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="resource" text="画像類" class="m-md-2 button" size="sm">
                <b-dropdown-item @click="$emit('manageImage')">画像</b-dropdown-item>
                <b-dropdown-item>音源</b-dropdown-item>
                <b-dropdown-item>動画</b-dropdown-item>
            </b-dropdown>
            <div id="title">どどんてぃ</div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';

export default {
  data() {
    return {
    };
  },
  props:[
      'enterd_room',
  ],
  components: {
  },
  methods: {
  },
  created: function() {
  }
}
</script>
<style scoped>

#header{
  margin: 0px;
  padding: 5px;
  background-color: #ccffcc;
    width: 100%;
    height: 50px;
}
#header ul{
  font-size:0;
  padding: 0px;
  width : auto;
  text-align: left;
  float: left;
}
#header li{
  font-size: 16px;
  display: inline-block;
  margin-left : 5px;
  margin-right : 5px;
}
#header #title{
  text-align: right;
}
div.button{
    float:  left;
    vertical-align: middle;
}
#title{
    height: 50px;
    line-height: 40px;
}
</style>

