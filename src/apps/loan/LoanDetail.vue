<template>
    <div id="LoanDetail">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>

            </el-row>
        </div>
        <div class="formContent" style="margin-top: 10px;">
            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" @click="getFlowNode" v-show="this.tableData.status && this.tableData.status != '04'">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.key" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate" id='queryTable' style="height:100%">
                <h4 style="text-align: center;">借款申请单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>
                <el-row style="margin-top: 25px;vertical-align: middle; line-height: 34px;">
                    <el-col :span="9">
                        <span class="bolder" style="margin-left:5px;">流水单号</span> ：{{tableData.number}}
                    </el-col>
                    <el-col :span="8">
                        <span class="bolder">出差审批单：</span>
                        <span :class="{titlename:tableData.travelView}" @click="ViewDetail('chuchai')">{{tableData.busNo}}</span>
                    </el-col>
                    <!-- <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.travelView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chuchai')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.travelView == false">
                            <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                        </el-tooltip>
                    </el-col> -->
                    <el-col :span="7">
                        <span class="bolder">呈报件：</span>
                        <span :class="{titlename:tableData.subView}" @click="ViewDetail('chengbao')">{{tableData.subNo}}</span>
                    </el-col>
                    <!-- <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.subView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.subView == false">
                            <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                        </el-tooltip>
                    </el-col> -->
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <tr>
                        <th class="bolder" colspan="6">基本信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">提单人</td>
                        <td width="10%">
                            {{tableData.creatorName}}
                        </td>
                        <td class="bolder" width="10%">费用承担部门</td>
                        <td width="10%">
                            {{tableData.borrowDept}}
                        </td>
                        <td class="bolder" width="10%">借款时间</td>
                        <td width="10%">
                            {{tableData.borrowTime}}
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">借款人</td>
                        <td width="10%">
                            {{tableData.borrower}}
                        </td>
                        <td class="bolder" width="10%">开户行</td>
                        <td width="10%">
                            {{tableData.bank}}
                        </td>
                        <td class="bolder" width="10%">银行卡号</td>
                        <td width="10%">
                            {{tableData.cardNum}}
                        </td>
                    </tr>
                    <tr>
                        <th class="bolder" colspan="6">借款信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%">借款用途</td>
                        <td class="bolder" width="10%">借款金额</td>
                        <td class="bolder" width="10%">币种</td>
                        <td class="bolder" width="10%">预估汇率</td>
                        <td class="bolder" width="10%" colspan="2">预估本币金额</td>
                    </tr>
                    <tr v-for="(Item) in this.tableData.borrows" :key="Item.index">
                        <td>
                            {{Item.bigType}}
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
                        <td class="bolder" width="10%" colspan="2">金额合计</td>
                        <td>
                            <!-- {{tableData.total}}￥ -->
                            <el-row>
                                <el-col :span="4" align="left" style="margin-left:5px">{{tableData.symbol}}</el-col>
                                <el-col :span="18" align="right" style="margin-right:5px">{{tableData.total}}</el-col>
                            </el-row>
                        </td>
                        <td class="bolder">
                            金额大写
                        </td>
                        <td colspan="2">
                            （{{this.tableData.borrows.length ==0 ? '人民币': this.tableData.borrows[0].currency}}：&nbsp;&nbsp;{{tableData.moneyUpper}}&nbsp;&nbsp;)
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                    </tr>
                    <tr>
                        <td>
                            是否资金计划内
                        </td>
                        <td colspan="3">
                            {{tableData.fundPlan ? '是': '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{tableData.est ? '是': '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" class="fontBold">借款信息</td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" colspan="2">结算方式</td>
                        <td colspan="4">
                            {{tableData.settlement}}
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" colspan="2">附件上传
                        </td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <!--
                    <tr>
                        <td class="bolder" colspan="2">领导审批</td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.index">
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.userName}}</a> {{item.times | dateformat}}
                                    </div>
                                    <span>【同意】</span>
                                    <span class="content">{{item.fullMessage}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>-->
                </table>
                <el-row v-if="comments && comments.length > 0">
                    <el-col :span="24">
                        <h3 style="margin-left:5px;">审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.userName}}</span> &nbsp; ({{item.times | dateformat}})
                                    </div>
                                    <div class="content">{{item.fullMessage}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

        </div>
        <el-dialog :visible.sync="dialogVisibleAttachment" width="40%">
            <el-form>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="编辑附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="uploadAttachmentOther" action="/api/v1/files/upload" :on-success="handleAttachmentSuccess" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getAttachmentId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleAttachment = false">取 消</el-button>
                <el-button type="primary" @click="saveIncomingApply">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
            <el-form>
                <el-form-item :label="item.label" v-for="(item,index) in actionsDialogArr" :key="index">
                    <el-select v-model="item.checkedValue" filterable :multiple="item.multiple" style="width:100%;" value-key="id">
                        <el-option v-for="user in item.seletList" :key="user.id" :label="user.name" :value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批意见">
                    <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleCrumb" center width="90%" height="600px" append-to-body>
            <el-form>
                <iframe :src="flowNodeUrl" width="100%" height="550px" frameborder="0" v-if="flowNodeUrl"></iframe>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
import { publicMethods } from '../application.js';
import FilesOperate from '../FilesOperate';
export default {
    mixins: [publicMethods],
    name: 'LoanDetail',
    data() {
        return {
            tableData: {
                subView: true,
                travelView: true,
                subId: '',
                subNo: '',
                busId: '',
                busNo: '',
                number: '',
                borrowDept: '',
                creatorName: '',
                borrower: '',
                borrows: [],
                borrowTime: '',
                attachments: [],
                symbol: '',
                moneyUpper: ''
            },
            dialogVisibleAttachment: false,
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'loan-form_loan',
            formName: 'loan_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: '',
            array: []
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    // mounted() {
    //     // this.getAgree()
    //     this.getAllUsers();
    //     if (this.formId != '') {
    //         this.getForm();
    //         this.getActions();
    //     }
    // },
    methods: {
        attahmentsUplode() {
            this.dialogVisibleAttachment = true;
        },
        handleAttachmentSuccess(response, file) {
            const self = this;
            if (!self.tableData.attachments) {
                self.tableData.attachments = [];
            }
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachments.push(item);
                    // self.$forceUpdate();
                });
            }
            // this.$refs.uploadAttachmentOther.clearFiles();
        },
        async saveIncomingApply() {
            const $self = this;
            let response = await this.saveFormData(
                '/api/v1/loan_forms/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
                $self.msgTips('编辑附件成功', 'success');
            }
        },
        getAttachmentId() {},
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el, {
                printTitle: ''
            });
            //  document.getElementById('approval').style.display = 'none';
        },
        ViewDetail(view) {
            if (view == 'chuchai') {
                this.common.open('#/apps/travel/' + this.tableData.busId);
            } else if (view == 'chengbao') {
                // if (this.rows.submissionId && this.rows.submissionId != '') {
                this.common.open('#/apps/submission/' + this.tableData.subId);
                // }
            }
        },
        getAgree() {
            this.array = [];
            let j = -1;
            for (var i = 0; i < this.comments.length; i++) {
                if (this.comments[i].fullMessage == '驳回') {
                    j = i;
                }
            }

            if (j == -1) {
                let arrayConst = [];
                let boolean = false;
                for (var i = 0; i < this.comments.length; i++) {
                    if (
                        this.comments[i + 1] &&
                        this.comments[i + 1].fullMessage == '撤回'
                    ) {
                    } else {
                        arrayConst.push(this.comments[i]);
                    }
                    if (i == this.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayConst) {
                        if (
                            data.fullMessage != null &&
                            data.fullMessage == '同意'
                        ) {
                            this.array.push(data);
                        }
                    }
                }
            } else {
                let arrayreject = [];
                let boolean = false;
                for (var a = j + 1; a < this.comments.length; a++) {
                    if (
                        this.comments[a + 1] &&
                        this.comments[a + 1].fullMessage == '撤回'
                    ) {
                    } else {
                        arrayreject.push(this.comments[a]);
                    }
                    if (a == this.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayreject) {
                        if (
                            data.fullMessage != null &&
                            data.fullMessage == '同意'
                        ) {
                            this.array.push(data);
                        }
                    }
                }
            }
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/' + $self.formName + '/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                // $self.msgTips('获取表单失败', 'warning');
            }
            if ($self.tableData.status != '00') {
                let actions = await $self.getActions();
                $self.actions = actions.data.types;
            }
            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.comments = comments.data;
            $self.crumbs = { items: crumbs.data, index: -1 };
            /** 
            $self.crumbs = {
                items: [
                    {
                        active: false,
                        assignes: '动物与',
                        name: '申请人',
                        key: 'Task_1k2t46g'
                    },
                    {
                        active: false,
                        assignes: '动物与2',
                        name: '申请人2',
                        key: 'Task_1k2t46g55'
                    }
                ],
                index: -1
            };
            */
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
            if ($self.crumbs.index == -1) {
                $self.crumbs.index = $self.crumbs.items.length;
            }
        }
    }
};
</script>
<style>
@media print {
    html,
    body {
        height: inherit;
    }
    #query-table {
        height: inherit;
    }
    #queryTable {
        height: inherit;
    }
}
</style>
<style lang="scss" scope>
#LoanDetail {
    html,
    body {
        height: inherit;
    }
    #query-table {
        height: inherit;
    }
    #queryTable {
        height: inherit;
    }
    .titlename {
        color: #1c47f3;
        text-decoration: underline;
    }
    .formContent {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 15px 30px;
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
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 130px;
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
    #moneyright {
        text-align: right;
        padding-right: 10px;
    }
    .active {
        float: left;
        margin-right: 10px;
    }
    .tablePrint td,
    .tablePrint th {
        padding: 0px;
        margin: 0px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 13px;
        height: 35px;
        text-align: center;
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