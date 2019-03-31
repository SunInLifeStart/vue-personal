<template>
    <div id="basemessage" class="main-container">
      <div class="content-container" style="width:100%">
            <el-card class="box-card">
               <el-form ref="form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="总投资额(亿) ：" label-width="200px"><el-input v-model="totalAssets" type="number"></el-input></el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业落地数量（家） ：" label-width="200px"><el-input v-model="fundedProjects" type="number"></el-input></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="年税收额(亿)：" label-width="200px"><el-input v-model="serviceFirm" type="number"></el-input></el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业动工数量（家） ：" label-width="200px"><el-input v-model="construction" type="number"></el-input></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                       <div style="text-align:right;padding-bottom:30px">
                           <button type="button" class="el-button el-button--primary el-button--small" @click="saveMessage"><span>保存</span></button>
                       </div>
                    </el-row>
                    <el-row>
                        <el-upload
                            class="upload-demo message-demo" drag  name="files"  action="api/v1/files/upload" :beforeUpload="handlePreview" :on-success ="uploadSuccess"  :show-file-list="false" accept=".png,.jpg,jpeg,.PNG,.JPG,.JPEG">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件,图片大小至少1920*850</div>
                             <img width="100%" :src="dialogImageUrl" alt="" v-if="dialogImageUrl" style="position:absolute;top:0px;right:0px;left:0px">
                        </el-upload>
                      
                    </el-row>
                     <el-row>
                       <div style="text-align:right;padding-bottom:30px">
                           <button type="button" class="el-button el-button--primary el-button--small" @click="saveImages"><span>保存图片</span></button>
                       </div>
                    </el-row>
                </el-form> 
            </el-card>
            <br>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
// import ForeignNoticeForm from './ForeignNoticeForm';
// import ForeignNoticeFilter from './ForeignNoticeFilter';
// import ForeignNoticeList from './ForeignNoticeList';
// import ForeignNoticeDetail from './ForeignNoticeDetail';
import axios from "axios";
export default {
    name: "basemessage",
    mounted() {},
    data() {
        return {
            totalAssets: "",
            fundedProjects: "",
            serviceFirm: "",
            construction: "",
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    methods: {
        saveImages() {
            let self = this;
            axios
                .post("/api/v1/portal/backdrop", {
                    url: self.dialogImageUrl
                })
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        saveMessage() {
            let self = this;
            axios
                .post("/api/v1/portal/statistics", {
                    totalAssets: self.totalAssets,
                    fundedProjects: self.fundedProjects,
                    serviceFirm: self.serviceFirm,
                    construction: self.construction
                })
                .then(res => {
                    self.$message({
                        message: "修改成功",
                        type: "success"
                    });
                })
                .catch(function(
                     
                ) {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        handlePreview(file) {
            console.log(file);
            //const isJPG = file.type === "image/png";
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isJPG) {
            //     this.$message.error("上传icon只能是 PNG 格式!");
            // }
            // if (!isLt2M) {
            //     this.$message.error("上传icon大小不能超过 2MB!");
            // }
            const isSize = new Promise(function(resolve, reject) {
                let width = 1920;
                let height = 850;
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                    let valid = img.width >= width && img.height >= height;
                    valid ? resolve() : reject();
                };
                img.src = _URL.createObjectURL(file);
            }).then(
                () => {
                    return file;
                },
                () => {
                    this.$message.error("上传的icon必须是等于或大于1920*850!");
                    return Promise.reject();
                }
            );
            // return isJPG && isLt2M && isSize;
        },
        uploadSuccess(data) {
            this.dialogVisible = true;
            this.dialogImageUrl = data[0].url;
        }
    },
    mounted:function(){
              let self = this;
            axios
                .get("/api/v1/portal/statistics")
                .then(res => {
                    self.totalAssets = res.data.data.totalAssets;
                    self.fundedProjects = res.data.data.fundedProjects;
                    self.serviceFirm = res.data.data.serviceFirm;
                    self.construction = res.data.data.construction;
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
    }
   
};
</script>
<style lang="scss" scoped>

</style>