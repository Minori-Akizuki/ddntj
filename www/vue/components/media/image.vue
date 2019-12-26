<template>
    <div id="imageWindow" class="draggable resizable ui-widget-content">
        <div id="image-list">
            <img 
                v-for="image in imageList.list" 
                :key="image.id" 
                :src="image.bin"
                @click="selectImage(image)"
                class="preview-item-file"/>
        </div>
        <img
            :src="selectedImage.bin"
            class="preview-item-file" >
        {{selectedImage.name}}
        <b-button
            @click="decidedImage"
            v-if="selection">画像決定</b-button>
        <b-button 
            @click="deleteImage"
            v-else>画像削除</b-button>
        <hr/>
        <div id="uploadform">
            <div class="preview-item">
                <img
                    v-show="uploadedImage"
                    class="preview-item-file"
                    :src="uploadedImage"
                    alt=""
                />
                <div 
                    v-show="uploadedImage" 
                    class="preview-item-btn" 
                >
                    <p class="preview-item-name">{{ img_name }}</p>
                    <b-button size="sm" @click="add" variant="success">追加</b-button>
                    <b-button size="sm" @click="remove">キャンセル</b-button>
                </div>            
            </div>
            <b-form-file 
                accept="image/jpeg, image/png, image/gif"
                size="sm"
                @change="onFileChange"></b-form-file>
        </div>
        <b-button @click="$emit('closeImageWindow')">閉じる</b-button>
    </div>
</template>

<script>

export default{
    data(){
        return {
            uploadedImage : '',
            selectedImage : {},
            img_name : '',
            imageList : this.imagelist_prop
        }
    },
    props :[
        'socketio',
        'imagelist_prop',
        'selection',
        'decidedCallback'
    ],
    created : function(){
        var _this = this;
        this.socketio.on('publish.uploadedImage',function(i){
            console.log('uploaded image');
            _this.imageList.list.push(i);
        });
        this.socketio.on('imagesinit',function(d){
            console.log('init images');
            _this.imageList.list = d.images;
            _this.$emit('initImages',_this.imageList)
        });
        this.socketio.on('publish.deleteImage',function(i){
            console.log('delete image id ' + i.id + i.name);
            var index = _this.imageList.list.findIndex((_i)=>{return _i.id==i.id});
            _this.imageList.list.splice(index,1);
        })
    },
    methods:{
        selectImage:function(i){
            this.selectedImage = i;
        },
        onFileChange : function(e){
            const files = e.target.files || e.dataTransfer.files;
            this.createImage(files[0]);
            this.img_name = files[0].name;
        },
        createImage : function(file){
            const reader = new FileReader();
            reader.onload = e=>{this.uploadedImage=e.target.result};
            reader.readAsDataURL(file);
        },
        deleteImage : function(){
            this.socketio.emit('publish.deleteImage',this.selectedImage);
        },
        add : function(){
            var _this = this
            this.socketio.emit('publish.uploadedImage',{
                name : _this.img_name,
                bin : _this.uploadedImage,
                id : Date.now().toString(16)
            })
            this.img_name = '';
            this.uploadedImage = '';
        },
        remove : function(){
            this.uploadedImage=false;
        },
        decidedImage : function(){
            if(this.decidedCallback){
                this.decidedCallback(this.selectedImage);
            }
            this.$emit('decidedImage',this.selectedImage);
        }
    }
}
</script>
<style scoped>
#imageWindow{
    position: absolute;
    border: 1px solid black; 
    height: 300px;
    width: 500px;
    overflow: scroll;
    z-index: 2;
}

img.preview-item-file{
    height: 50px;
    width: 50px;
}

</style>

