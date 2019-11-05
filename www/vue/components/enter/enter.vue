<template>
<div>
    <div>input to enter room No.</div>
    <div>
    <input type="text"
        v-model="roomNo"
        placeholder="roomNo"
        class="input"
    />
    </div>
    <div>
    <input type="text"
        v-model="password"
        placeholder="password"
        class="input"
    />
    </div>
    <div>
    <input type="text"
        v-model="yourname"
        placeholder="name"
        class="input"
    />
    </div>
    <div id="enter">
    <button @click="enterRoom">enter
    </button>
    </div>
</div>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
        roomNo : "0",
        password : "",
        yourname : ""
    }
  },
  props: [
  ],
  created: function() {
    return;
  },
  methods:{
      enterRoom: function(){
          this.$emit("enterRoom", this.roomNo, this.password, this.yourname);
      }
  },
  watch: {
  }
}
</script>
<style>
</style>