<template>
    <div>
        <div v-if="!options.uploadCommpoent">
        <div class="attachments"  v-if="!options.showword" @click="previewFile(item)">
            <el-popover placement="top" trigger="hover" :open-delay="300" v-if="options.preview || options.download  || options.del">
                <div style="text-align:center" class="actions">
                    <el-upload name="files" style="display:inline-block;width:60px;" ref="upload" :on-success="handleSuccess" v-if="options.upload && !options.uploadUrl " action="/api/v1/files/upload" :with-credentials="true" :show-file-list="false">
                        <i class="el-icon-upload2">替换</i>
                    </el-upload>
                    <el-upload name="files" style="display:inline" ref="upload" :on-success="handleSuccess" v-if="options.upload && options.uploadUrl " action="/api/v1/ntko/upload"   :http-request="uploadFile" :with-credentials="true" :show-file-list="false">
                        <i class="el-icon-upload2">替换</i>
                    </el-upload>
                    <i class="el-icon-edit-outline" @click="editFile(item)"  v-if="options.edit" style="cursor: pointer">编辑</i>
                    <i class="el-icon-close" @click="deleteFile(item)" v-if="options.del" style="cursor: pointer">删除</i>
                    <i class="el-icon-download" @click="downloadFile(item)" v-if="options.download" style="cursor: pointer">下载</i>
                    <i class="el-icon-view" @click="previewFile(item)" v-if="options.preview" style="cursor: pointer"> 预览</i>
                </div>
                <div slot="reference">
                    <div class="imgsqu">
                        <img :src="item.iconUrl" width="100" alt="" class="view">
                    </div>
                    <p :title="item.name">{{item.name}}</p>
                </div>
            </el-popover>
            <div v-if="!options.preview && !options.download && !options.del">
                <div class="imgsqu">
                    <img :src="item.iconUrl" width="100" alt="" class="view">
                </div>
                <p :title="item.name">{{item.name}}</p>
            </div>
        </div>
        <div class="wordSqu" v-if="options.showword">
            <el-popover placement="top" trigger="hover" :open-delay="300" v-if="options.preview || options.download  || options.del">
                <div style="text-align:center">
                    <i class="el-icon-close" @click="deleteFile(item)" v-if="options.del" style="cursor: pointer">删除</i> &nbsp;
                    <i class="el-icon-download" @click="downloadFile(item)" v-if="options.download" style="cursor: pointer">下载</i> &nbsp;
                    <i class="el-icon-view" @click="previewFile(item)" v-if="options.preview" style="cursor: pointer"> 预览</i> &nbsp;
                </div>
                <div slot="reference">
                    <a :title="item.name" @click="previewFile(item)">{{item.name}}</a>
                </div>
            </el-popover>
            <div v-if="!options.preview && !options.download && !options.del">
                <a :title="item.name" @click="previewFile(item)">{{item.name}}</a>
            </div>
        </div>
        </div>
<!-- 
        <div v-if="options.uploadCommpoent">
            <el-upload name="files" class="upload-demo uploadBtn uploadBtnAttach" ref="upload" action="/api/v1/files/upload" :on-success="handleUploadSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false" :on-progress="getProgress">
                <i class="el-icon-plus"></i>
                <div style="position:absolute;top:15px;height:100px; background:#FFF;left:0px">
                        <el-progress type="circle" :percentage="percentage" :stroke-width = "3" :width="100" v-if="percentage > 0"></el-progress>
                </div>
            </el-upload>
        </div> -->
         <!-- <el-dialog :visible.sync="dialogFormVisible" width="1240px" :close-on-click-modal="false">
                    <div>
                        <div class="container">
            <div class="player">
            <video-player  class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
            >
            </video-player>
            </div>
        </div>
                    </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="dialogFormVisible = false">关闭</el-button>
            </div>
        </el-dialog> -->

    </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
// import { videoPlayer } from 'vue-video-player'
export default {
    data() {
        return {
            comment: "",
            attachments: [],
            percentage:0,
            dialogFormVisible:false,
        //             playerOptions: {
        // autoplay: false, //如果true,浏览器准备好时开始回放。
        // muted: false, // 默认情况下将会消除任何音频。
        // loop: false, // 导致视频一结束就重新开始。
        // preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        // language: 'zh-CN',
        // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        // fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // poster: "poster.jpg", //你的封面地址
        // width: document.documentElement.clientWidth,
        // notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //   }
        };
    },
    props: [
        // "attachmentsData", //所有数据
        "item", //当条数据
        //  "popover",//是否有popover弹出层
        // "placement", //popover弹出层位置
        // :placement = "'top'"
        // "preview",//是否需要预览
        // "del", //是否需要删除，传入删除地址
        // "download", //是否需要下载
        // "upload", //是否有上传功能
        "options",
    ],
    components: {
        //  videoPlayer
    },
    methods: {
        previewFile(item) {
            // debugger
            if(item.file_name){
                item.type = "DOC";
            }
            if ('DOCX,PPTX,XLSX,DOC,XLS'.includes(item.type.toUpperCase())) {
                    let url = "";
                    if (process.env.NODE_ENV === 'production') {
                            url = "http://124.205.31.66:2097/static/edit.html?removeBar=true&url=" + item.url;
                        }else{
                            url = "http://static1.yxpe.com.cn/edit.html?removeBar=true&url=" + item.url;
                    }

                ntkoBrowser.openWindow(url);
                            
            }
            else if('JPG,JPEG,GIF,PNG,BMP'.includes(item.type.toUpperCase()) && !!window.ActiveXObject || "ActiveXObject" in window){
                 this.common.download(item.url, item.name);
            }
            else{
                this.common.preview(item);
            }
        },
        editFile(item) {
            this.$emit("editText");
        },
        deleteFile(item, del) {
            this.$emit("getId", item.id);
        },
        downloadFile(item) {
            if('JGIF,PNG,BMP'.includes(item.type.toUpperCase()) && !!window.ActiveXObject || "ActiveXObject" in window){
                this.common.preview(item);
           }
            if('JPG,JPEG'.includes(item.type.toUpperCase()) && !!window.ActiveXObject || "ActiveXObject" in window){
                window.open(item.url,item.name);
           }
            else{
                this.common.download(item.url, item.name);
            }
            
        },

        handleSuccess(resData) {
            this.$emit("getReviseData", {
                data: resData[0],
                id: this.item.id,
                item: this.item
            });
        },
        handleChange(file) {
            this.file = file.raw;
        },
        uploadFile(f) {
            var formdata = new FormData(); //创建form对象
            formdata.append("file", f.file); //通过append向form对象添加数据
            formdata.append("token", new Date().getTime()); //通过append向form对象添加数据
            let config = {
                headers: { "Content-Type": "multipart/form-data" }
            }; //添加请求头
            axios
                .post(f.action, formdata, config) //上传图片
                .then(response => {
                    this.$emit("getReviseData", {
                        data: response.data,
                        id: this.item.id,
                        item: this.item
                    });
                });
        },
        handleUploadSuccess(response, file){
            let self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.options.attachmentsList.push(item);
                });
            }
            this.percentage = 0;
        },
         getProgress(event, file, fileList){
            this.percentage = parseInt(file.percentage);
        },
         onPlayerPlay(player) {
      alert("play");
    },
    onPlayerPause(player){
      alert("pause");
    }
    },
    mounted() {
        console.log(this.options);
    }
};
</script>

<style lang="scss" scoped>
.el-popover .actions {
    i {
        margin: 0px 5px;
    }
}
.attachments {
    position: relative;
    margin-right: 10px;
    width: 100px;
    height: 130px;
    text-align: center;
    display: inline-block;
    border: 1px solid #dcdada;
    border-radius: 2px;
    cursor: pointer;

    .focusing {
        border: none;
    }
    .imgsqu {
        display: flex;
        align-items: center;
        overflow: hidden;
        background: #fff;
        margin: auto;
        height: 130px;
        .view {
            width: 100%;
            align-items: center;
            transition: all 0.3s;
        }
    }
    :hover {
        .view {
            transform: scale(1.2);
        }
    }
    img {
        width: 100px;
        height: 120px;
    }
    p {
        margin: 0;
        line-height: 20px;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 4px 0px;
    }
}
.wordSqu {
    a {
        color: #005a9e;
        display: inline-block;
        max-width: 200px;
        margin: 0px 5px;
        cursor: pointer;
    }
    a:hover {
        text-decoration: underline;
    }
}
</style>