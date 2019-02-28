<template>
    <div id="PartyMeetingDetail" :class="{fullScreen:fullScreen}">
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
            <el-form :model='tabledata' class="formList">
                <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                    <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
                </el-steps>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="党委会编号：">
                            {{tabledata.numbers}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文件标题：">
                            {{tabledata.title}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="拟稿单位：">
                            {{tabledata.draftUnit}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="拟稿时间：">
                            {{tabledata.draftTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="拟稿人：">
                            {{tabledata.drafter}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话：">
                            {{tabledata.phone}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="正文：">
                            <FilesOperate v-if="tabledata.text.name" :item="tabledata.text" :options="{preview:true,download:true,edit:true}" @editText="editText"></FilesOperate>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            {{tabledata.remarks}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="文件内容：">{{tabledata.content}}
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="议题：">
                            <div class="squ" v-for="(item,index) in tabledata.meetingTasks" :key="item.id" style="margin-left:60px;">
                                <div style="font-weight:bold">{{index+1}}. {{item.title}}</div>
                                <div>{{item.content}}</div>
                                <div v-for="item in item.product" :key="item.id" style="text-align: center;">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="出席:">{{tabledata.attend}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列席:">{{tabledata.delegate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="记录:">{{tabledata.writer}}
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="分送:">{{tabledata.distribute}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="tabledata.attachments && tabledata.attachments.length > 0">
                            <div v-for="item in tabledata.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tabledata.comments && tabledata.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tabledata.comments" :key="item.id">
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
                            <el-input type="textarea"  placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <PartymeetingFiles @editWordData="editWordData" ref="partymeetingfiles"></PartymeetingFiles>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import PartymeetingFiles from './PartymeetingFiles';
export default {
    name: 'PartyMeetingDetail',
    data() {
        return {
            tabledata: {
                text: { name: '' }
            },
            fullScreen: false,
            isEdit: false,
            editBtnText: '编辑',
            crumbNodeName: '',
            actions: [],
            crumb: { items: [] },
            users: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            copyData: {},
            editbtn: false
        };
    },
    props: ['formId'],
    mounted() {
        this.getForm();
        if (this.formId != '') {
            this.getActions();
            this.getCrumbs();
            this.getAllUsers();
            // this.getRejectList();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            if (this.formId != '') {
                this.getCrumbs();
                this.getActions();
                this.getAllUsers();
            } else {
                this.tabledata = {};
            }

            // this.getRejectList();
        }
    },
    components: {
        Comment,
        FilesOperate,
        PartymeetingFiles
    },
    methods: {
        getId(id) {
            let self = this;
            self.$confirm('是否删除,删除后将无法找回?', '提示', { type: 'warning' }).then(() => {
                self.tabledata.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/party_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.tabledata.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        editWordData(data) {
            if (!data.url) {
                return false;
            }
            this.tabledata.text = {
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
            this.$refs.partymeetingfiles.clearTime();
        },
        editText(data) {
            if (data == 'createNewDoc') {
                this.$refs.partymeetingfiles.openData('');
            } else {
                this.$refs.partymeetingfiles.openData(this.tabledata.text.url);
            }
        },
        saveForm() {
            const self = this;
            self.tabledata.text =
                typeof self.tabledata.text == 'string'
                    ? self.tabledata.text
                    : JSON.stringify(self.tabledata.text);
            axios
                .post('/api/v1/party_meeting_forms/save', self.tabledata)
                .then(res => {
                    self.tabledata.text = res.data.text
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/party_meeting_forms/' + this.formId)
                    .then(res => {
                        self.copyData = JSON.parse(JSON.stringify(res.data));
                        res.data.text = res.data.text
                            ? JSON.parse(res.data.text)
                            : { name: '' };
                        self.tabledata = res.data;
                        if (self.tabledata.receiptDate) {
                            self.tabledata.receiptDate = moment(
                                self.tabledata.receiptDate
                            ).format('YYYY-MM-DD');
                        }
                    })
                    .catch(function() {
                        // self.$message({
                        //     message: "操作失败",
                        //     type: "error"
                        // });
                    });
            }
        },

        downloadFile(item) {
            window.open(item.url, '_blank');
            //  this.common.preview(item);
        },

        getActions() {
            let self = this;
            axios
                .get(`/api/v1/party_meetings/${this.formId}/actions`)
                .then(res => {
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
                    self.actions = res.data.types;
                });
        },
        getCrumbs() {
            axios
                .get(`/api/v1/party_meetings/${this.formId}/crumb`)
                .then(res => {
                    this.crumb = { items: res.data, index: -1 };
                    res.data.forEach((item, index) => {
                        if (item.active) {
                            this.crumbNodeName = item.name;
                            if (item.assignes) {
                                if (
                                    item.name == '套红' &&
                                    item.assignes ==
                                        this.$store.getters.LoginData.uname
                                ) {
                                    this.editbtn = true;
                                }
                                item.name =
                                    item.name + '(' + item.assignes + ')';
                            }
                            this.crumb.index = index;
                        }
                    });
                });
        },
        getRejectList() {
            let self = this;
            axios
                .get(
                    '/api/v1/party_meetings/' + this.formId + '/reject/targets'
                )
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
        template() {
            const self = this;
            axios({
                method: 'get',
                url: '/api/v1/party_meeting_forms/' + this.formId + '/template',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: [
                    function(data) {
                        let ret = '';
                        for (let it in data) {
                            ret +=
                                encodeURIComponent(it) +
                                '=' +
                                encodeURIComponent(data[it]) +
                                '&';
                        }
                        return ret;
                    }
                ]
            }).then(res => {
                self.comment('formOnlyComment');
            });
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'DISPATCH') {
                    self.submitForm();
                }
                if (action.type == 'TEMPLATE') {
                    this.template();
                }
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/party_meetings/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                            self.getCrumbs();
                        });
                }
                if (action.type == 'COMMIT' && this.crumbNodeName == '拟稿') {
                    this.submitForm();
                } else {
                    if (action.type == 'COMMIT') {
                        self.dialogVisible = true;
                        if (action.required) {
                            if (action.type == 'COMMIT') {
                                self.presign_status = true;
                                self.seleteUserLabel = '请选择拟办人';
                            }
                        }
                    }
                }
            } else if ('REJECT,PRESIGN'.includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '前选择前加签人';
                }
            } else if ('fullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'closeFullScreen',
                    name: '关闭全屏'
                });
                this.fullScreen = true;
                //this.common.open(`/#/apps/annos/${this.formId}`);
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
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.seleteUsers = [];
            this.rejectTarget = '';
            this.textarea = '';
            this.submitData = {};
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/party_meeting_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
                    node: this.crumbNodeName
                })
                .then(res => {
                    self.getActions();
                    self.getForm();
                    self.getCrumbs();
                    if (comment == 'formOnlyComment') {
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                });
        },
        submitForm() {
            let self = this;
            // 点击分发动作时的获取分发人员的id
            let distributeArray = self.tabledata.distribute
                ? self.tabledata.distribute.split(',')
                : [];
            let diapatcherId = [];
            for (var i = 7; i <= 21; i++) {
                diapatcherId.push(i);
            }
            for (let data of distributeArray) {
                if (data != '集团领导') {
                    for (let dataname of this.users) {
                        if (dataname.name == data) {
                            diapatcherId.push(dataname.id);
                        }
                    }
                }
            }
            //如果是不需要走流程的节点
            if (
                'SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT'.includes(
                    self.currentAction.type
                )
            ) {
            } else {
                //退回
                if (self.currentAction.type == 'REJECT') {
                    if (self.rejectTarget != '') {
                        self.submitData.rejectTarget = self.rejectTarget;
                    } else {
                        self.$message.error('请选择驳回节点');
                        return false;
                    }
                }
                if (self.currentAction.type == 'DISPATCH') {
                    self.submitData.partAssigneesList = diapatcherId;
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
                axios
                    .put(
                        `/api/v1/party_meetings/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                        self.$emit('refreshData');
                    });
            }
        }
    }
};
</script>
<style lang="scss">
#PartyMeetingDetail {
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
