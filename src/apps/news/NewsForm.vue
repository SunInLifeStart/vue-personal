<template>
<el-dialog title="新闻发布" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">  
    <div id="newsForm">
     <el-form ref="formupdate" :model="formData" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="简介">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="formData.brief"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="信息内容">
                        <div v-loading="loading">
                            <VueEditor style="width: 100%" useCustomImageHandler @imageAdded="handleImageAdded" :editorToolbar="customToolbar" v-model="formData.content"></VueEditor>
                            <div style="color:#bb4747;text-align:left">*新闻内容中的图片推荐宽高比例为3:2</div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="发布到">
                    <el-col :span="6">
                        <el-checkbox label="公司网站" v-model="formData.toSite"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox label="公司门户" v-model="formData.toPortal"></el-checkbox>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="公司门户图片以及附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                        <div style="color:#bb4747;text-align:left;clear:both;">*附件中的第一张为焦点图</div>
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
        <el-button type="primary" @click="saveFormValidate(true)" v-if="!isFromDetailsEdit && !isFromDetailsEdits">提交</el-button>
    </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
import moment from "moment";
import axios from 'axios';
import FilesOperate from "../FilesOperate";
import { publicMethods } from "../application.js";
import { VueEditor } from 'vue2-editor';
export default {
    mixins: [publicMethods],
    name: "newsForm",
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            isFromDetailsEdit:false,
            isFromDetailsEdits:false,
            loading: false,
            appFlowName: "news-form_news",
            rules: {
                  title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
               
            },
         customToolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],
                ['image'],

                [{ size: [] }],

                [{ color: [] }, { background: [] }]
            ],
        };
    },
    components: {
        FilesOperate,
        VueEditor
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
                brief: '',
                title: '',
                btitle: '',
                content: '',
                reportingOrg:  this.$store.getters.LoginData.oname,
                keywords: '',
                toSite: null,
                toPortal: true,
                generalManagement: false,
                toWechat: null,
                toWeibo: null,
                attachments: []
            };
            return formData;
        },
          querySearch(queryString, cb) {
            const results = [
                {
                    value: '关键词备选'
                }
            ];
            cb(results);
        },
     handleImageAdded: function(file, Editor, cursorLocation) {
            var formData = new FormData();
            formData.append('files', file);
            axios
                .post('/api/v1/files/upload?timestamp='+ new Date().getTime(), formData)
                .then(res => {
                    let url = res.data[0].url;
                    Editor.insertEmbed(cursorLocation, 'image', url);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        drag(event) {
            this.dom = event.currentTarget;
        },
        drop(event) {
            event.preventDefault();
            if (this.formData.content == '') {
                this.formData.content = '<img src="' + this.dom.src + '">';
            } else {
                this.formData.content += '\n<img src="' + this.dom.src + '">';
            }
        },
        allowDrop(event) {
            event.preventDefault();
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = "";
        },
        setDataFromParent(data,status) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
            this.isFromDetailsEdit = status;
        },
        saveFormValidate(type) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        self.formData.attachments.splice(index, 1);
                    }
                });
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
            if (this.$store.getters.LoginData.oname === '综合管理部') {
                $self.formData.generalManagement = true
            }
            $self.formData.pushAddr = []
            if ($self.formData.toSite) {
                $self.formData.pushAddr.push('site')
            }
            if ($self.formData.toPortal) {
                $self.formData.pushAddr.push('portal')
            }
             if ($self.formData.attachments.length > 0) {
                $self.formData.attachments[0].attType = "group"
            }
            let response = await $self.saveFormData(
                "/api/v1/news_forms/save",
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
                     console.log(self.formData);
                });
            }
            this.$refs.upload.clearFiles();
        },
       
    },
    mounted() {

    }
};
</script>
<style lang="scss" scoped>
#newsForm {
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
.ql-toolbar{
    float: left;
}
}
</style>
