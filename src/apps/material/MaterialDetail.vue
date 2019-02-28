<template>
    <div id="MaterialDetail" :class="{fullScreen:fullScreen}">
        <!--
        <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps>
        -->
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
            <el-form ref="formupdate" :model="tableData" style="margin-top:10px;">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="标题：">{{tableData.title}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报送单位：">{{tableData.reportingUnit}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分类：">{{tableData.type}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系方式：">{{tableData.contact}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人：">{{tableData.contactUser}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关键字：">{{tableData.keywords}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="简介：" style="white-space:pre-wrap;">
                            <!--
                            <el-input v-model="tableData.introduction" type="textarea" disabled :autosize="{minRows: 10}"></el-input>
                            -->
                            {{tableData.introduction}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                            <!--
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div>
                            -->
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
                <!--
            <el-row>
                <Comment ref="comment"></Comment>
                <div style="margin-top: 10px; height: 32px; position: relative;">
                    <el-button type="primary" size="small" :key="action.type" v-for="action in actions" @click="doComment(action)">{{action.name}}</el-button>
                </div>
            </el-row>
            -->
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
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
export default {
    name: 'MaterialDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumb: { items: [] },
            fullScreen: false,
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
            crumbNodeName: ''
        };
    },
    props: ['formId'],
    components: {
        Comment,
        FilesOperate
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
                this.getAllUsers();
            }
        }
    },
    methods: {
        getId(id) {},
        clearForm() {
            this.tableData = {
                title: '',
                contact: '',
                contactUser: '',
                reportingUnit: '',
                introduction: '',
                keywords: '',
                type: '',
                attachments: []
            };
            this.actions = [];
            this.crumb = {
                items: []
            };
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get(
                        '/api/v1/activity_forms/materials/' +
                            this.formId +
                            '/get'
                    )
                    .then(res => {
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
            this.common.preview(url);
        },
        getActions() {
            axios.get(`/api/v1/materials/${this.formId}/actions`).then(res => {
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
            axios.get(`/api/v1/materials/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.name;
                        this.crumb.index = index;
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
                .get('/api/v1/materials/' + this.formId + '/reject/targets')
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
        cleanForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        doAction(action) {
            this.cleanForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.cleanForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/materials/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                        });
                }
                if (action.type == 'COMMIT' && this.crumbNodeName == '申请') {
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
            } else if ('PRESIGN'.includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
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
        comment(comment) {
            let self = this;
            axios
                .put(
                    `/api/v1/activity_forms/materials/${self.formId}/comment`,
                    {
                        content: self.textarea || self.currentAction.name,
                        action: self.currentAction.type,
                        node: this.crumbNodeName
                    }
                )
                .then(res => {
                    self.getForm();
                    self.getActions();
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
                        `/api/v1/materials/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        },
        doComment(action) {
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();

            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }
            axios
                .put(
                    `/api/v1/activity_forms/materials/${this.formId}/comment`,
                    {
                        content: comment,
                        action: action.type
                    }
                )
                .then(res => {
                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();

                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(`/api/v1/materials/${this.formId}/signal`, {
                                action: action.type,
                                assignees: atIds
                            })
                            .then(res => {
                                this.getActions();
                            });
                    }
                });
        }
    }
};
</script>
<style lang="scss" >
#MaterialDetail {
    .el-step__main {
        margin-top: 10px;
    }
    /**
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
    */
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
        font-weight: bold;
        z-index: 10;
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