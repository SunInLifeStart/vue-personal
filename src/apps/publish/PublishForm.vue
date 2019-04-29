<template>
<el-dialog title="信息发布" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">
    <div id="PublishForm">
        <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="信息标题:" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="信息栏目:" prop="columns">
                        <el-select v-model="formData.columns" placeholder="请选择信息类型" style="width:100%">
                            <!-- <el-option label="领导讲话" value="领导讲话"></el-option> -->
                            <el-option label="规章制度" value="规章制度"></el-option>
                            <el-option label="通知公告" value="通知公告"></el-option>
                            <!-- <el-option label="工作简报" value="工作简报"></el-option> -->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关键字:">
                        <el-input v-model="formData.keyword"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogSelectCode"
                width="30%"  append-to-body
                center>
                  <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
                    <el-option
                    v-for="item in currentRoles"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                   <el-button type="default" @click="saveFormValidate()">保存</el-button>
                   <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
                </span>
        </el-dialog>
    <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="saveFormValidate()">保存</el-button>
        <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
    </div>
    </el-dialog>
  
</template>
<script>
/* eslint-disable */
import moment from "moment";
import axios from 'axios';
import FilesOperate from "../FilesOperate";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "PublishForm",
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: "publish-form_publish",
            rules: {
                columns: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    methods: {
         setDataFromParent(data) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
      
        resetForm() {
            let formData = {
                title: '',
                columns: '',
                keyword: '',
                content: '',
                attachments: [],
                // text:{name:''}
            };
            return formData;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = "";
        },
        saveFormValidate(type) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if($self.createForm_status){
                if(await $self.juderCode() == "returnDialog"){
                    return false;
                }
            }
            let response = await $self.saveFormData(
                "/api/v1/publish_forms/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = $self.dialogSelectCode =  false;
                if (params) {
                    $self.msgTips("提交成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {                              
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(
                            function(item) {
                                return item.action == "COMMIT";
                            }
                        );
                       actions.data.types[0]["comment"] =  actions.data.types[0].name;
                       await $self.startSignal(actions.data.types[0],"fromeEdit");
                       $self.emitMessage();
                    }
                } else {
                    $self.msgTips("保存成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                     if(!this.dialogSelectCode){
                           $self.msgTips("提交失败", "warning");
                   }
                } else {
                   if(!this.dialogSelectCode){
                          $self.msgTips("保存失败", "warning");
                   }
                }
            }
        },
        handleSuccess(response, file) {
            // debugger
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        }
    }
};
</script>
<style lang="scss" scoped>
#PublishForm {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 130px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;
}
}
</style>
<style scoped>

#PublishForm  >>> .el-form-item__content{
        width: calc(100% - 112px);
    }
    #PublishForm  >>> .el-select {
        width: calc(100% - 15px);
    }
    #PublishForm  >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>