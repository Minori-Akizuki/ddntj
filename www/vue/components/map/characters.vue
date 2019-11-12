<template>
<div class="draggable resizable" id="characters">
    <div>
        <table border="1">
            <tr>
                <th>In</th>
                <th>名前</th>
                <th v-for="stat in value[0].status" :key=stat.name id="stat">
                    {{stat.name}}
                </th>
                <th>メモ</th>
                <th></th>
            </tr>
            <tr v-for="chit in value" :key=chit.id v-show="chit.character">
                <td>{{chit.initiative}}</td>
                <td>{{chit.name}}</td>
                <td
                    v-for="stat in chit.status" 
                    :key=stat.name
                    >
                    <b-checkbox v-if="stat.value==true || stat.value==false" v-model="stat.value"></b-checkbox>
                    <b-input
                        v-else
                        id="type-number stat input-small"
                        v-model.number="stat.value" 
                        type="number"
                        size=sm></b-input>
                </td>
                <td><b-textarea v-model="chit.memo" size="sm"></b-textarea></td>
                <td>
                    <b-button v-b-modal="'delete'+chit.id" size=sm>削除</b-button>
                    <b-modal :id="'delete'+chit.id" title="キャラ削除">本当にキャラクター{{chit.name}}を削除しますか？</b-modal>
                </td>
            </tr>
        </table>
    </div>
    <div id="editcharcter">
        <b-button size=sm>キャラ追加</b-button>
        <b-button size=sm>プロパティ編集</b-button>
    </div>
</div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue'

export default{
  data(){
	return{
	}
  },
  props:[
	 'value'
  ],
  created: function(){

  },
  methods:{

  },
  watch : {
      value : function(){
          $emit('input',$event.target.value);
      }
  },
  mounted : function(){
        $('.draggable').draggable();
        $('.resizable').resizable();
  }
}
</script>

<style>
#characters{
  border: solid #808080;
  top: 100px;
  right: 10px;
  display: flex;
  height: fit-content;
  padding: 0.5em;
  position: absolute;
  overflow: scroll;
  z-index: 3;
}

.stat{
    width: 80px; 
    height: 1.2em;
}

#editcharcter{
    clear: both;
}
table {
    width: 100%;
}
</style>