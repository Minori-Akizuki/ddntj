<template>
<div class="draggable" id="enterform">
    <div>input to enter room No.</div>
    <div>
    <input type="number"
        v-model.number="roomNo"
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
      roomNo : function(val){
          console.log(val);
          if( isNaN(val) || val<0) {
              this.roomNo=0;
          }
      }
  },
  mounted : function(){
    $('.draggable').draggable();
  }
}
</script>
<style>
#enterform{
    border: solid #808080;
    bottom: 5px;
    display: flex;
    flex-direction: column;
    left: 10px;
    padding: 0.5em;
    position: absolute;
    width: 250px;
    height: fit-content;
    left: 50px;
    top: 50px;
}
</style>