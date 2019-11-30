<template>
<div class="draggable resizable" id="characters">
    <div>
        <table border="1">
            <tr>
                <th>In</th>
                <th>名前</th>
                <th v-for="stat in statusName" :key=stat.name id="stat">
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
                    <b-checkbox v-if="stat.type=='bool'" v-model="stat.value"></b-checkbox>
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
        <b-button 
            v-b-modal.addCharcterModal
            size=sm
        >チット追加</b-button>
        <b-modal 
            id="addCharcterModal" 
            title="チット追加"
            @ok="addNewChit"
            size="lg"
        >
            <table>
            <tr>
                <th>In</th>
                <th>名前</th>
                <th>キャラ</th>
                <th v-for="stat in statusName" :key=stat.name id="stat">
                    {{stat.name}}
                </th>
                <th>メモ</th>
                <th></th>
            </tr>
            <tr>
                <td>
                    <b-input 
                        v-model.number="newChit.intiative"
                        type="number"
                        id="type-number stat input-small"
                        size=sm></b-input>
                    </td>
                <td>
                    <b-input
                        v-model="newChit.name"
                        size=sm
                    ></b-input>
                </td>
                <td>
                    <b-checkbox v-model="newChit.character"></b-checkbox>
                </td>
                <td
                    v-for="stat in newChit.status" 
                    :key=stat.name
                    >
                    <b-checkbox 
                        v-if="stat.type=='bool'" 
                        v-model="stat.value"
                        :disabled="!newChit.character"></b-checkbox>
                    <b-input
                        v-else
                        :disabled="!newChit.character"
                        id="type-number stat input-small"
                        v-model.number="stat.value" 
                        type="number"
                        size=sm></b-input>
                </td>
                <td><b-textarea v-model="newChit.memo" size="sm"></b-textarea></td>
            </tr>                
            </table>
        </b-modal>
        <b-button size=sm>ステータス項目編集</b-button>
    </div>
</div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue'

class Vector2d{
	constructor(x,y){
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	}
}

export default{
  data(){
	return{
        statusName:[
            {name:'HP', type:'number', value:0},
            {name:'MP', type:'number', value:0},
            {name:'poizon', type:'bool', value:false},
        ],
        newChit : {}
	}
  },
  props:[
	 'value'
  ],
  created: function(){

  },
  methods:{
      copyNewChit : function(_chit){
        var chit =new Object;
        chit.id = Date.now().toString(16);
		chit.name = _chit.name;
		chit.position = _chit.position || new Vector2d();
		chit.character = _chit.character || true;
		chit.initiative = _chit.initiative || 0
        chit.status = _chit.status || 
            this.statusName.map(
                function(s){
                    console.log(s); 
                    return {
                        name:s.name, type:s.type, value:s.value 
                    };
                }
            );
		chit.memo = _chit.memo || '';
		chit.toString = function (){
			return `chit : ${this.id},${this.name},${this.position.x},${this.position.y}`
		};
        console.log(`create chit ` + this.toString());
        return chit;
    },
    addNewChit : function(){
        console.log(this.newChit.toString());
        this.value.push(this.copyNewChit(this.newChit));
        this.reattachDraggable();
    },
    reattachDraggable : function(){
        $('.draggable').draggable();
    }
  },
  watch : {
      value : function(){
          this.$emit('input',this.$event.target.value);
      }
  },
  mounted : function(){
    this.newChit = this.copyNewChit({});
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