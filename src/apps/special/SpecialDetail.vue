<template>
    <div id="SpecialDetail">
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
            <el-form ref="form" :model="tableData">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="文件名：">{{tableData.fileName}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下发时间：">{{tableData.issueDate}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="下发人：">{{tableData.issueName}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下发单位：">{{tableData.organName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="tableData.attachment && tableData.attachment.length > 0">
                            <div class="attachment" v-for="item in tableData.attachment" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                            </div>
                        </el-form-item>
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
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SpecialDetail',
    data() {
        return {
            tableData: {},
            pageType: 'show',
            actions: [],
            rejectTarget: '',
            rejectList: [],
            actions: [],
            crumb: { items: [] },
            users: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            publishsUCCESS: false
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
        if (this.formId != '') {
            this.getForm();
        }
    },
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
            } else {
                this.tableData = {};
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/super_forms/specialReport/' + this.formId)
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
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        },
        getActions() {
            let self = this;
            axios.get(`/api/v1/incomings/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
                res.data.types.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                self.actions = res.data.types;
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
                if (action.type == 'COMMIT') {
                    self.dialogVisible = true;
                    if (action.required) {
                        if (action.type == 'COMMIT') {
                            self.presign_status = true;
                            self.seleteUserLabel = '请领导批阅';
                        }
                    }
                }
                if (action.type == 'ARCHIVE') {
                    self.submitForm();
                }
            } else if ('REJECT,PRESIGN,TRANSFER'.includes(action.type)) {
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
                if (action.type == 'TRANSFER') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择加签人';
                }
            } else if ('SUPERIOR,APPROVE,SIGNOUT'.includes(action.type)) {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
            } else if ('fullScreen'.includes(action.type)) {
                this.common.open(`/#/apps/incoming/${this.formId}`);
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
                    if (comment == 'formOnlyComment') {
                        this.getCrumbs();
                        this.getForm();

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
                        `/api/v1/incomings/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        if (self.flowDomName == '拟办') {
                            self.setMemo();
                        } else {
                            self.getActions();
                            self.getForm();
                            self.getCrumbs();
                        }
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        }
    }
};
</script>
<style lang="scss" scope>
#SpecialDetail {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
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
    .attachment {
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
}
</style>