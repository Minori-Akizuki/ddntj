<template>
<div class="draggable resizable" id="characters">
    <div>
        <table border="1" id="list">
            <tr>
                <th>In</th>
                <th>名前</th>
                <th v-for="stat in statusName" :key=stat.name class="stat">
                    {{stat.name}}
                </th>
                <th class="memo">メモ</th>
                <th></th>
            </tr>
            <tr v-for="chit in chits" :key=chit.id>
                <td>
                    <b-input
                        id="type-number input-small"
                        v-model.number="chit.initiative" 
                        type="number"
                        size=sm
                        @change="$emit('update:chit',chit)"
                        ></b-input>
                </td>
                <td>{{chit.name}}</td>
                <td
                    v-for="stat in chit.status" 
                    :key=stat.name>
                    <b-checkbox v-if="stat.type=='bool'" v-model="stat.value" @change="$emit('update:chit',chit)"></b-checkbox>
                    <b-input
                        v-else
                        id="type-number input-small"
                        v-model.number="stat.value" 
                        type="number"
                        size=sm
                        @change="$emit('update:chit',chit)"></b-input>
                </td>
                <td>
                    <b-textarea 
                        v-model="chit.memo" 
                        size="sm" 
                        @change="$emit('update:chit',chit)"></b-textarea></td>
                <td>
                    <b-button v-b-modal="'edit'+chit.id" size=sm>編集</b-button>
                    <b-modal :id="'edit'+chit.id" title="キャラ編集">
                        <table>
                            <tr>
                                <th>In</th>
                                <th>名前</th>
                                <th>キャラ</th>
                                <th v-for="stat in statusName" :key=stat.name>
                                    {{stat.name}}
                                </th>
                                <th>メモ</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>
                                    <b-input 
                                        v-model.number="chit.initiative"
                                        type="number"
                                        id="type-number stat input-small"
                                        size=sm></b-input>
                                    </td>
                                <td>
                                    <b-input
                                        v-model="chit.name"
                                        size=sm
                                    ></b-input>
                                </td>
                                <td>
                                    <b-checkbox v-model="chit.character"></b-checkbox>
                                </td>
                                <td
                                    v-for="stat in chit.status" 
                                    :key=stat.name
                                    >
                                    <b-checkbox 
                                        v-if="stat.type=='bool'" 
                                        v-model="stat.value"
                                        :disabled="!chit.character"></b-checkbox>
                                    <b-input
                                        v-else
                                        :disabled="!chit.character"
                                        id="type-number stat input-small"
                                        v-model.number="stat.value" 
                                        type="number"
                                        size=sm></b-input>
                                </td>
                                <td><b-textarea v-model="chit.memo" size="sm"></b-textarea></td>
                            </tr>                
                            </table>
                            <b-button variant="danger" v-b-modal="'delete'+chit.id">削除</b-button>
                            <b-modal :id="'delete'+chit.id" @ok="deleteChit(chit)">本当に削除しますか？</b-modal>
                    </b-modal>
                </td>
            </tr>
        </table>
    </div>
    <div id="addChit">
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
                <th v-for="stat in statusName" :key=stat.name>
                    {{stat.name}}
                </th>
                <th>メモ</th>
                <th></th>
            </tr>
            <tr>
                <td>
                    <b-input 
                        v-model.number="newChit.initiative"
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
	 'chits'
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
        chit.status = _chit.status ?
            _chit.status.map( (s) =>{return Object.assign({},s);} ) : 
            this.statusName.map( (s) => {return Object.assign({},s);});
		chit.memo = _chit.memo || '';
		chit.toString = function (){
			return `chit : ${this.id},${this.name},${this.position.x},${this.position.y}`
		};
        console.log(`create chit ` + chit.toString());
        return chit;
    },
    addNewChit : function(){
        console.log(this.newChit.toString());
        var chit = this.copyNewChit(this.newChit)
        this.chits.push(chit);
        this.$emit('update:chit',chit);
    },
    deleteChit: function(chit){
        console.log(`delete chit ${chit.id}`);
        var index = this.chits.findIndex((c)=>{c.id==chit.id});
        this.chits.splice(index,1);
        this.$emit('delete:chit',chit);
    },
    reattachDraggable : function(){
        $('.draggable-chit').draggable();
    }
  },
  watch : {
      chits : function(){
          this.$emit('chitupdate',this.chits);
      }
  },
  mounted : function(){
    this.newChit = this.copyNewChit({});
  }
}
</script>

<style>
#characters{
  border: solid #808080;
  top: 100px;
  right: 10px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding: 0.5em;
  position: absolute;
  overflow: scroll;
  z-index: 3;
  width: 600px;
}

th.memo{
    width: 150px;
}

#editcharcter{
    clear: both;
}
table#list {
    table-layout: fixed;
    width: 100%;
}
</style>