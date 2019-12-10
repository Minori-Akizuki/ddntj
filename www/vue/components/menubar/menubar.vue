<template>
    <div>
        <div id="header">
            <b-dropdown id="room" text="部屋" class="m-md-2 button" size="sm">
                <b-dropdown-item disabled>未実装</b-dropdown-item>
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
        menu : [
            {'id':1, 'text':'hogehoge'},
            {'id':2, 'text':'リソース'}
        ]
    };
  },
  components: {
  },
  methods: {
  },
  created: function() {
  }
}
</script>
<style>
#header{
    width: 100%;
    height: 50px;
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

