<template>
    <div id="PaymentDetail" :class="{fullScreen:fullScreen}">
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
                <el-button type="primary" @click="print">打印</el-button>
            </div>
            <el-form :model='tabledata' class="formList" ref="formupdate">
                <p style="text-align: center;">{{tabledata.type}}</p>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            {{tabledata.numericalOrder}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" v-if="this.tabledata.travelCode">
                        <el-form-item label="出差申请单：">
                            {{tabledata.travelCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-if="this.tabledata.travelCode">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="travelDetail()"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7" v-if="this.tabledata.submissionName">
                        <el-form-item label="呈报件：">
                            {{tabledata.submissionName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-if="this.tabledata.submissionName">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail()"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="8" v-if="this.tabledata.ranks">
                        <el-form-item label="出差人最高职权：" label-width="140px">
                            {{tabledata.ranks}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tablePrint">
                    <col style="width: 9%" />
                    <col style="width: 11%" />
                    <col style="width: 11%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 11%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td>
                            申请人
                        </td>
                        <td>
                            {{tabledata.applicantName}}
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tabledata.organ}}
                        </td>
                        <td>
                            申请时间
                        </td>
                        <td colspan="2">
                            {{tabledata.applicantTime | dateformat}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            收款单位
                        </td>
                        <td>
                            {{tabledata.receiptUnit}}
                        </td>
                        <td>
                            开户行
                        </td>
                        <td colspan="2">
                            {{tabledata.openingLine}}
                        </td>
                        <td>
                            银行账号
                        </td>
                        <td colspan="2">
                            {{tabledata.bankNumber}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            结算方式
                        </td>
                        <td>
                            {{tabledata.settlement}}
                        </td>
                        <td>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tabledata.costUnit}}
                        </td>
                        <td>
                            分摊
                        </td>
                        <td colspan="2">
                            {{tabledata.allocation}}
                            <!-- <template>
                            <el-radio v-model="tabledata.allocation" label="是" @change="showShare('show')">是</el-radio>
                            <el-radio v-model="tabledata.allocation" label="否" @change="showShare('hide')">否</el-radio>
                        </template> -->
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            付款明细
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">支出类别|明细</td>
                        <td>支出说明</td>
                        <td>币种</td>
                        <td>金额</td>
                        <td>预估汇率</td>
                        <td>预估本币金额</td>
                        <td>费用归属项目</td>
                    </tr>
                    <tr v-for="(payItem,index) in this.tabledata.details" :key="payItem.index" @contextmenu.prevent="deleteItem(index,'payDetail')">
                        <td colspan="2">
                            {{payItem.big}}
                            <!-- /{{payItem.centreType}}/{{payItem.smallType}} -->
                        </td>
                        <td>
                            {{payItem.statement}}
                        </td>
                        <td>
                            {{payItem.currency}}

                        </td>
                        <td class="money">
                            {{payItem.amount}}
                        </td>
                        <td>
                            {{payItem.rate}}
                        </td>
                        <td class="money">
                            {{payItem.localAmount}}
                        </td>
                        <td>
                            {{payItem.costProject}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">

                        </td>
                    </tr>
                    <tr>
                        <td>
                            合同号
                        </td>
                        <td colspan="2">
                            {{tabledata.contract.numNo}}
                            <el-tooltip class="item" effect="dark" content="查看" placement="left">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="borrowOddDetail"></el-button>
                            </el-tooltip>
                        </td>
                        <td>
                            合同名称
                        </td>
                        <td colspan="4">
                            {{tabledata.contract.name}}
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3">
                            合同金额
                        </td>
                        <td rowspan="3" class="money">
                            {{tabledata.contract.amount}}
                        </td>
                        <td rowspan="3">
                            前期已付
                        </td>
                        <td>
                            累计已付款
                        </td>
                        <td class="money">
                            {{tabledata.contract.payments}}
                        </td>
                        <td rowspan="3">
                            未付金额
                        </td>
                        <td colspan="2" rowspan="3" class="money">
                            {{tabledata.contract.unAmount}}
                        </td>
                    </tr>
                    <tr>
                        <td>累计付款比例</td>
                        <td>
                            {{tabledata.contract.cumulativePro}}
                        </td>
                    </tr>
                    <tr>
                        <td>本次付款后累计支付比例</td>
                        <td>
                            {{tabledata.contract.cumulativeAfter}}
                        </td>
                    </tr>
                    <!-- <tr>
                        <td colspan="2">
                            预算金额
                        </td>
                        <td>
                            {{tabledata.contract.budgetAmount}}
                        </td>
                        <td colspan="2">
                            资金计划
                        </td>
                        <td colspan="3">
                            {{tabledata.contract.fundingPlan}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            剩余预算金额
                        </td>
                        <td>
                            {{tabledata.contract.reBudgetAmount}}
                        </td>
                        <td colspan="2">
                            剩余资金计划
                        </td>
                        <td colspan="3">
                            {{tabledata.contract.reFundingPlan}}
                        </td>
                    </tr> -->
                    <tr>
                        <td colspan="8">
                            <el-radio v-model="tabledata.overBudget" :label='false' disabled>预算内</el-radio>
                            <el-radio v-model="tabledata.overBudget" :label='true' disabled>预算外</el-radio>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2">
                            支付金额
                        </td>
                        <td>
                            <!-- {{tabledata.contract.payAmount}} -->
                            <el-row>
                                <el-col :span="4" align="left" style="margin-left:5px">{{this.dollar}}</el-col>
                                <el-col :span="18" align="right" style="margin-right:5px">{{tabledata.contract.payAmount}}</el-col>
                            </el-row>
                        </td>
                        <td>
                            金额大写
                        </td>
                        <td colspan="4">
                            （{{this.dollarName}}：&nbsp;&nbsp;&nbsp;{{tabledata.contract.amountCap}}&nbsp;&nbsp;&nbsp;）
                        </td>
                    </tr>

                    <tr v-show="tabledata.allocation == '是'">
                        <td colspan="8">分摊明细（基本信息分摊选择是）</td>
                    </tr>
                    <tr v-show="tabledata.allocation == '是'">
                        <td colspan="2">承担单位</td>
                        <td>承担部门</td>
                        <td>支出项目</td>
                        <td>承担金额（{{this.dollar}}）</td>
                        <td colspan="2">金额大写（{{this.dollarName}}）</td>
                        <td>分摊比例</td>
                    </tr>
                    <tr v-show="tabledata.allocation == '是'" v-for="(shareItem,index) in this.tabledata.allocationDetails" :key="shareItem.index" @contextmenu.prevent="deleteItem(index,'shareDetail')">
                        <td colspan="2">
                            {{shareItem.unit}}
                        </td>
                        <td>
                            {{shareItem.organ}}
                        </td>
                        <td>
                            {{shareItem.project}}
                        </td>
                        <td>
                            {{shareItem.amount}}
                        </td>
                        <td colspan="2">
                            {{shareItem.amountCap}}
                        </td>
                        <td>
                            {{shareItem.proportion}}
                        </td>
                    </tr>
                    <tr v-show="tabledata.allocation == '是'">
                        <td colspan="8">

                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">附件上传
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tabledata.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <!-- <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i> -->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">领导审批
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id" v-if="item.action == 'APPROVE'">
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    </div>
                                    <span style="color: #0c21e8;">【同意】</span>
                                    <span class="content">{{item.content}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </el-form>
            <el-row v-if="tabledata.comments && tabledata.comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
                    <div class="items">
                        <div class="item" v-for="item in tabledata.comments" :key="item.id">
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
            <el-dialog :visible.sync="dispatchDialog" center width="30%" append-to-body>
                <el-form>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="textarea">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div>
                    <el-radio v-model="tabledata.overBudget" :label='false'>预算内</el-radio>
                    <el-radio v-model="tabledata.overBudget" :label='true'>预算外</el-radio>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <el-button @click="dispatchDialog = false">取 消</el-button>
                    <el-button type="primary" @click="yssubmitForm()">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
import moment from 'moment';
import { PAYMENT, CURRENCY } from '../data.js';
import cookies from 'js-cookie';
export default {
    name: 'PaymentDetail',
    data() {
        return {
            dispatchDialog: false, //张宁昕审批，选择系统内外预算
            dollar: '￥', //币符
            dollarName: '人民币', //币中名称
            options: CURRENCY['currency'],
            actions_status: false,
            payType: PAYMENT['payType'],
            api: '',
            pageType: 'show',
            actions: [],
            crumb: { items: [] },
            tabledata: {
                details: [],
                contract: {
                    numNo: ''
                } //合同信息
            },
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
            crumbNodeName: '',
            nodename: '',
            array: []
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
        if (this.formId != '') {
            this.getForm();
            // this.getCrumbs();
            // this.getActions();
            this.getAllUsers();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            // this.getCrumbs();
            // this.getActions();
        }
    },
    methods: {
        //打印
        print() {
            this.$print(this.$refs.formupdate.$el);
        },
        //张宁昕同意
        yssubmitForm() {
            this.dispatchDialog = false;
            axios
                .post('/api/v1/payment_forms/save', this.tabledata)
                .then(res => {
                    this.submitForm();
                });
        },
        getAgree1() {
            this.array = [];
            let j = -1;
            for (var i = 0; i < this.tabledata.comments.length; i++) {
                if (this.tabledata.comments[i].action == 'REJECT') {
                    j = i;
                }
            }
            if (j == -1) {
                for (let data of this.tabledata.comments) {
                    if (data.action != null) {
                        this.array.push(data);
                    }
                }
            } else {
                for (var a = j + 2; a < this.tabledata.comments.length; a++) {
                    this.array.push(this.tabledata.comments[a]);
                }
            }
        },
        getAgree() {
            this.array = [];
            let j = -1;
            for (var i = 0; i < this.tabledata.comments.length; i++) {
                if (this.tabledata.comments[i].action == 'REJECT') {
                    j = i;
                }
            }
            if (j == -1) {
                let arrayConst = [];
                let boolean = false;
                for (var i = 0; i < this.tabledata.comments.length; i++) {
                    if (
                        this.tabledata.comments[i + 1] &&
                        this.tabledata.comments[i + 1].action == 'PULL'
                    ) {
                    } else {
                        arrayConst.push(this.tabledata.comments[i]);
                    }
                    if (i == this.tabledata.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayConst) {
                        if (data.action != null && data.action == 'APPROVE') {
                            this.array.push(data);
                        }
                    }
                }
            } else {
                let arrayreject = [];
                let boolean = false;
                for (var a = j + 1; a < this.tabledata.comments.length; a++) {
                    if (
                        this.tabledata.comments[a + 1] &&
                        this.tabledata.comments[a + 1].action == 'PULL'
                    ) {
                    } else {
                        arrayreject.push(this.tabledata.comments[a]);
                    }
                    if (a == this.tabledata.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayreject) {
                        if (data.action != null && data.action == 'APPROVE') {
                            this.array.push(data);
                        }
                    }
                }
            }
        },
        ViewDetail() {
            if (
                this.tabledata.submissionId &&
                this.tabledata.submissionId != ''
            ) {
                this.common.open(
                    '#/apps/submission/' + this.tabledata.submissionId
                );
            }
        },
        //查看借款单详情
        travelDetail() {
            if (this.tabledata.travelId && this.tabledata.travelId != null) {
                this.common.open('#/apps/travel/' + this.tabledata.travelId);
            }
        },
        borrowOddDetail() {
            if (
                this.tabledata.contract.contractId &&
                this.tabledata.contract.contractId != ''
            ) {
                this.common.open(
                    '#/apps/contract/' + this.tabledata.contract.contractId
                );
            }
        },
        getForm() {
            const self = this;
            self.api = '';
            if (this.formId != '') {
                axios
                    .get('/api/v1/payment_forms/' + this.formId)
                    .then(res => {
                        self.tabledata = res.data;
                        for (let item of this.options) {
                            if (item.label == res.data.details[0].currency) {
                                this.dollar = item.dollar;
                                this.dollarName = item.value;
                            }
                        }
                        for (let item of this.payType) {
                            if (item.name == this.tabledata.type) {
                                this.api = item.api;
                            }
                        }
                        for (let type of this.tabledata.details) {
                            if (type.bigType) {
                                type.big = type.bigType;
                                if (type.centreType) {
                                    type.big =
                                        type.bigType + '/' + type.centreType;
                                    if (type.smallType) {
                                        type.big =
                                            type.bigType +
                                            '/' +
                                            type.centreType +
                                            '/' +
                                            type.smallType;
                                    }
                                }
                            }
                        }
                        this.tabledata.details;
                        this.getAgree();
                        this.getCrumbs();
                        this.getActions();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //转换大类小类
        getType() {
            axios.get('/api/v1/travel_forms/type/' + item).then(res => {
                this.optionType.push(res.data);
            });
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        getActions() {
            axios
                .get('/api/v1/' + this.api + '/' + this.formId + '/actions')
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
                    this.actions = res.data.types;
                });
        },
        getCrumbs() {
            axios
                .get('/api/v1/' + this.api + '/' + this.formId + '/crumb')
                .then(res => {
                    this.crumb = { items: res.data, index: -1 };
                    res.data.forEach((item, index) => {
                        if (item.active) {
                            this.nodename = item.name;
                            this.crumbNodeName = item.key;
                            this.crumb.index = index;
                            if (item.assignes) {
                                item.name =
                                    item.name + '(' + item.assignes + ')';
                            }
                        }
                    });
                });
        },
        getRejectList() {
            let self = this;
            axios
                .get(
                    '/api/v1/' +
                        this.api +
                        '/' +
                        this.formId +
                        '/reject/targets'
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
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/` + this.api + `/${self.formId}/pull`)
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
            } else if ('PRESIGN,APPROVE'.includes(action.type)) {
                //拒绝，加签
                let compare = true;
                for (let few of this.crumb.items) {
                    if (
                        few.key == 'Task_03' &&
                        few.active &&
                        action.type == 'APPROVE' &&
                        cookies.get('uname') == '张宁昕'
                    ) {
                        compare = false;
                    }
                }
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '前选择前加签人';
                }
                if (!compare) {
                    this.dispatchDialog = true;
                } else {
                    this.dialogVisible = true;
                }
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
                //只需要填写意见
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
                .put(`/api/v1/payment_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
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
                self.submitData.inbudget = self.tabledata.overBudget;
                self.submitData.subOrganId =  self.tabledata.subOrganId,
                axios
                    .put(
                        `/api/v1/` + this.api + `/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                        self.comment();
                        self.getActions();
                        self.getCrumbs();
                        if (self.currentAction.type == 'CANCEL') {
                            self.$emit('refreshData');
                        }
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
                .then(res => {})
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
#PaymentDetail {
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
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: #fff;
    left: 0px;
    right: 0px;
}
</style>