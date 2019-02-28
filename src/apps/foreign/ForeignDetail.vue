<template>
    <div id="ForeignDetail" :class="{fullScreen:fullScreen}">
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
            <el-form :model='tabledata' class="formList">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="组团名称：">{{tabledata.groupName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="组团单位：">{{tabledata.groupOrg}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出访组团人员：">{{tabledata.visitors}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请出国（境）日期：">{{tabledata.visitTime | dateformat('YYYY-MM-DD')}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的地：">{{tabledata.visitCountry}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行程：">{{tabledata.route}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="预算：">{{tabledata.budget}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="费用来源：">{{tabledata.source}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出访目的：">{{tabledata.purpose}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="出国（境）原因：">{{tabledata.reason}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="出访必要性：">{{tabledata.necessary}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：">
                            <div v-for="item in tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="上传材料：">
                            <div v-for="item in tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="出访报告：">
                            <div v-for="item in tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
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

            <el-dialog :visible.sync="dialogUpload" width="50%" append-to-body>
                <el-row>
                    <el-col :span="24">
                        <el-form label-width="100px">
                            <el-form-item label="上传材料">
                                <el-upload name="files" class="uploadBtn" ref="upload" @click.native="attType = 'attType2'" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                    <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpload = false">取 消</el-button>
                    <el-button type="primary" @click="subAttForm()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="dialogUploadReport" width="50%" append-to-body>
                <el-row>
                    <el-col :span="24">
                        <el-form label-width="100px">
                            <el-form-item label="上传出访报告">
                                <el-upload name="files" class="uploadBtn" ref="upload" @click.native="attType = 'attType3'" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                    <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUploadReport = false">取 消</el-button>
                    <el-button type="primary" @click="subAttFormReport()">确 定</el-button>
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
    name: 'ForeignDetail',
    data() {
        return {
            tabledata: {},
            actions: [],
            crumb: { items: [] },
            actions_status: false,
            users: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            dialogUpload: false,
            dialogUploadReport: false,
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: '',
            nodename: '',
            attQd: false //判断流程中附件是否上传
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
        }
    },
    methods: {
        getId(id) {
            const self = this;
            if (this.tabledata.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/foreign_forms/deleteAtt?id=' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.tabledata.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.tabledata.attachments.splice(
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/' + this.formId)
                    .then(res => {
                        self.tabledata = res.data;
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
            axios.get(`/api/v1/foreigns/${this.formId}/actions`).then(res => {
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
            axios.get(`/api/v1/foreigns/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.nodename = item.name;
                        this.crumbNodeName = item.key;
                        this.crumb.index = index;
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                    }
                });
            });
        },
        getRejectList() {
            const self = this;
            axios
                .get('/api/v1/foreigns/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
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
                        .get(`/api/v1/foreigns/${self.formId}/pull`)
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
            } else if ('UPLOAD'.includes(action.type)) {
                //上传材料
                this.dialogUpload = true;
            } else if ('UPLOADREPORT'.includes(action.type)) {
                //上传材料
                this.dialogUploadReport = true;
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
                .put(`/api/v1/foreign_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: this.nodename,
                    node: this.nodename
                })
                .then(res => {
                    if (comment == 'formOnlyComment') {
                        this.getCrumbs();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                    this.getForm();
                });
        },
        subAttForm() {
            const self = this;
            for (let item of this.tabledata.attachments) {
                if (item.attType == 'attType2') {
                    this.attQd = true;
                }
            }
            if (this.attQd) {
                axios
                    .post(
                        '/api/v1/foreign_forms/save',
                        JSON.stringify(this.tabledata),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        this.submitForm();
                        this.dialogUpload = false;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            } else {
                self.$message({
                    message: '附件信息不能为空，请上传材料',
                    type: 'error'
                });
            }
        },
        subAttFormReport() {
            const self = this;
            for (let item of this.tabledata.attachments) {
                if (item.attType == 'attType3') {
                    this.attQd = true;
                }
            }
            if (this.attQd) {
                axios
                    .post(
                        '/api/v1/foreign_forms/save',
                        JSON.stringify(this.tabledata),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        this.submitForm();
                        this.dialogUploadReport = false;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            } else {
                self.$message({
                    message: '附件信息不能为空，请上传出访报告',
                    type: 'error'
                });
            }
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
                        `/api/v1/foreigns/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        self.getActions();
                        // self.getForm();
                        self.getCrumbs();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                        if (self.currentAction.type == 'CANCEL') {
                            self.$emit('refreshData');
                        }
                    });
            }
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        refreshFormData() {
            this.getCrumbs();
            this.getForm();
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/foreign_forms/setMemo', {
                    memo: '',
                    id: self.formId
                })
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        handleSuccess(response, file) {
            for (let item of response) {
                this.tabledata.attachments.push({
                    iconUrl: item.iconUrl,
                    id: item.id,
                    name: item.name,
                    // organId: item.organId,
                    // organName: item.organName,
                    size: item.size,
                    type: item.type,
                    // uid: item.uid,
                    // uname: item.uname,
                    url: item.url,
                    attType: this.attType
                });
            }
        }
    }
};
</script>

<style lang="scss">
#ForeignDetail {
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