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
    </div>
    <div>
        <b-button v-b-modal.editStat size=sm>ステータス項目編集</b-button>
        <b-modal id="editStat" @ok="setStatusOwn">
            半角句切りでパラメータを入力してください。「*」をつけた項目はチェックボックスになります。
            <b-input v-model="statusStr"></b-input>
        </b-modal>
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
        statusStr: 'HP MP *poizon',
        newChit : {},
        chits : this.chits_prop
	}
  },
  props:[
     'chits_prop',
     'socketio',
     'imageList'
  ],
  created: function(){
    var _this = this;
	this.socketio.on('publish.statusChanged', function(status){
		console.log(`status changed from other player ${status}`);
		_this.setStatus(status);
    });
    this.socketio.on('statusinit', function(doc){
		console.log(`status init ${doc.status}`);
		_this.setStatus(doc.status);
    });
    this.socketio.on('chitsinit', function(doc){
		console.log(`chits init ${doc}`);
        _this.chits = doc.chits;
        _this.chits.map((c)=>_this.$emit('update:chit',c));
	});
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
        var index = this.chits.findIndex((c)=>{return c.id==chit.id});
        this.chits.splice(index,1);
        this.$emit('delete:chit',chit);
    },
    setStatusOwn : function(){
        this.setStatus();
        this.socketio.emit('publish.statusChanged',this.statusStr);
    },
    setStatusOther : function(status){
        this.setStatus(status);
    },
    setStatus : function(status){
        if(status){
            this.statusStr = status;
        }
        console.log(`set status ${this.statusStr}`);
        var statusArr = this.statusStr.split(' ');
        // ステータス基本情報の生成
        var newStatus = statusArr.map(
            function(_name){
                if(_name.charAt(0)=='*'){
                    return {
                        name : _name.slice(1),
                        type : 'bool',
                        value : false
                    }
                } else {
                    return {
                        name : _name,
                        type : 'number',
                        value : 0
                    }
                }
            }
        )
        this.statusName = newStatus;
        // 全てのチットに新しいステータスをセット
        this.chits = this.chits.map(
            function(c){
                c.status = newStatus.map(
                    function(s){
                        return Object.assign({},s);
                    }
                )
                return c;
            }
        )
        // 雛形のセット
        this.newChit = this.copyNewChit({});
    },
  },
  watch : {
      chits_prop : function(old, chits){
        console.log('chatch change chits from map in ch');
        this.chits = chits;
      }
  },
  mounted : function(){
    this.newChit = this.copyNewChit({});
  }
}
</script>

<style scoped>
#characters{
    border: solid #808080;
  background: rgb(243, 243, 243);
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