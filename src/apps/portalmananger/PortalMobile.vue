<template>
    <div id="basemessage" class="main-container">
      <div class="content-container" style="width:100%">
            <el-card class="box-card">
               <el-form ref="form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="版本代码：" label-width="200px"><el-input v-model="formData.versionCode" type="text"></el-input></el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="版本号：" label-width="200px"><el-input v-model="formData.versionName" type="text"></el-input></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="最新版本下载地址：" label-width="200px"><el-input v-model="formData.url" type="text"></el-input></el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="更新内容：" label-width="200px"><el-input v-model="formData.content" type="text"></el-input></el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="更新日期：" label-width="200px">
                                <el-date-picker v-model="formData.date" style="width:100%" type="date"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="强制更新：" label-width="200px">
                                <el-radio-group v-model="formData.forcedUpdate">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                        <el-row>
                        <el-col :span="12">
                            <el-form-item label="是否是正式版：" label-width="200px">
                                <el-radio-group v-model="formData.release">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                       <div style="text-align:right;padding-bottom:30px">
                           <button type="button" class="el-button el-button--primary el-button--small" @click="saveMessage"><span>保存</span></button>
                       </div>
                    </el-row>
                </el-form> 
            </el-card>
            <br>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
    name: "basemessage",
    mounted() {},
    data() {
        return {
            formData:{
                "versionCode":"",
                "versionName":"",
                "url":"",
                "content":"",
                "date":"",
                "forcedUpdate":true,
                "release":false
            }
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
            self.formData.date = self.formData.date ? moment(self.formData.date).format(
                "YYYY-MM-DD"
            ) : "";
            self.formData.release = self.formData.release ? "0" : "1";
            axios
                .post("/api/v1/portal/app_upd/edit", self.formData)
                .then(res => {
                      self.formData.release =  self.formData.release == "0" ? true : false;
                      self.$message({
                        message: "修改成功",
                        type: "success"
                    });  
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        uploadSuccess(data) {
            this.dialogVisible = true;
            this.dialogImageUrl = data[0].url;
        }
    },
    mounted(){
             axios
                .get("/api/v1/portal/app_upd")
                .then(res => {
                   res.data.data.release = res.data.data.release == "0" ? true : false;
                   this.formData = res.data.data; 
                })
                .catch(function(data) {
                    
                });
    }
};
</script>
<style lang="scss" scoped>

</style>