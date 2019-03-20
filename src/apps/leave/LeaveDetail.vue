<template>
    <div id="leaveDetail">
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
            <div style="text-align:right">
                <el-button type="primary" @click="cope()">打 印</el-button>
            </div>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                         <el-form-item label="流水单号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="呈报件：">
                            {{tableData.submissionName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                    </el-col> -->
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            {{rows.submitter}}
                        </td>
                        <td colspan="1">
                            <span class="span1">*</span> 所属部门
                        </td>
                        <td colspan="2">
                           {{rows.subOrganName}}
                        </td>
                        <td colspan="1">申请时间</td>
                        <td colspan="2">
                          {{rows.submitted}}
                        </td>
                    </tr>
                    <tr>
                        <!-- <td colspan="8" style="font-weight:bold;"> 出差信息</td> -->
                    </tr>
                    <tr>
                        <td colspan="1">
                            <span class="span1">*</span>申请缘由
                        </td>
                        <td colspan="7">
                            <el-input v-model="rows.reason"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>申请休假种类</td>
                        <td colspan="2">
                            {{rows.type}}
                        </td>
                        <td>拟休时间</td>
                        <td colspan="5">
                            <template>
                               {{rows.startTime}}至
                               {{rows.endTime}}
                            </template>
                            共({{rows.dateNumber}})天
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <!-- <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false"> -->
                            <span>附件上传</span>
                            <!-- </el-upload> -->
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <!-- <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i> -->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            审批意见
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id" v-show="item.action=='APPROVE'">
                                <!-- <div class="avatar">
                                    <img src="../../assets/avatar.png" alt="">
                                </div> -->
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    </div>
                                    <span>【同意】</span>
                                    <span class="content">{{item.content}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>

                </table>

            </el-form>
            <el-row v-if="tableData.comments && tableData.comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
                    <div class="items">
                        <div class="item" v-for="item in tableData.comments" :key="item.id">
                            <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                            <div class="info">
                                <div class="creator">
                                    <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
                                    <span v-show="item.action == 'APPROVE'">【同意】</span>
                                    <span v-if="item.action == 'REJECT'">【驳回】</span>
                                </div>
                                <div class="content">{{item.content}}</div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
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
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'leaveDetail',
    data() {
        return {
            subStatus: false,
            activeName: 'first',
            rows:{},
            tableData: {
                number: '',
                submitter: '',
                subOrganName: '',
                reason: '',
                evections: [],
                estimate: [],
                attachments: []
            },
            fileleng: 'show',
            actions: [],
            crumb: { items: [] },
            isEdit: false,
            editBtnText: '编辑',
            rejectTarget: '',
            rejectList: [],
            attachments: [],
            array: [],
            users: [],
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
        Comment
    },
    mounted() {
        // this.getAgree()
        this.getAllUsers();
        if (this.formId != '') {
            this.getForm();
            this.getActions();
        }
    },
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
                this.getActions();
            } else {
                this.tableData = {};
            }
        }
    },
    methods: {
        ViewDetail(view) {
            if (view == 'borrow') {
                if (
                    this.tableData.borrow.borrowId &&
                    this.tableData.borrow.borrowId != ''
                ) {
                    this.common.open(
                        '#/apps/loan/' + this.tableData.borrow.borrowId
                    );
                }
            } else if (view == 'chengbao') {
                if (this.tableData.submissionId && this.tableData.submissionId != '') {
                    this.common.open(
                        '#/apps/submission/' + this.tableData.submissionId
                    );
                }
            }
        },
        cope() {
            this.$print(this.$refs.formupdate.$el);
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        getAgree() {
            this.array = [];
            let j = -1;
            let p ;
            for (var i = 0; i < this.tableData.comments.length; i++) {
                if (this.tableData.comments[i].action == 'REJECT') {
                    j = i;
                }else if(this.tableData.comments[i].action == 'PULL'){
                    p= i;
                    j = 2;
                }
            }
            if (j == -1) {
                this.array = this.tableData.comments;
            }else if(j = 2){
                for (var a = 0; a < this.tableData.comments.length; a++) {
                    if(a == p || a == p - 1){
                         this.array =  this.array
                    }else{
                        this.array.push(this.tableData.comments[a]);
                    }
                }
            } else {
                for (var k = j + 2; k < this.tableData.comments.length; k++) {
                    this.array.push(this.tableData.comments[k]);
                }
            }
            
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/travel_forms/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                        this.getAgree();
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
            axios.get(`/api/v1/travels/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
                res.data.types.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                this.actions = res.data.types;
            });
            axios.get(`/api/v1/travels/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumbNodeName = item.name;
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                        this.crumb.index = index;
                    }
                });
            });
        },
        doComment(action) {
            this.getForm();
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();

            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }
            axios
                .put(`/api/v1/travel_forms/${this.formId}/comment`, {
                    content: comment,
                    action: action.type
                })
                .then(res => {
                    if (action.type == 'REJECT') {
                        (this.tableData.committed = ''),
                            axios.post(
                                '/api/v1/travel_forms/save',
                                JSON.stringify(this.tableData),
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            );
                    } else if (action.type == 'APPROVE') {
                        axios.put(
                            '/api/v1/travel_forms/' +
                                this.tableData.id +
                                '/commit/' +
                                this.tableData.processId,
                            '',
                            {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }
                        );
                    }

                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();
                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(`/api/v1/travels/${this.formId}/signal`, {
                                action: action.type,
                                assignees: atIds
                            })
                            .then(res => {
                                this.getActions();
                            });
                    }
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
                        .get(`/api/v1/travels/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                            self.getCrumbs();
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
                    this.seleteUserLabel = '前选择前加签人';
                }
            } else if (
                'SUPERIOR,APPROVE,SIGNOUT,REJECT,CANCEL'.includes(action.type)
            ) {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
            } else if ('fullScreen'.includes(action.type)) {
                this.common.open(`/#/apps/travels/${this.formId}`);
            }
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/travels/' + this.formId + '/reject/targets')
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
                        `/api/v1/travels/${self.formId}/signal`,
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
                .put(`/api/v1/travel_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    node: this.crumbNodeName,
                    action: self.currentAction.type
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
    }
};
</script>
<style lang="scss" scope>
#leaveDetail {
    .attachments {
        margin-left: 10px;
        width: 170px;
        // height: 80px;
        display: inline-block;
        cursor: pointer;
        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            margin-right: 20px;
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
            margin-left: 30px;
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
    #moneyright {
        text-align: right;
        padding-right: 10px;
    }
    .active {
        float: left;
        margin-right: 10px;
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
}
</style>