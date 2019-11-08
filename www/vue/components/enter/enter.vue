<template>
<div class="draggable" id="enterform">
    <div>input to enter room No.</div>
    <div>
        <b-form @submit="enterRoom">
            <b-form-input
                id="room-no"
                v-model.number="roomNo"
                type="number"
                required
                min="0"
            ></b-form-input>
            <b-form-input
                id="password"
                v-model="password"
            ></b-form-input>
            <b-form-input
                id="yourname"
                v-model="yourname"
                required
            ></b-form-input>
            <b-button type="submit" variant="primary">Enter Room</b-button>
        </b-form>
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
        yourname : "",
        alert : false
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