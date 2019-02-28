<template>
	<div>
		<div class="avatar" v-show="!editavatar" >
			<label class="btn editbtn" for="uploads" @mouseover="avataricon = true"   @mouseout="avataricon = false">
				<i class="icon iconfont el-icon-bianji" v-show="avataricon"></i>
				<img :src="initsrc" alt="头像" class="btn"  width="128px" height="128px"/>
			</label>
			<input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
		</div>
		<div class="uploadavatar" v-show="editavatar">
			<vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :canMove="option.canMove"
			    :canMoveBox="option.canMoveBox" :fixedBox="option.fixedBox" :original="option.original"></vueCropper>
			<div class="test-button" style="margin-top:5px;text-align:center">
				<input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
				 <el-button type="primary"  @click="finish('base64')" style="width:100px;">保存</el-button>
				 <el-button type="warning"  @click="editavatar = false" style="width:100px;">取消</el-button>
			</div>
			<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
				<div :style="previews.div">
					<img :src="previews.url" :style="previews.img">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import axios from "axios";

export default {
    data: function() {
        return {
            crap: false,
            previews: {},
            editavatar: false,
            avataricon: true,
            initsrc: "img/avatar.1176c00a.png",
            option: {
                img: "",
                info: true,
                size: 1,
                outputType: "jpeg",
                canScale: false,
                autoCrop: true,
                autoCropWidth: 128,
                autoCropHeight: 128,
                fixed: true,
                fixedNumber: [4, 3]
            },
            downImg: "#"
        };
    },
    props: ["avataruri"],
    watch: {
        avataruri: function() {
          this.initsrc = this.avataruri; 
        }
    },
    methods: {
        finish(type) {
            if (type === "blob") {
                this.$refs.cropper.getCropBlob(data => {});
            } else {
                this.$refs.cropper.getCropData(data => {
                
                    this.option.img = "";
                    this.editavatar = false;
                    this.initsrc = data;

                    let self = this;
                    self.$refs.cropper.getCropBlob(data => {
                      self.$emit("setblob",data);
                    });
                    // this.$refs.cropper.getCropBlob(data => {
                    //     var formData = new FormData();
                    //     formData.append("files", data, "logo.jpeg");
                    //     axios
                    //         .post("/api/v1/files/upload", formData,{
                    //             headers: { "Content-Type": "multipart/form-data" },
                    //         })
                    //         .then(function(response) {

                    //         })
                    //         .catch(function(error) {
                              
                    //         });
                    // });
                });
            }
        },

        uploadImg(e, num) {
            //上传图片
            // this.option.img
            var file = e.target.files[0];
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                this.$message({
                    message: "图片类型必须是.gif,jpeg,jpg,png,bmp中的一种",
                    type: "error"
                });
                return false;
            }
            var reader = new FileReader();
            reader.onload = e => {
                let data;
                if (typeof e.target.result === "object") {
                    data = window.URL.createObjectURL(
                        new Blob([e.target.result])
                    );
                } else {
                    data = e.target.result;
                }
                if (num === 1) {
                    this.option.img = data;
                }
            };
            // 转化为base64
            // reader.readAsDataURL(file)
            // 转化为blob
            this.editavatar = true;
            reader.readAsArrayBuffer(file);
        }
    },
    components: {
        VueCropper
    },
    mounted() {
        this.$emit("userName", "123555");
    }
};
</script>

<style lang="scss" scoped>
.uploadavatar {
    height: 280px;
    width: 280px;
}

.avatar {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    margin: auto;
    overflow: hidden;
    border: 1px solid #ededed;
}
.avatar img:hover,
.avatar i:hover {
    cursor: pointer;
}

.editbtn {
    position: relative;
    display: block;
    height: 128px;
    width: 128px;
}

.editbtn i {
    color: #0078d7;
    font-size: 24px;
    position: absolute;
    right: 42%;
    top: 42%;
    color: #ededed;
}
</style>

    





    