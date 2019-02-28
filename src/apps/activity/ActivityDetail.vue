<template>
    <div id="ActivityDetail" :class="{fullScreen:fullScreen}">
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
            <el-form ref="formupdate" :model="tableData" style="margin-top:10px;">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称：">{{tableData.title}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="开始时间：">{{tableData.time}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结束时间：">{{tableData.endTime}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="地点：">{{tableData.place}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="主题：">{{tableData.theme}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="主办方：">{{tableData.organizer}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="承办方：">{{tableData.contractors}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="活动规模：">{{tableData.scale}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="上报单位：">{{tableData.organName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联合上报单位：">{{tableData.combinedUnit}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="上级领导：">{{tableData.superiorLeader}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="集团领导：">{{tableData.groupLeader}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="公司领导：">{{tableData.companyLeader}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系人：">{{tableData.contactUser}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式：">{{tableData.contact}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="是否有外媒：">{{tableData.isMedia}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否有外宾：">{{tableData.isGuedts}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="拟邀请媒体：">{{tableData.invitation}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上传会议议程：" v-if="tableData.attachment && tableData.attachment.length > 0">
                            <!-- <div class="attachments" v-for="item in tableData.attachment" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div> -->
                            <div class="attachments" v-for="item in  tableData.attachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-show="tableData.activityReport.mediaCoverage && tableData.activityReport.mediaCoverage.length > 0">
                    <el-col>
                        <el-form-item label="媒体报道">
                            <el-table :data="tableData.activityReport.mediaCoverage" border style="width: 100%; margin-top: 20px;">
                                <el-table-column prop="name" label="媒体名称" min-width="20%" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="href" label="新闻链接" min-width="20%" align="center">
                                    <template slot-scope="scope">
                                        <a :href="scope.row.href">{{scope.row.href}}</a>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="title" label="报道题目" min-width="20%" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.title}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="date" label="报道日期" min-width="20%" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.date}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="date" label="报道附件" min-width="20%" align="center">
                                    <template slot-scope="scope">
                                        <!-- <div class="attachments" @click="downloadFile(scope.row.attachments[0])" v-if="scope.row.attachments.length > 0">
                                            <img class="el-icon-document" :src="scope.row.attachments.iconUrl">
                                            <p :title="scope.row.attachments.name">{{scope.row.attachments.name}}</p>
                                        </div> -->
                                        <div v-for="item in  scope.row.attachments" :key="item.id" style="float:left">
                                            <p :title="item.name" @click="downloadFile(item)">{{item.name}}</p>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-show="tableData.activityReport.materials && tableData.activityReport.materials.length > 0">
                    <el-col :span="24">
                        <el-form-item label="宣传物料：">
                            <!-- <div class="attachments" v-for="item in tableData.activityReport.materials" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div> -->
                            <div v-for="item in  tableData.activityReport.materials" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="tableData.activityReport.activity && tableData.activityReport.activity.length > 0">
                    <el-col :span="24">
                        <el-form-item label="活动照片：">
                            <!-- <div class="attachments" v-for="item in tableData.activityReport.activity" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div> -->
                            <div v-for="item in  tableData.activityReport.activity" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="tableData.activityReport.leader && tableData.activityReport.leader.length > 0">
                    <el-col :span="24">
                        <el-form-item label="领导讲话：">
                            <!-- <div class="attachments" v-for="item in tableData.activityReport.leader" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div> -->
                            <div v-for="item in  tableData.activityReport.leader" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tableData.activityReport.comments && tableData.activityReport.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tableData.activityReport.comments" :key="item.id">
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
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
export default {
    name: 'ActivityDetail',
    data() {
        return {
            tableData: { activityReport: { comments: [] } },
            crumb: { items: [] },
            actions: [],
            activityReportId: '',
            rejectTarget: '',
            rejectList: [],
            typesStatus: false,
            users: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: '',
            comtename:''
        };
    },
    props: ['formId'],
    watch: {
        formId: function() {
            this.getForm();
            this.getAllUsers();
            // this.getRejectList();
        }
    },
    components: {
        Comment,
        FilesOperate
    },

    methods: {
        getId(id) {},
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        getForm() {
            const self = this;
            if (self.formId != '') {
                axios
                    .get('/api/v1/activity_forms/activities/' + self.formId)
                    .then(res => {
                        if (res.data) {
                            if (res.data.activityReport == null) {
                                res.data.activityReport = { comments: [] };
                                self.actions = [];
                            } else {
                                self.tableData.activityReport.id =
                                    res.data.activityReport.id;
                                if (res.data.activityReport.id) {
                                    self.getActions(res.data.activityReport.id);
                                    self.getRejectList(
                                        res.data.activityReport.id
                                    );
                                }
                            }
                            self.tableData = res.data;
                        } else {
                            self.getactivity_forms();
                        }
                    })
                    .catch(function() {
                        // self.getactivity_forms();
                    });
            }
        },
        getactivity_forms() {
            const self = this;
            axios.get('/api/v1/activity_forms/' + self.formId).then(res => {
                if (res.data.activityReport == null) {
                    res.data.activityReport = { comments: [] };
                    self.actions = [];
                } else {
                    self.tableData.activityReport.id =
                        res.data.activityReport.id;
                    if (res.data.activityReport.id) {
                        self.getActions(res.data.activityReport.id);
                        self.getRejectList(res.data.activityReport.id);
                    }
                }
                self.tableData = res.data;
            });
        },
        getActions(id) {
            axios.get('/api/v1/activities/' + id + '/actions').then(res => {
                res.data.types = res.data.types || [];
                // if (this.tabledata.status == '已完成') {
                //     res.data.types.push({
                //         type: 'print',
                //         name: '打印'
                //     });
                // }
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
            axios.get('/api/v1/activities/' + id + '/crumb').then(res => {
                const aa = res.data;
                for(let bb of aa){
                    if(bb.active == true){
                        this.comtename = bb.name
                    }
                }
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.key;
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                        this.crumb.index = index;
                    }
                });
            });
        },
        doComment(action) {
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();

            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }
            if (action.type == 'REJECT') {
                if (this.rejectTarget == '') {
                    this.$message({
                        message: '请选择驳回节点',
                        type: 'error'
                    });
                    return false;
                }
            }
            axios
                .put(
                    '/api/v1/activity_forms/' +
                        this.tableData.activityReport.id +
                        '/comment',
                    {
                        content: comment
                    }
                )
                .then(res => {
                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();
                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(
                                '/api/v1/activities/' +
                                    this.tableData.activityReport.id +
                                    '/signal',
                                {
                                    action: action.type,
                                    assignees: atIds,
                                    rejectTarget: this.rejectTarget
                                }
                            )
                            .then(res => {
                                this.getActions(
                                    this.tableData.activityReport.id
                                );
                                if (action.type == 'TEMPLATE') {
                                    this.template();
                                }
                            });
                    }
                });
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
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
                        .get(`/api/v1/activities/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
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
            } else if (
                'SUPERIOR,APPROVE,SIGNOUT,CANCEL'.includes(action.type)
            ) {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
                this.dispatchDialog1 = true;
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
                .get('/api/v1/activities/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
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
                        `/api/v1/activities/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.comment();
                        self.dialogVisible = false;
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
                .put(`/api/v1/activity_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    node : this.comtename,
                   action: self.currentAction.type,
                })
                .then(res => {
                    if (comment == 'formOnlyComment') {
                        this.getActions();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                    this.getForm();
                });
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        }
    },
    mounted() {
        this.getForm();
        this.getAllUsers();
    }
};
</script>
<style lang="scss">
#ActivityDetail {
    .el-step__main {
        margin-top: 10px;
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
        position: relative;
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