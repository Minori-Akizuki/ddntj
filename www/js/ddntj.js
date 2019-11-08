'use strict';
import Vue from 'vue';
import app from '../vue/app';
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// vue
new Vue({
  el: '#vue-app',
  components: {
    app
  },
  template: '<app/>'
})

$("#button").button();
$(".draggable").draggable();
$(".resizable").resizable();
