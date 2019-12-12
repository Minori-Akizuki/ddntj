'use strict';
import Vue from 'vue';
import app from '../vue/app';
import eventbus from '../vue/eventbus';
import BootstrapVue, { EmbedPlugin } from 'bootstrap-vue';
Vue.use(BootstrapVue);
Vue.use(eventbus);

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
