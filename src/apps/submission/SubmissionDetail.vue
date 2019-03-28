<template>
    <div id="SubmissionDetail" :class="{fullScreen:fullScreen}">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
            </el-steps>
            <div class="tabmsg" ref="tabmsg">
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="表单详情" name="second"></el-tab-pane>
                    <el-tab-pane label="正文" name="first"></el-tab-pane>
                </el-tabs>
            </div>
            <el-form ref="form" :model="tableData">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="呈报件编号：">{{tableData.submissionNo}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文件标题：">{{tableData.title}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="activeName == 'first' ">
                    <div style="border:0px solid #ccc;text-align:left;padding:20px 0 0">
                        <PdfJs :pdfUrl="tableData.text.pdfUrl" />
                    </div>
                </el-row>
                <el-row v-if="activeName == 'second' ">
                    <el-col :span="12">
                        <el-form-item prop='draftUnit：' label="拟稿单位：">{{tableData.draftUnit}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='draftTime：' label="拟稿时间：">{{tableData.draftTime | dateformat('YYYY-MM-DD')}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='draftUser：' label="拟稿人：">{{tableData.draftUser}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='draftUnit：' label="电话：">{{tableData.telephone}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="共同发起人：">{{tableData.commonUser}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注：" style="word-break:break-all">
                            {{tableData.remarks}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="activeName == 'second' ">
                    <el-col :span="24">

                        <el-form-item label="正文：">
                            <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true,edit:true}" @editText="editText" @getId="getId"></FilesOperate>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row v-if="activeName == 'second' ">
                    <el-col :span="24">
                        <el-form-item label="附件：">
                               <el-upload name="files" v-if="replaceAttach" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess"  :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                 <i class="el-icon-plus"></i>
                             </el-upload>
                            <div v-for="item in  tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true,del:replaceAttach}"  @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tableData.comments && tableData.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tableData.comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat }})
                                    </div>
                                    <div class="content">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
                <el-form>
                    <el-form-item label="请选择驳回节点" v-show="reject_status">
                        <el-select v-model="rejectTarget" style="width:100%;">
                            <el-option v-for="user in rejectList" :key="user" :label="user" :value="user">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="seleteUserLabel" v-show="presign_status">
                        <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                            <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="seleteUserLabel_approve" v-show="approve_status">
                        <el-select v-model="seleteUsers_approve" filterable style="width:100%;">
                            <el-option v-for="user in approve_users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <SubmissioneditFiles ref="SubmissioneditFiles" @getReviseData="getReviseData" @editWordData="editWordData"></SubmissioneditFiles>
    </div>
</template>

<script>
import axios from 'axios';
// import Actions from "./Actions.vue";
import PdfJs from '../PdfJs';
import FilesOperate from '../FilesOperate';
import SubmissioneditFiles from './SubmissioneditFiles.vue';
export default {
    name: 'SubmissionDetail',
    data() {
        return {
            tableData: {
                content: '',
                text: {
                    name: ''
                }
            },
            activeName: 'second',
            crumb: { items: [] },
            pageType: 'show',
            users: [],
            approve_users:[],
            actions: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            approve_status: false,
            seleteUsers: [],
            seleteUsers_approve:"",
            seleteUserLabel: '',
            seleteUserLabel_approve:'',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: '',
            crumbNodeAction: '',
            replaceAttach:false,
            copyData:{},
            multiple:true,
            staticUser:[],
        };
    },
    props: ['formId'],
    components: {
        // Actions,
        PdfJs,
        SubmissioneditFiles,
        FilesOperate
    },
    mounted() {
        this.getAllUsers();
        if (this.formId != '') {
            this.getForm();
            // this.getActions();
            this.getCrumbs();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            this.getCrumbs();
            // this.getActions();
        }
    },
    methods: {
    getId(id) {
            let self = this;
            self.$confirm("是否删除,删除后将无法找回?", "提示", { type: "warning" }).then(() => {
                self.tableData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get("/api/v1/submission_forms/deleteAttachment/" + id)
                            .then(res => {
                                self.tableData.attachments.splice(index, 1);
                            });
                    }
                });
            });
     },
    handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachments.push(item);
                    self.doUploadAttachments();
                });
            }
            this.$refs.upload.clearFiles();
         },
          doUploadAttachments(){
             const self = this;
             self.copyData.attachments = self.tableData.attachments;
                        axios
                            .post(
                                "/api/v1/submission_forms/save",
                                self.copyData
                            )
                            .then(res => {
                                self.$message({
                                    message: "添加成功",
                                    type: "success"
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: "添加失败",
                                    type: "error"
                                });
                            });
                            
         },
        saveForm() {
            const self = this;
            self.tableData.text =
                typeof self.tableData.text == 'string'
                    ? self.tableData.text
                    : JSON.stringify(self.tableData.text);
            axios
                .post('/api/v1/submission_forms/save', self.tableData)
                .then(res => {
                    self.tableData.text = res.data.text
                        ? JSON.parse(res.data.text)
                        : { name: '' };
                    self.$message({
                        message: '正文编辑成功',
                        type: 'success'
                    });
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        editWordData(data) {
            
            if (!data.url) {
                return false;
            }
            this.tableData.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:
                    data.url.split('files')[0] +
                    'pdf' +
                    data.url.split('files')[1]
            };
            this.saveForm();
            this.$refs.SubmissioneditFiles.clearTime();
        },
        editText(data) {
            if (data == 'createNewDoc') {
                this.$refs.SubmissioneditFiles.openData('');
            } else {
                this.$refs.SubmissioneditFiles.openData(
                    this.tableData.text.url
                );
            }
        },
        getReviseData(repelaceData) {
            let self = this;
            self
                .$confirm('确定要替换吗，替换后原文件将被删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    self.rows.attachments.forEach(function(value, index) {
                        if (value.id == repelaceData.id) {
                            axios
                                .delete(
                                    '/api/v1/submissions_forms/deleteAtt?id=' +
                                        repelaceData.id
                                )
                                .then(res => {
                                    self.rows.attachments.splice(index, 1);
                                    self.rows.attachments.push(
                                        repelaceData.data
                                    );
                                });
                        }
                    });
                });
        },
        setActionStatus(data) {
            this.actions_status = data;
        },
        handleClick() {},
        // setTab() {
        //     this.activeName = 'first';
        // },
        refreshFormData() {
            this.getCrumbs();
            this.getForm();
            // this.getActions();
        },
        getActions() {
            let self = this;
            axios
                .get(`/api/v1/submissions/${this.formId}/actions`)
                .then(res => {
                    res.data.types = res.data.types || [];
                   // if (this.tableData.status == '已完成') {
                        res.data.types.push({
                            type: 'print',
                            name: '打印'
                        });
                    //}
                    if (this.fullScreen) {
                        res.data.types.push({
                            type: 'closeFullScreen',
                            name: '关闭全屏'
                        });
                    } else {
                        res.data.types.push({
                            type: 'fullScreen',
                            name: '全屏显示'
                        });
                    }
                    self.actions = res.data.types;
                });
        },
        getCrumbs() {
            axios.get(`/api/v1/submissions/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.key;
                        this.crumbNodeAction = item.name;
                        if (item.assignes) {
                              if(this.crumbNodeAction == "会签" && item.assignes.includes(this.$store.getters.LoginData.uname)){
                                  this.replaceAttach = true;
                              }
                             if(item.addAssigneeList && item.assigneeList){
                                item.name = item.name + "(前加签：" + item.addAssigneeList.join(',') + ',会签：'+ item.assigneeList.join(',')+")"; 
                            }else if(item.addAssigneeList){
                                 item.name = item.name + "(前加签：" + item.addAssigneeList.join(',')+")"; 
                            }else if(item.assigneeList){
                                 item.name = item.name + "(会签：" + item.assigneeList.join(',')+")"; 
                            }else{
                                 item.name = item.name + "(" + item.assignes + ")";
                            }
                        }
                        this.crumb.index = index;
                    }
                });
            });
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/submissions/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/submissions/${self.formId}/pull`)
                        .then(res => {
                            self.getActions();
                            self.getForm();
                            self.getCrumbs();
                        });
                }
                if (
                    action.type == 'COMMIT' &&
                    this.crumbNodeName == 'Task_01'
                ) {
                    this.submitForm();
                } else if (action.type == 'COMMIT') {
                    self.dialogVisible = true;
                    if (action.required) {
                        if (action.type == 'COMMIT') {
                            self.presign_status = true;
                            self.seleteUserLabel = '请选择拟办人';
                        }
                    }
                }
            } else if (
                'REJECT,PRESIGN,PERSIGN,COUNTERSIGN'.includes(action.type)
            ) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN' || action.type == 'PERSIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
                }
                if (action.type == 'COUNTERSIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择会签人';
                }
            } else if ('fullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'closeFullScreen',
                    name: '关闭全屏'
                });
                this.fullScreen = true;
                // this.common.open(`/#/apps/outgoing/${this.formId}`);
            } else if ('closeFullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                this.fullScreen = false;
            } else if ("print".includes(action.type)) {
                axios
                    .get("/api/v1/submission_forms/" + this.formId +"/getForm")
                    .then(res => {
                        this.previewDoc(res.data);
                    });
            } else {
              if(action.required && "APPROVE".includes(action.type)){
                   this.approve_status = true;
                   this.seleteUserLabel_approve = '请选择主管领导';
                    axios.get("/api/v1/users/role/xtfz_deptLeader").then(res => {
                        this.approve_users = res.data;
                    });
              }
              if(action.required && "SUPERIOR".includes(action.type)){
                   this.approve_status = true;
                   this.seleteUserLabel_approve = '请领导签批';
                   this.approve_users = [
                       {id:497,name:"高中成"},
                        {id:498,name:"隋明军"},
                   ];
              }
                this.dialogVisible = true;
            }
        },
        previewDoc(url) {
            this.$refs.SubmissioneditFiles.openPrinter(url);
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
            this.seleteUsers = [];
            this.seleteUserLabel_approve = "";
            this.seleteUsers_approve = "";
            this.approve_status = false;
        },
        comment() {
            let self = this;
            if(self.currentAction.type == "SUPERIOR"){
                    self.textarea = self.textarea ? self.textarea : "同意,请领导签批";
            };
            axios
                .put(`/api/v1/submission_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: this.crumbNodeAction,
                    node: this.crumbNodeAction,
                    keyId: this.crumbNodeName
                })
                .then(res => {
                    self.refreshFormData();
                    self.$message({
                        message: self.currentAction.name + '成功',
                        type: 'success'
                    });
                });
        },
        submitForm() {
            let self = this;
            if (self.currentAction.type == 'REJECT') {
                if (self.rejectTarget) {
                    self.submitData.rejectTarget = self.rejectTarget;
                } else {
                    self.$message.error('请选择驳回节点');
                    return false;
                }
            }
            //必须选择人员节点
            if (self.currentAction.required) {
                if(self.currentAction.required[0].split(":")[1] == "array"){ //多选人
                      if (self.seleteUsers.length > 0) {
                        var key = self.currentAction.required[0].split(":")[0];
                        self.submitData[key] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }else{ // 单选人
                    if(self.seleteUsers_approve){
                        self.submitData[self.currentAction.required[0].split(":")[0]] = self.seleteUsers_approve;   
                    }else{
                        self.$message.error(self.seleteUserLabel_approve); 
                        return false;  
                    }
                }
            }
            self.submitData.action = self.currentAction.type;
            axios
                .put(
                    `/api/v1/submissions/${self.formId}/signal`,
                    self.submitData
                )
                .then(res => {
                    self.dialogVisible = false;
                    self.comment();
                });
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/submission_forms/' + this.formId)
                    .then(res => {
                        self.copyData = JSON.parse(JSON.stringify(res.data));
                        res.data.text =
                            res.data.text == null
                                ? { name: '' }
                                : JSON.parse(res.data.text);
                        self.tableData = res.data;
                        this.getActions();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        previewFile(item) {
            this.common.preview(item);
        },
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        }
    }
};
</script>
<style lang="scss" scope>
#SubmissionDetail {
    .el-step__main {
        margin-top: 10px;
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

    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 60px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
    .input-with-select {
        width: 0px;
        margin-right: 10px;
        .el-input-group__prepend {
            background-color: #409eff;
            border-color: #409eff;
            color: #ffffff;
            border-radius: 4px;
        }
        &.reject .el-input-group__prepend {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .el-input__inner {
            width: 0;
            padding: 0;
            border: 0;
        }
        .el-input__suffix {
            left: 8px;
        }
    }

    #actionList {
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        height: 40px;
        width: 100%;
        z-index: 10;
        font-weight: bold;
        .btnList {
            line-height: 40px;
            padding: 12px 10px;
            cursor: pointer;
        }
        .btnList:hover {
            background: #c7e0f4;
        }
    }
    .btnhide {
        display: none;
    }
    .tabmsg {
        display: none;
    }
    .crumbList {
        margin: 15px 0px;
    }
}
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: #fff;
    left: 0px;
    right: 0px;
}
</style>