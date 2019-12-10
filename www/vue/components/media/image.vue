<template>
    <div id="imageWindow" class="draggable resizable ui-widget-content">
        <div id="image-list">
            <img 
                v-for="image in imageList" 
                :key="image.name" 
                :src="image.bin"
                @click="selectImage(image)"
                class="preview-item-file"/>
        </div>
        <img
            :src="selectedImage.bin"
            class="preview-item-file" >
        {{selectedImage.name}}
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
    </div>
</template>

<script>

export default{
    data(){
        return {
            uploadedImage : '',
            selectedImage : {},
            img_name : '',
            imageList : []
        }
    },
    props :[
        'socketio'
    ],
    created : function(){
        var _this = this;
        this.socketio.on('publish.uploadedImage',function(i){
            console.log('uploaded image');
            _this.imageList.push(i);
        });
        this.socketio.on('imagesinit',function(d){
            console.log('init images');
            _this.imageList = d.images;
        });
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
        add : function(){
            var _this = this
            this.socketio.emit('publish.uploadedImage',{
                name : _this.img_name,
                bin : _this.uploadedImage
            })
            this.img_name = '';
            this.uploadedImage = '';
        },
        remove : function(){
            this.uploadedImage=false;
        }
    }
}
</script>
<style>
#imageWindow{
    position: absolute;
    border: 1px solid black; 
    height: 300px;
    width: 500px;
    overflow: scroll;
}

label > input {
  display: none;
}

label {
  padding: 0 1rem;
  border: solid 1px #888;
} 

label::after {
  content: '+';
  font-size: 1rem;
  color: #888;
  padding-left: 1rem;
}

img.preview-item-file{
    height: 50px;
    width: 50px;
}

</style>

