<template>
    <div id="SubmissionForm">
        <el-form ref="formupdate" :model="form" label-width="130px" :rules="rules">
            <el-row>
                <el-col :span="18">
                    <el-form-item label="呈报件编号" prop="submissionNo">
                        <el-input v-model="form.submissionNo" type="input" placeholder="请选择自动生成或是手动生成" style="margin-left:0px; height: 16px;" :disabled="selectNumber!=='handNumber'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button size="mini" style="text-align:center; margin-top:6px; margin-left:10px " @click="selectInner('autoNumber')">自动编号</el-button>
                    <el-button size="mini" style="text-align:center;" @click="selectInner('handNumber')">手动编号</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="文件标题" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="12">
                    <el-form-item prop='draftUnit' label="拟稿单位">
                        <!-- <el-input suffix-icon="el-icon-date" v-model="form.draftUnit" @focus="openDialog('draftUnit')"></el-input> -->
                        <el-input v-model="form.draftUnit" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='draftTime' label="拟稿时间">
                        <el-date-picker v-model="form.draftTime" style="width:100%" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
                </el-row>
                 <el-row>
                <el-col :span="12">
                    <el-form-item prop='draftUser' label="拟稿人">
                        <el-input v-model="form.draftUser" placeholder="" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='telephone' label="电话">
                        <el-input v-model="form.telephone" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="共同发起人">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="form.commonUser">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="form.remarks">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文">
                        <FilesOperate v-if="form.text.name" :item="form.text" :options="{preview:true,download:true,edit:true}" @getId="getId"  @editText="editText"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!form.text.name">创建文件</el-button>
                        <Submission @editWordData="editWordData" ref="submissioneditfiles"></Submission>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in form.attachments" :key="item.id" style="float:left">
                            <FilesOperate  :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from "../FilesOperate";
import Submission from "./SubmissioneditFiles.vue";
export default {
    name: 'SubmissionForm',
    data() {
        return {
            info: '',
            selectNumber: '',
            form: {
                draftUnit: '',
                // draftTime: '',
                draftTime: moment().utc(),
                draftUser: '',
                submissionNo: '',
                attachments: [],
                content:"",
                text:{name:""},
            },
            tabledata: [],
            uploadId: 0,
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                submissionNo: [
                    {
                        required: true,
                        message: '呈报件编号不能为空',
                        trigger: 'blur'
                    }
                ],
                title: [
                    {
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    }
                ],
                draftUnit: [
                    {
                        required: true,
                        message: '拟稿单位不能为空',
                        trigger: 'blur'
                    }
                ],
                draftTime: [
                    {
                        required: true,
                        message: '拟稿时间不能为空',
                        trigger: 'blur'
                    }
                ],
                draftUser: [
                    {
                        required: true,
                        message: '拟稿人不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    props: ['formId', 'operationType'],
    mounted() {
        
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.form.draftUser = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.form.draftUnit = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
      components: {
        Submission,
        FilesOperate
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                const time = moment()
                    .utc()
                    .format('YYYY-MM-DD');
                     this.clearForm();
            }else{
                    this.getForm();   
            }
        }
    },
    methods: {
        editText(){
            // this.$refs.submissioneditfiles.dialogForm = true;
            this.$refs.submissioneditfiles.openData(this.form.text.url);
        },
        createTextBody() {
            // this.$refs.submissioneditfiles.dialogForm = true;
            this.$refs.submissioneditfiles.openData();
        },
        editWordData(data) {
             if(!data.url){
                return false;
            }
            this.form.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:data.url.split("files")[0] +"pdf" + data.url.split("files")[1]
            };
        },
        getId(id) {
            let self = this;
            self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                self.form.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get("/api/v1/submission_forms/deleteAttachment/" + id)
                            .then(res => {
                                self.form.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        },
        saveFormValidate(save) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(save);
                    this.$emit("saveStatus", false);
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            self.clearTime();
            self.form.text = JSON.stringify(self.form.text);
            axios
                .post(
                    '/api/v1/submission_forms/save',
                    JSON.stringify(this.form),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.form.text = JSON.parse(res.data.text);
                    self.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.info = 'success';
                    this.$emit('info', this.info);
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$emit('refreshData');
                    }
                    if(this.operationType == 'create'){
                        self.clearForm();
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        clearTime(){
            this.$refs.submissioneditfiles.clearTime();
        },
        clearForm(){
            const time = moment()
                    .utc()
                    .format('YYYY-MM-DD');
               
                // if(this.formId){
                //      this.formId = "";
                // }
                this.form = {
                    title: '',
                    submissionNo: '',
                    draftUnit: this.cookie_oname,
                    draftTime: time,
                    draftUser: this.cookie_uname,
                    telephone: '',
                    commonUser: '',
                    remarks: '',
                    content: '',
                    attachments: [],
                    text:{name:""},
                };
        },

        submitCheck() {
            if (this.operationType == 'create') {
                this.saveForm('save');
            } else {
                this.submitForm();
            }
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/submissions/' + this.currentFormId + '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                    this.info = 'success';
                    this.$emit('info', this.info);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/submission_forms/${self.currentFormId}/comment`, {
                    content:"提交",
                    action:'提交',
                    node:'提交'
                })
                .then(res => {
                    
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/submission_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.comment();
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/submissions/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/submission_forms/' + this.formId)
                    .then(res => {
                       res.data.text = res.data.text == null ? {name:""} : JSON.parse(res.data.text);
                       self.form = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //撤销表单
        cancelForm() {
            const self = this;
            self.$confirm('是否撤销表单?', '提示', { type: 'warning' }).then(
                () => {
                    axios
                        .put(
                            '/api/v1/submission_forms/' +
                                this.formId +
                                '/cancel'
                        )
                        .then(res => {
                            self.$message({
                                message: '撤销成功',
                                type: 'success'
                            });
                            this.info = 'success';
                            this.$emit('info', this.info);
                        })
                        .catch(function() {
                            self.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                }
            );
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.form.attachments.push(item);
                });
            };
            this.$refs.upload.clearFiles();
        },
        handlePreview() {},
        handleRemove(){},
        selectInner(type) {
            if (type == 'autoNumber') {
                this.selectNumber = 'autoNumber';
                const self = this;
                axios
                    .get(
                        // '/api/v1/submission_forms/getNo?dept=' + encodeURI(this.cookie_oname),
                        '/api/v1/submission_forms/getNo'
                    )
                    .then(res => {
                        self.form.submissionNo = res.data;
                    });
            } else {
                this.selectNumber = 'handNumber';
            }
        },
        deleteAttachment(id) {
            const self = this;
            if (this.form.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/submission_forms/deleteAttachment/' +
                                    id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.form.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.form.attachments.splice(index, 1);
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#SubmissionForm {

      .textcreate {
        font-size: 16px;
        color: #327dca;
        padding: 0px 20px;
    }
    .textcreate:hover {
        text-decoration: underline;
        cursor: pointer;

        i {
            display: inline-block !important;
        }
    }
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

    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
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
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>