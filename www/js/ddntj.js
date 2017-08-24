'use strict';
import Vue from 'vue';
import app from '../vue/app';

// vue
new Vue({
  el: '#vue-app',
  components: {
    app
  },
  template: '<app/>'
})

$("#button").button();
$(".draggable").draggable()
$(".draggable").resizable();
