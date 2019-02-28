<template>
    <div id="LoanDetail">
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
                <!-- <el-row style="margin-bottom:10px">
                    <el-col :span="8">
                        流水号：{{tableData.number}}
                    </el-col>
                </el-row> -->
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                        <el-form-item label="流水单号：">
                            {{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="出差审批单：">
                            {{tableData.busNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chuchai')"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="呈报件：">
                            {{tableData.subNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <table class="tablePrint">
                    <tr>
                        <th colspan="6">基本信息</th>
                    </tr>
                    <tr>
                        <td width="10%" height="20px">提单人</td>
                        <td width="10%">
                            {{tableData.creatorName}}
                        </td>
                        <td width="10%">费用承担部门</td>
                        <td width="10%">
                            {{tableData.borrowDept}}
                        </td>
                        <td width="10%">借款时间</td>
                        <td width="10%">
                            {{tableData.borrowTime}}
                        </td>
                    </tr>
                    <tr>
                        <td width="10%" height="20px">借款人</td>
                        <td width="10%">
                            {{tableData.borrower}}
                        </td>
                        <td width="10%">开户行</td>
                        <td width="10%">
                            {{tableData.bank}}
                        </td>
                        <td width="10%">银行卡号</td>
                        <td width="10%">
                            {{tableData.cardNum}}
                        </td>
                    </tr>
                    <tr>
                        <th colspan="6">借款信息</th>
                    </tr>
                    <tr>
                        <td width="10%">借款用途</td>
                        <td width="10%">借款金额</td>
                        <td width="10%">币种</td>
                        <td width="10%">预估汇率</td>
                        <td width="10%" colspan="2">预估本币金额</td>
                    </tr>
                    <tr v-for="(Item,index) in this.tableData.borrows" :key="Item.index" @contextmenu.prevent="deleteItem(Item,index,'borrowsDetail')">
                        <td>
                            {{Item.bigType}} {{Item.centreType}} {{Item.smallType}}
                        </td>
                        <td>
                            {{Item.loanAmount}}
                        </td>
                        <td>
                            {{Item.currency}}
                        </td>
                        <td>
                            {{Item.estimateRate}}
                        </td>
                        <td colspan="2">
                            {{Item.estimateDomestic}}
                        </td>

                    </tr>
                    <tr>
                        <td colspan="6">
                        </td>
                    </tr>
                    <tr>
                        <td width="10%" colspan="2">金额合计</td>
                        <td>
                            <!-- {{tableData.total}}￥ -->
                            <el-row>
                                <el-col :span="4" align="left" style="margin-left:5px">{{this.dollar}}</el-col>
                                <el-col :span="18" align="right" style="margin-right:5px">{{tableData.total}}</el-col>
                            </el-row>
                        </td>
                        <td>
                            金额大写
                        </td>
                        <td colspan="2">
                            （{{this.dollarName}}：&nbsp;&nbsp;{{tableData.dx}}&nbsp;&nbsp;)
                        </td>
                    </tr>
                    <tr>
                        <td width="10%" colspan="2">结算方式</td>
                        <td colspan="4">
                            {{tableData.settlement}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">附件上传
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">领导审批
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id" v-show="item.action == 'APPROVE'">
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
            <el-row v-show="this.tableData.comments && this.tableData.comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="audit" v-for="item in this.tableData.comments" :key="item.id">
                        <div class="avatar">
                            <img src="../../assets/avatar.png" alt="">
                        </div>
                        <div class="info">
                            <div class="creator">
                                <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                <span v-show="item.action == 'APPROVE'">【同意】</span>
                                <span v-if="item.action == 'REJECT'">【驳回】</span>
                            </div>
                            <div class="content">{{item.content}}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
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
import { CURRENCY, CONFIG } from '../data.js';
export default {
    name: 'LoanDetail',
    data() {
        return {
            dollar: '￥', //币符
            dollarName: '￥', //币中名称
            options: CURRENCY['currency'],
            Mycomment: CONFIG['comment'],
            array: [],
            activeName: 'first',
            tableData: {
                dx: ''
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
            nodename: ''
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
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
        ViewDetail(view) {
            if (view == 'chuchai') {
                this.common.open('#/apps/travel/' + this.tableData.busId);
            } else if (view == 'chengbao') {
                // if (this.rows.submissionId && this.rows.submissionId != '') {
                this.common.open('#/apps/submission/' + this.rows.submissionId);
                // }
            }
        },
        getAgree() {
            this.array = [];
            let j = -1;
            let p;
            for (var i = 0; i < this.tableData.comments.length; i++) {
                if (this.tableData.comments[i].action == 'REJECT') {
                    j = i;
                } else if (this.tableData.comments[i].action == 'PULL') {
                    p = i;
                    j = 2;
                }
            }
            if (j == -1) {
                this.array = this.tableData.comments;
            } else if ((j = 2)) {
                for (var a = 0; a < this.tableData.comments.length; a++) {
                    if (a == p || a == p - 1) {
                        this.array = this.array;
                    } else {
                        this.array.push(this.tableData.comments[a]);
                    }
                }
            } else {
                for (var k = j + 2; k < this.tableData.comments.length; k++) {
                    this.array.push(this.tableData.comments[k]);
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
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios.get(`/api/v1/loans/${self.formId}/pull`).then(res => {
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
                            self.seleteUserLabel = '请选择拟办人';
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
            } else if ('fullScreen'.includes(action.type)) {
                this.common.open(`/#/apps/loan/${this.formId}`);
            } else {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
            }
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/loans/' + this.formId + '/reject/targets')
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
                // if (self.currentAction.type == 'REJECT') {
                //     if (self.seleteUsers) {
                //         self.submitData.rejectTarget = self.rejectTarget;
                //     } else {
                //         self.$message.error('请选择驳回节点');
                //         return false;
                //     }
                // }

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
                    .put(`/api/v1/loans/${self.formId}/signal`, self.submitData)
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        // self.getForm();
                        self.getActions();
                        self.getCrumbs();
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
                .put(`/api/v1/loan_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
                    node: this.nodename
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
        },
        //合计金额计算
        totalPayment() {
            let sum = 0;
            for (let data of this.tableData.borrows) {
                //根据预估本币金额计算
                // sum += parseFloat(data.estimateDomestic);
                //根据借款金额计算
                sum += parseFloat(data.loanAmount);
            }
            this.tableData.total = sum;
            this.tableData.dx = this.common.DX(sum);
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/loan_forms/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                        if (this.tableData.total) {
                            this.totalPayment();
                        }
                        for (let item of this.options) {
                            if (
                                res.data.borrows &&
                                res.data.borrows.length > 0
                            ) {
                                if (
                                    item.label == res.data.borrows[0].currency
                                ) {
                                    this.dollar = item.dollar;
                                    this.dollarName = item.value;
                                }
                            }
                        }
                        self.getAgree();
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
            let self = this;
            axios.get(`/api/v1/loans/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
                res.data.types.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                self.actions = res.data.types;
            });
        },
        getCrumbs() {
            axios.get(`/api/v1/loans/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.nodename = item.name;
                        this.crumb.index = index;
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                    }
                });
            });
        },
        editForm() {
            if (this.isEdit == true) {
                this.saveForm();
                this.editBtnText = '编辑';
            } else {
                this.editBtnText = '保存';
            }
            this.isEdit = !this.isEdit;
        },
        content() {
            const contents = this.tableData.content;
            axios.post(
                '/api/v1/loan_forms/update/' +
                    this.formId +
                    '?content=' +
                    contents
            );
        },
        content2() {
            const content2 = this.tableData.content2;
            axios.post(
                '/api/v1/loan_forms/update2/' +
                    this.formId +
                    '?content&content2=' +
                    content2
            );
        },
        saveForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/loan_forms/save',
                    JSON.stringify(this.tableData),
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
        // handleSuccess(response, file) {
        //     const self = this;
        //     if (response.length > 0) {
        //         response.forEach(function(item) {
        //             self.tableData.attachments.push(item);
        //         });
        //     }
        // },
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
                            .delete('/api/v1/outgoing_forms/deleteAtt', id, {
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
<style lang="scss">
#LoanDetail {
    .el-step__main {
        margin-top: 10px;
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
        margin-right: 30px;
        width: 200px;
        display: inline-block;
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
    .active {
        float: left;
        margin-right: 10px;
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
</style>