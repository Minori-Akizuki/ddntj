<template>
  <div>
    <chatbox :yourname.sync="yourname" :systems="systems"
             :selected.sync="selectedSystem"></chatbox>
  </div>
</template>
<script>
import chatbox from './components/chatbox/chatbox';
import dicebot from '../js/dicebot';
import io from 'socket.io-client';

const serverUrl = location.href;
const socketio = io.connect(serverUrl);

export default {
  data() {
    return {
      yourname: '',
      systems: [],
      selectedSystem: 'DiceBot'
    }
  },
  components: {
    chatbox
  },
  methods: {
    initName: function() {
      const defname = Math.floor(Math.random()*100) + "さん";
      this.yourname = defname
      socketio.emit('connected', defname);
    },
  },
  created: function() {
    dicebot.getsystems((systems) => {
      this.systems = systems;
    });
    this.initName();
  }
}
</script>
<style>

</style>

