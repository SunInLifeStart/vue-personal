<template>
    <div id="OutgoingDetail" :class="{fullScreen:fullScreen}">
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
        <el-steps :active="crumb.index" finish-status="success" class="crumbList" v-if="crumb && crumb.items.length > 0">
            <el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps>
        <div class="tabmsg" ref="tabmsg">
           <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="表单详情" name="second"></el-tab-pane>
            <el-tab-pane label="正文" name="first"></el-tab-pane>
          </el-tabs>
        </div>
            <el-form ref="formupdate" :model="tableData" class="formList">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发文字号：">{{tableData.wordNo}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发文文号：">{{tableData.docNo}}</el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="activeName == 'first' ">
                  <div style="border:0px solid #ccc;text-align:left;padding:20px 0 0">
                      <PdfJs :pdfUrl="tableData.text.pdfUrl" />
                  </div>
            </el-row>
            <el-row v-if="activeName == 'second' ">
                <el-col :span="8">
                    <el-form-item label="发文类型：">{{tableData.type}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行文方向：">{{tableData.direction}}</el-form-item>
                </el-col>
            </el-row>
             <el-row v-if="activeName == 'second' ">
                <el-col :span="8">
                    <el-form-item label="紧急程度：">{{tableData.urgency}}</el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="activeName == 'second' ">
                <el-col :span="24">
                    <el-form-item label="主送：">{{tableData.mainTo}}</el-form-item>
                </el-col>
            </el-row>
           <el-row v-if="activeName == 'second' ">
                <el-col :span="24">
                    <el-form-item label="抄送：">{{tableData.copyto}}</el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="activeName == 'second' ">
                <el-col :span="8">
                    <el-form-item label="拟稿单位：">{{tableData.organName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人：">{{tableData.creatorName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核稿：">{{tableData.checkorName}}</el-form-item>
                </el-col>
            </el-row>
           <el-row v-if="activeName == 'second' ">
                <el-col :span="8">
                    <el-form-item label="印制：">{{tableData.printer}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核对：">{{tableData.verify}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="印发份数：">{{tableData.parts}}</el-form-item>
                </el-col>
            </el-row>
             <el-row v-if="activeName == 'second' ">
                <el-col :span="24">
                    <el-form-item label="标题：" prop="title">{{tableData.title}}</el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="activeName == 'second' ">
                <el-col :span="24">
                    <el-form-item label="正文：">
                         <FilesOperate v-if="tableData.text.name"  :item="tableData.text" :options="{preview:true,download:true,upload:replaceButton,uploadUrl:replaceButton,edit:true}"  @editText="editText" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row v-if="activeName == 'second' ">
                <el-col :span="24" style="word-break:break-all">
                    <el-form-item label="备注：">{{tableData.remark}}</el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="activeName == 'second' ">
                <el-col :span="24">
                    <el-form-item label="附件：">
                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
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
                                    <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
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
                <el-select v-model="rejectTarget"  style="width:100%;">
                    <el-option v-for="user in rejectList" :key="user" :label="user" :value="user">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item :label="seleteUserLabel_approve" v-show="approve_status">
                        <el-select v-model="seleteUsers_approve" filterable style="width:100%;">
                            <el-option v-for="user in approve_users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                        </el-select>
            </el-form-item>
             <el-form-item :label="seleteUserLabel" v-show="presign_status">
                 <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审批意见">
                <el-input type="textarea"  placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog title="发文拟稿" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%">
            <OutgoingForm ref="outgoingform" :formId="dialogFormId" :operationType="operationType" @refreshForm = "refreshForm" ></OutgoingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveEditForm">保存</el-button>
            </div>
        </el-dialog>
        </div>
        <OutgoingeditFiles ref="outgoingeditfiles" @getReviseData="getReviseData" @editWordData="editWordData"></OutgoingeditFiles>
    </div>
</template>

<script>
import axios from "axios";
import Comment from "../Comment";
import OutgoingForm from "./OutgoingForm";
import FilesOperate from "../FilesOperate";
import OutgoingeditFiles from "./OutgoingeditFiles.vue";
import PdfJs from "../PdfJs";
import moment from "moment";
export default {
    name: "OutgoingDetail",
    data() {
        return {
            tableData: {
                text: { name: "" }
            },
            dialogFormId: "",
            operationType: "edit",
            dialogFormVisible: false,
            fileleng: "show",
            actions: [],
            crumbNodeName: "",
            crumb: { items: [] },
            saveStatus: false,
            activeName: "second",
            users: [],
            rejectTarget: "",
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: "",
            textarea: "",
            dialogVisible: false,
            currentAction: "",
            submitData: {},
            copyData: {},
            replaceButton: false,
            fullScreen: false,
            seleteUserLabel_approve:'',
            seleteUsers_approve:"",
            approve_status: false,
            approve_users:[]
        };
    },
    props: ["formId", "hideFullScreen"],
    components: {
        Comment,
        FilesOperate,
        PdfJs,
        OutgoingForm,
        OutgoingeditFiles
    },
    mounted() {
        this.getAllUsers();
        if (this.formId != "") {
            this.refreshFormData();
        }
    },
    watch: {
        formId: {
            handler: function() {
                this.refreshFormData();
            },
            deep: true
        }
    },
    methods: {
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
            this.$refs.outgoingeditfiles.clearTime();
        },
        editText(data) {
            if (data == 'createNewDoc') {
                this.$refs.outgoingeditfiles.openData('');
            } else {
                this.$refs.outgoingeditfiles.openData(this.tableData.text.url);
            }
        },
        saveEditForm() {
            this.$refs.outgoingform.saveFormValidate("fromEdit");
            this.dialogFormVisible = false;
            // this.getForm();
        },
          saveForm() {
            const self = this;
            self.tableData.text =
                typeof self.tableData.text == 'string'
                    ? self.tableData.text
                    : JSON.stringify(self.tableData.text);
            axios
                .post(
                    '/api/v1/outgoing_forms/save/',
                    self.tableData
                )
                .then(res => {
                     self.tableData.text = res.data.text ? JSON.parse(res.data.text):{name: ""}; 
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
        handleClick() {},
        // setTab() {
        //     this.activeName = "first";
        // },
        refreshFormData() {
            this.getCrumbs();
            this.getForm();
            this.getActions();
        },
        refreshForm() {
            this.getForm();
        },
        getId(id) {},
        getReviseData(repelaceData) {
            let self = this;
            self.$confirm("替换后原文件将会被覆盖，确定要替换吗？", {
                type: "warning"
            }).then(() => {
                self.tableData.text = {
                    iconUrl: repelaceData.data.icon_url,
                    name: repelaceData.data.originalFilename,
                    url: repelaceData.data.url,
                    path: repelaceData.data.path,
                    file_name: repelaceData.data.file_name,
                    pdfUrl:
                        repelaceData.data.url.split("files")[0] +
                        "pdf" +
                        repelaceData.data.url.split("files")[1]
                };
                self.copyData.text = JSON.stringify(self.tableData.text);
                axios
                    .post("/api/v1/outgoing_forms/save", self.copyData)
                    .then(res => {
                        self.$message({
                            message: "替换成功",
                            type: "success"
                        });
                    })
                    .catch(function() {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            });
        },
        getActions() {
            let self = this;
            axios.get(`/api/v1/outgoings/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
                for (let item of res.data.types) {
                    if (item.type == "ARCHIVE") {
                        res.data.types.push({
                            type: "edit",
                            name: "编辑"
                        });
                        res.data.types.push({
                            type: "print",
                            name: "打印"
                        });
                    }
                }
                if (this.fullScreen) {
                    res.data.types.push({
                        type: "closeFullScreen",
                        name: "关闭全屏"
                    });
                } else {
                    res.data.types.push({
                        type: "fullScreen",
                        name: "全屏显示"
                    });
                }

                this.actions = res.data.types;
            });
        },
        getRejectList() {
            let self = this;
            axios
                .get("/api/v1/outgoings/" + this.formId + "/reject/targets")
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ("ARCHIVE,TEMPLATE,PULL,CANCEL,COMMIT,SAVE".includes(action.type)) {
                let self = this; //套红，归档，分发
                if (action.type == "PULL") {
                    axios
                        .get(`/api/v1/outgoings/${this.formId}/pull`)
                        .then(res => {
                            self.getActions();
                            self.getForm();
                            self.getCrumbs();
                        });
                }

                if (action.type == "CANCEL") {
                    axios
                        .get(`/api/v1/outgoings/${this.formId}/pull`)
                        .then(res => {
                             self.submitForm();
                        });
                }

                
                if (action.type == "ARCHIVE") {
                    self.submitForm();
                }


                if ((action.type == "COMMIT" || action.type == "SAVE") && this.crumbNodeName == "拟稿") {
                    this.submitForm();
                }else{
                    if(action.type == 'COMMIT'){
                        self.dialogVisible = true;
                        if(action.required){
                             self.presign_status = true;
                             self.seleteUserLabel = '请选择拟办人';
                        }
                    }
                }
                
            } else if ("REJECT,PRESIGN,PRESIGN".includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == "REJECT") {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == "PRESIGN" || action.type == "PRESIGN") {
                    this.presign_status = true;
                    this.seleteUserLabel = "请选择前加签人";
                }
            } else if ("PUBLISH".includes(action.type)) {
                this.doPublish();
            } else if ("fullScreen".includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: "closeFullScreen",
                    name: "关闭全屏"
                });
                this.fullScreen = true;
                // this.common.open(`/#/apps/outgoing/${this.formId}`);
            } else if ("closeFullScreen".includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: "fullScreen",
                    name: "全屏显示"
                });
                this.fullScreen = false;
            } else if ("edit".includes(action.type)) {
                this.dialogFormVisible = true;
                this.dialogFormId = this.formId;
            } else if ("print".includes(action.type)) {
                axios
                    .get("/api/v1/outgoing_forms/getForm/" + this.formId)
                    .then(res => {
                        this.previewDoc(res.data);
                    });
            } else {
                if(action.required && "APPROVE".includes(action.type)){
                   this.approve_status = true;
                   if(action.required[0].split(":")[0] == "deptLeader"){
                        this.seleteUserLabel_approve = '请选择主管领导';
                        axios.get("/api/v1/users/list/deptLeader/"+ this.$store.getters.LoginData.oid).then(res => {
                            this.approve_users = res.data;
                        });
                   }
                  if(action.required[0].split(":")[0] == "leadership"){
                    this.seleteUserLabel_approve = '请领导签批';
                    this.approve_users = [
                        {id:7,name:"赵长山"},
                        {id:8,name:"宣鸿"},
                    ];
                   }
                 }
                 this.dialogVisible = true;
            }
        },
        previewDoc(url) {
            //this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.outgoingeditfiles.openPrinter(url);
        },
        doPublish() {
            const self = this;
            let arrurl = [];
            let arrimage = [];
            arrurl = this.tableData.attachments;
        
            const params = {
                text:JSON.stringify(this.tableData.text),
                id: this.formId,
                publisher:
                    this.tableData.creatorName != null
                        ? this.tableData.creatorName
                        : null,
                title:
                    this.tableData.title != null ? this.tableData.title : null,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                content: "",
                source:
                    this.tableData.organName != null
                        ? this.tableData.organName
                        : null,
                abstract: null,
                tags: "集团发文",
                url: arrurl,
                img: arrimage,
                about: null
            };
            self.$confirm("确定要发布到集团门户吗?", "提示", {
                type: "warning"
            }).then(() => {
                axios
                    .post("/api/v1/portal/article", JSON.stringify(params), {
                        headers: {
                            "Content-type": "application/json"
                        }
                    })
                    .then(res => {
                        if (res.data.error == 0) {
                            self.$message({
                                message: "发布成功",
                                type: "success"
                            });
                        }
                    })
                    .catch(function(res) {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            });
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = "";
            this.submitData = {};
            this.seleteUsers_approve = "";
            this.approve_status = false;
        },
        comment() {
            let self = this;
            axios
                .put(`/api/v1/outgoing_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    node: this.crumbNodeName
                })
                .then(res => {
                    self.$message({
                        message: self.currentAction.name + "成功",
                        type: "success"
                    });
                    self.refreshFormData();
                });
        },
        submitForm() {
            let self = this;

            //如果是驳回节点
            if (self.currentAction.type == "REJECT") {
                if (self.rejectTarget) {
                    self.submitData.rejectTarget = self.rejectTarget;
                } else {
                    self.$message.error("请选择驳回节点");
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
                .put(`/api/v1/outgoings/${self.formId}/signal`, self.submitData)
                .then(res => {
                    self.dialogVisible = false;
                    self.comment();
                    if(self.currentAction.type == 'DISPATCH'){
                        self.doDispatch();
                     }
                });
        },
        doDispatch(){
            let self = this;
             let organName = [],organId = [];
                    if(self.tableData.mainTo){
                        organName = self.tableData.mainTo.split(',');
                    }
                    if(self.tableData.copyto){
                        organName = organName.concat(self.tableData.copyto.split(","));
                    }
                    organName =  Array.from(new Set(organName));
                    axios
                        .get(`/api/v1/users/sub/organ/list`)
                        .then(res => {
                                for(let item  of res.data){
                                    for(let name of organName){
                                        if(name == item.name){
                                            organId.push(item.id);
                                        }   
                                    }
                                                        };
                         axios.post('/api/v1/outgoings/'+self.tableData.id+'/distributeMessages',{oids:organId}).then(res => {})
                    });
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        getForm() {
            const self = this;
            if (this.formId != "") {
                axios.get("/api/v1/outgoing_forms/" + this.formId).then(res => {
                    self.copyData = JSON.parse(JSON.stringify(res.data));
                    res.data.text =
                        res.data.text == null
                            ? { name: "" }
                            : JSON.parse(res.data.text);
                    // if (res.data.mainTo) {
                    //     let length_mainto = res.data.mainTo.split(",").length;
                    //     res.data.mainTo = res.data.mainTo.split(",")[
                    //         length_mainto - 1
                    //     ];
                    // }
                    // if (res.data.copyto) {
                    //     let length_copyto = res.data.copyto.split(",").length;
                    //     res.data.copyto = res.data.copyto.split(",")[
                    //         length_copyto - 1
                    //     ];
                    // }
                    self.tableData = res.data;
                });
            }
        },
        downloadFile(url) {
            this.common.download(url);
        },
        previewFile(item) {
            this.common.preview(item);
        },
        handleSuccess(data) {
            axios
                .post(`/api/v1/outgoing_forms/${this.formId}/product`, data[0])
                .then(res => {
                    this.tableData.products.push(res.data);
                });
        },
        getCrumbs() {
            axios.get(`/api/v1/outgoings/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.name;
                        if (item.assignes) {
                            if (
                                item.name == "文书" &&
                                item.assignes ==
                                    this.$store.getters.LoginData.uname
                            ) {
                                this.replaceButton = true;
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
        }
    }
};
</script>

<style lang="scss" scope>
#OutgoingDetail {
    .el-step__main {
        margin-top: 10px;
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
    .crumbList {
        margin: 15px 0px;
    }
    .tabmsg {
        display: none;
    }

    // .el-step__icon.is-icon{
    //     background: none;
    // }
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