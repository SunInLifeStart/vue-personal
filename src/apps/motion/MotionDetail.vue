<template>
    <div id="MotionDetail" :class="{fullScreen:fullScreen}">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
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
                    <el-tab-pane label="正文(子公司上报三会原文)" name="first"></el-tab-pane>
                    <el-tab-pane label="正文(部门三会呈报文件)" name="third" v-if="thirdNavShow"></el-tab-pane>
                </el-tabs>
            </div>
            <el-form ref="formupdate" :model="tableData" style="margin-top:10px;">
                <el-row>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="标题：">{{tableData.title}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="文件编号：">{{tableData.fileNo}}</el-form-item>
                    </el-col>
                    <el-row v-if="activeName == 'first' ">
                        <!-- <div style="border:0px solid #ccc;text-align:left;padding:20px 0 0">
                            <PdfJs :pdfUrl="tableData.text.pdfUrl" />
                        </div> -->
                        <el-form-item label="">
                            <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true,edit:tabNav2Edit}" @getId="getId" @editText="editText" @getReviseData="getReviseData"></FilesOperate>
                        </el-form-item>
                    </el-row>
                    <el-col :span="8" v-if="activeName == 'third'">
                        <div>
                            <el-button type="primary" @click="editText('createNewDoc')" v-if="!tableData.text2 && thirdNavButton">新建呈报文件</el-button>
                            <FilesOperate v-if="tableData.text2 && tableData.text2.name" :item="tableData.text2" :options="{preview:true,download:true,edit:tabNav2Edit}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="拟稿单位：">{{tableData.organName}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="拟稿时间：">{{tableData.draftTime}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="拟稿人：">{{tableData.creatorName}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="电话 ：">{{tableData.telephone}}</el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="activeName == 'second' ">
                        <el-form-item label="共同发起人：">{{tableData.commonUser }}</el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="activeName == 'second' ">
                        <el-form-item label="正文（子公司上报三会原文）：">
                            <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </el-form-item>
                        <!-- <el-form-item label="正文：">
                            <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </el-form-item> -->

                        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="正文(子公司上报三会原文)" name="first"> -->
                        <!-- <el-form-item label="">
                                    <el-input @blur="content()" type="textarea" :autosize="{minRows: 2}" v-model="tableData.content"></el-input>
                                </el-form-item> -->
                        <!-- <el-form-item label="">
                                    <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                                </el-form-item>
                            </el-tab-pane> -->
                        <!-- <el-tab-pane label="正文(部门三会呈报文件)" name="second" > -->
                        <!-- v-if="this.organshow" -->
                        <!-- <el-form-item label="">
                                    <el-input @blur="content2()" :autosize="{minRows: 2}" type="textarea" v-model="tableData.content2" :disabled="this.showdisab"></el-input>
                                </el-form-item> -->
                        <!-- <el-form-item label="">
                                    <FilesOperate v-if="tableData.text.name" :item="tableData.text" :options="{preview:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                                </el-form-item>
                            </el-tab-pane> -->
                        <!-- </el-tabs> -->
                    </el-col>
                    <el-col :span="24" v-if="activeName == 'second' ">
                        <el-form-item label="备注：">
                            <!-- {{tableData.remarks}} -->
                            <el-input @blur="saveForm()" type="textarea" :autosize="{minRows: 2}" v-model="tableData.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="activeName == 'second' ">
                        <el-form-item label="附件：">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false" v-if="isEdit == true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tableData.comments && tableData.comments.length > 0 && activeName == 'second' ">
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
        </div>
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
                <el-form-item label="审批意见">
                    <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="textarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>
        <MotionditFiles ref="motionditfiles" @editWordData="editWordData"></MotionditFiles>
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import PdfJs from '../PdfJs';
import MotionditFiles from './MotionditFiles.vue';
export default {
    name: 'MotionDetail',
    data() {
        return {
            activeName: 'second',
            tableData: {
                content: '',
                text: {
                    name: ''
                }
            },
            fileleng: 'show',
            actions: [],
            crumb: { items: [] },
            isEdit: false,
            editBtnText: '编辑',
            rejectTarget: '',
            rejectList: [],
            attachments: [],
            users: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            organshow: false,
            showdisab: true,

            tabNav2Edit: false,
            tabNav3Edit: false,
            thirdNavShow: false,
            thirdNavButton: true,
            fullScreen: false,
            crumbNodeName: '',
            commname:''
        };
    },
    props: ['formId'],
    components: {
        Comment,
        FilesOperate,
        PdfJs,
        MotionditFiles
    },
    mounted() {
        this.getForm();
        if (this.formId != '') {
            this.getActions();
            this.getAllUsers();
        }
    },
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
                this.getActions();
            } else {
                this.tableData = {
                    content: '',
                    text: {
                        name: ''
                    }
                };
            }
        }
    },
    methods: {
        editWordData(data) {
            if (!data.url) {
                return false;
            }
            if (this.activeName == 'third') {
                this.tableData.text2 = {
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
            } else {
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
            }
            this.$refs.motionditfiles.clearTime();
        },
        editText(data) {
            if (data == 'createNewDoc') {
                this.$refs.motionditfiles.openData('');
            } else {
                this.$refs.motionditfiles.openData(this.tableData.text.url);
            }
        },
        getId(id) {},
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
                                    '/api/v1/motion_forms/deleteAtt?id=' +
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/motion_forms/' + this.formId)
                    .then(res => {
                        res.data.text =
                            res.data.text == null
                                ? { name: '' }
                                : JSON.parse(res.data.text);
                        res.data.text2 = res.data.text2
                            ? JSON.parse(res.data.text2)
                            : '';
                        self.tableData = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        getActions() {
            axios.get(`/api/v1/motions/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
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
                this.actions = res.data.types;
            });
            axios.get(`/api/v1/motions/${this.formId}/crumb`).then(res => {
                // for (let item of res.data) {
                //     if(item.active == true){
                //         if(item.name == '选择相关部门长'){
                //               this.tabNav2Edit = true;
                //         }
                //         if(item.name == '修改议案'){
                //               this.thirdNavShow = true;
                //               this.tabNav2Edit = true;
                //               this.tabNav3Edit = true;
                //         }
                //         // if(item.name == '修改议案'){
                //         //     this.organshow = true;
                //         //     this.showdisab = false
                //         // }else if(item.name == '归口部门长' || item.name == '主管副总会签' || item.name == '总经理' || item.name == '董事长'){
                //         //     this.organshow = true;
                //         //     this.showdisab = true
                //         // }else{
                //         //     this.organshow = false;
                //         //     this.showdisab = true
                //         // }

                //     }
                // }
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.commname = item.name,
                        this.crumbNodeName = item.key;
                        this.crumb.index = index;
                    }
                });
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].active) {
                        if (
                            res.data[i].name == '选择相关部门长' &&
                            res.data[i].assignes ==
                                this.$store.getters.LoginData.uname
                        ) {
                            this.tabNav2Edit = true;
                        } else {
                            this.tabNav2Edit = false;
                        }
                        if (
                            res.data[i].name == '修改议案' &&
                            res.data[i].assignes ==
                                this.$store.getters.LoginData.uname
                        ) {
                            this.thirdNavShow = true;
                            this.tabNav2Edit = true;
                            this.tabNav3Edit = true;
                        }else if(res.data[i].name == '部长' || res.data[i].name == '主管副总会签'||  res.data[i].name == '总经理' || res.data[i].name == '董事长'){
                            this.thirdNavShow = true;
                        }
                        if (
                            JSON.stringify(
                                res.data.concat().slice(0, i + 1)
                            ).indexOf('归口部门长') > -1
                        ) {
                            this.tabNav2Edit = false;
                            this.tabNav3Edit = false;
                            this.thirdNavShow = true;
                            this.thirdNavButton = false;
                        }

                        if (res.data[i].assignes) {
                            res.data[i].name =
                                res.data[i].name +
                                '(' +
                                res.data[i].assignes +
                                ')';
                            this.crumb.index = i;
                        }
                    }
                }
            });
            // this.getRejectList();
        },
        /**
        doComment(action) {
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();

            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }
            axios
                .put(`/api/v1/motion_forms/${this.formId}/comment`, {
                    content: comment,
                    action: action.type
                })
                .then(res => {
                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();
                   
                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(`/api/v1/motions/${this.formId}/signal`, {
                                action: action.type,
                                // assignees: atIds,
                               
                            })
                            .then(res => {
                                this.getActions();
                            });
                    }
                });
        }, */
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/motions/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                            self.getForm();
                            //self.getCrumbs();
                        });
                }
                if (
                    action.type == 'COMMIT' &&
                    this.crumbNodeName == 'Task_01'
                ) {
                    this.submitForm();
                } else if (action.type == 'COMMIT') {
                    this.dialogVisible = true;
                }
            } else if (
                'PERSIGN,COUNTERSIGN,SUPERIOR,PRESIGN'.includes(
                    action.type
                )
            ) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PERSIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
                }
                if (action.type == 'COUNTERSIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择会签人';
                }
                if (action.type == 'SUPERIOR') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择主管领导';
                }
            } else if (
                'SUPERIOR,APPROVE,SIGNOUT,REVIEW'.includes(action.type)
            ) {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
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
            } else {
                this.dialogVisible = true;
            }
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/motions/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        submitForm() {
            let self = this;

            //如果是不需要走流程的节点
            if (
                'SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT'
                    .split(',')
                    .includes(self.currentAction.type)
            ) {
            } else {
                //退回
                if (self.currentAction.type == 'REJECT') {
                    if (self.seleteUsers) {
                        self.submitData.rejectTarget = self.rejectTarget;
                    } else {
                        self.$message.error('请选择驳回节点');
                        return false;
                    }
                }
                if (self.currentAction.type == 'COUNTERSIGN') {
                    if (self.seleteUsers.length > 0) {
                        self.submitData['assigneeList'] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                if (self.currentAction.type == 'PRESIGN') {
                    if (self.seleteUsers.length > 0) {
                        self.submitData['assigneeList'] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                if (self.currentAction.type == 'SUPERIOR') {
                    if (self.seleteUsers.length > 0) {
                        self.submitData['assigneeList'] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                //前加签
                if (self.currentAction.required) {
                    if (self.seleteUsers.length > 0) {
                        var key = self.currentAction.required[0].split(':')[0];
                        self.submitData[key] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                self.submitData.action = self.currentAction.type;
                self.saveForm();
                axios
                    .put(
                        `/api/v1/motions/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        // self.getForm();
                        self.getActions();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/motion_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    node: this.commname,
                    action: self.currentAction.type,
                })
                .then(res => {
                    this.getForm();
                    if (comment == 'formOnlyComment') {
                        this.getActions();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                });
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        /*editForm() {
            if (this.isEdit == true) {
                this.saveForm();
                this.editBtnText = '编辑';
            } else {
                this.editBtnText = '保存';
            }
            this.isEdit = !this.isEdit;
        },*/
        content() {
            const contents = this.tableData.content;
            axios.post(
                '/api/v1/motion_forms/update/' +
                    this.formId +
                    '?content=' +
                    contents
            );
        },
        content2() {
            const content2 = this.tableData.content2;
            axios.post(
                '/api/v1/motion_forms/update2/' +
                    this.formId +
                    '?content&content2=' +
                    content2
            );
        },
        saveForm() {
            const self = this;
            self.tableData.text =
                typeof self.tableData.text == 'string'
                    ? self.tableData.text
                    : JSON.stringify(self.tableData.text);
            if (self.tableData.text2) {
                self.tableData.text2 =
                    typeof self.tableData.text2 == 'string'
                        ? self.tableData.text2
                        : JSON.stringify(self.tableData.text2);
            }
            axios
                .post(
                    '/api/v1/motion_forms/update/' + self.tableData.id,
                    JSON.stringify(self.tableData),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', {
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachments.push(item);
                });
            }
        },
        openDialog(type) {
            this.toType = type;
            if (this.$refs['orgTree']) {
                this.$refs['orgTree'].setCheckedNodes([]);
            }
            this.dialogDisabled = true;
        },
        getCheckedNodes(type) {
            const checkNodes = this.$refs['orgTree'].getCheckedNodes();
            let tmpArray = [];
            checkNodes.forEach(function(node) {
                if (
                    !node.children ||
                    (node.children && node.children.length == 0)
                ) {
                    tmpArray.push(node.label);
                }
            });
            if (this.toType == 'mainTo') {
                this.tableData.mainTo = tmpArray.join(',');
            } else {
                this.tableData.copyto = tmpArray.join(',');
            }
        },
        deleteAttachment(id) {
            const self = this;
            if (this.tableData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .delete('/api/v1/motion_forms/deleteAtt', id, {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
                            .then(res => {
                                self.tableData.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.tableData.attachments.splice(
                                            index,
                                            1
                                        );
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
        },
        handleClick() {}
    }
};
</script>
<style lang="scss" scope>
#MotionDetail {
    // .attachments {
    //     margin-left: 10px;
    //     width: 100px;
    //     height: 120px;
    //     text-align: center;
    //     display: inline-block;
    //     border: 1px solid #c0c4cc;
    //     border-radius: 2px;
    //     cursor: pointer;
    //     img {
    //         width: 100px;
    //         height: 120px;
    //     }
    //     p {
    //         margin: 0;
    //         line-height: 15px;
    //         color: #606266;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         white-space: nowrap;
    //     }
    // }
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
    .fujian-img {
        width: 120px;
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
    .crumbList {
        margin: 15px 0px;
    }
    .el-step__main {
        margin-top: 10px;
    }

    .tabmsg {
        display: none;
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