<template>
    <div id="fundplanplanpDetail" :class="{fullScreen:fullScreen}">
        <!-- <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div> -->
        <div class="formContent">
            <!-- <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
            </el-steps> -->
            <el-form :model='tabledata' class="formList">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="来文机关：">{{tabledata.organ}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="来文字号：">{{tabledata.wordNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="份数：">{{tabledata.numberCopies}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收文编号：">{{tabledata.receiptNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收文日期：">{{tabledata.receiptDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="紧急程度：">{{tabledata.emergencyLevel}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收文类型：">{{tabledata.type}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="公文标题：">{{tabledata.title}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tabledata.memo">
                    <el-col :span="24">
                        <el-form-item label="便签：">{{tabledata.memo}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：">
                            <div class="attachments" v-for="item in tabledata.attachments" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
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
                        <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="textarea">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
// import PdfJs from "../PdfJs";
export default {
    name: 'fundplanplanpDetail',
    data() {
        return {
            tabledata: {},
            isEdit: false,
            editBtnText: '编辑',
            actions: [],
            flowDomName: '',
            crumb: { items: [] },
            item_status: {},
            actions_status: false,
            options_harry: [
                {
                    value_harryy: 'option1',
                    label_xwfx: '一般'
                },
                {
                    value_harryy: 'option2',
                    label_xwfx: '较急'
                },
                {
                    value_harryy: 'option3',
                    label_xwfx: '急'
                },
                {
                    value_harryy: 'option4',
                    label_xwfx: '特急'
                }
            ],
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
            fullScreen: false,
            crumbNodeName: ''
        };
    },
    props: ['formId'],
    mounted() {
        this.getForm();
        if (this.formId != '') {
            this.getForm();
            this.getCrumbs();
            this.getActions();
            this.getAllUsers();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            this.getCrumbs();
            this.getActions();
            this.getAllUsers();
        }
    },
    components: {
        Comment
        // PdfJs
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/incoming_forms/' + this.formId)
                    .then(res => {
                        self.tabledata = res.data;
                        if (self.tabledata.receiptDate) {
                            self.tabledata.receiptDate = moment(
                                self.tabledata.receiptDate
                            ).format('YYYY-MM-DD');
                        }
                        if (
                            self.tabledata.type &&
                            self.tabledata.type == 'superior'
                        ) {
                            self.tabledata.type = '上级阅知性文件';
                        } else if (
                            self.tabledata.type &&
                            self.tabledata.type == 'group'
                        ) {
                            self.tabledata.type = '集团收文批办';
                        } else if (
                            self.tabledata.type &&
                            self.tabledata.type == 'copy'
                        ) {
                            self.tabledata.type = '抄送待阅文件';
                        } else if (
                            self.tabledata.type &&
                            self.tabledata.type == 'childcom'
                        ) {
                            self.tabledata.type = '子公司来文';
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        getActions() {
            let self = this;
            axios.get(`/api/v1/incomings/${this.formId}/actions`).then(res => {
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
            axios.get(`/api/v1/incomings/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.name;
                        this.crumb.index = index;
                        this.flowDomName = item.name == '拟办' ? '拟办' : '';
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                    }
                });
            });
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/incomings/' + this.formId + '/reject/targets')
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
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/incomings/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                            self.getCrumbs();
                        });
                }
                if (
                    action.type == 'COMMIT' &&
                    this.crumbNodeName == '收文登记'
                ) {
                    this.submitForm();
                } else {
                    if (action.type == 'COMMIT') {
                        self.dialogVisible = true;
                        if (action.required) {
                            if (action.type == 'COMMIT') {
                                self.presign_status = true;
                                self.seleteUserLabel = '请领导批阅';
                            }
                        }
                    }
                }
                if (action.type == 'ARCHIVE') {
                    self.submitForm();
                }
            } else if (
                'REJECT,PRESIGN,PERSIGN,TRANSFER'.includes(action.type)
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
                if (action.type == 'TRANSFER') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择加签人';
                }
            } else if ('SUPERIOR,APPROVE,SIGNOUT'.includes(action.type)) {
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
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/incoming_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name
                })
                .then(res => {
                    self.getForm();
                    self.getActions();
                    self.getCrumbs();
                });
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/incoming_forms/setMemo', {
                    memo: '',
                    id: self.formId
                })
                .then(res => {
                    console.log(res);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitForm() {
            let self = this;

            //如果是不需要走流程的节点
            if (
                'SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT'.includes(
                    self.currentAction.type
                )
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
                        `/api/v1/incomings/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        if (self.flowDomName == '拟办') {
                            self.setMemo();
                        }
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        },
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        refreshFormData() {
            this.getCrumbs();
            this.getForm();
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/incoming_forms/setMemo', {
                    memo: '',
                    id: self.formId
                })
                .then(res => {
                    self.getActions();
                    self.getForm();
                    self.getCrumbs();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scope>
#fundplanplanpDetail {
    .el-step__main {
        margin-top: 10px;
    }
    .attachments {
        margin-left: 10px;
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
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
