<template>
    <div>
        <div id="header">
            <ul>
                <li v-for="content in menu" v-bind:key="content.id">
                    {{content.text}}
                </li>
            </ul>
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
            {'id':2, 'text':'hugahuga'}
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

</style>

