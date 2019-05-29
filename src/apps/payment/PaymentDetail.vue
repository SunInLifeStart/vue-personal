<template>
    <div id="PaymentDetail">
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
        <div class="formContent">
            <div>
                <el-button type="primary" @click="getFlowNode" v-show="this.tableData.status && this.tableData.status != '04'">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate" style="height:100%">
                <h4 style="text-align: center;">付款审批单</h4>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="单据编号：" style="margin-left:5px;">
                            <span style="font-size:10px"> {{tableData.numericalOrder}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出差申请单：">
                            <span style="font-size:10px" @click="travelDetail()" :class="{'titlename':this.tableData.tra=='true'}"> {{tableData.travelCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：" label-width="70px">
                            <span style="font-size:10px" @click="ViewDetail()" :class="{'titlename':this.tableData.sub=='true'}"> {{tableData.submissionName}}</span>
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
                        <td colspan="8" class="fontBold">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            提单人
                        </td>
                        <td>
                            {{tableData.applicantName}}
                        </td>
                        <td class="fontBold">
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.organ}}
                        </td>
                        <td class="fontBold">
                            申请时间
                        </td>
                        <td colspan="2">
                            {{tableData.applicantTime | dateformat}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            收款单位
                        </td>
                        <td>
                            {{tableData.receiptUnit}}
                        </td>
                        <td class="fontBold">
                            开户行
                        </td>
                        <td colspan="2">
                            {{tableData.openingLine}}
                        </td>
                        <td class="fontBold">
                            银行账号
                        </td>
                        <td colspan="2">
                            {{tableData.bankNumber}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            结算方式
                        </td>
                        <td>
                            {{tableData.settlement}}
                        </td>
                        <td class="fontBold">
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.costUnit}}
                        </td>
                        <td class="fontBold">
                            分摊
                        </td>
                        <td colspan="2">
                            {{tableData.allocation}}
                            <!-- <template>
                            <el-radio v-model="tabledata.allocation" label="是" @change="showShare('show')">是</el-radio>
                            <el-radio v-model="tabledata.allocation" label="否" @change="showShare('hide')">否</el-radio>
                        </template> -->
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td colspan="8">
                            付款明细
                        </td>
                    </tr>
                    <tr>
                        <td>
                            支出说明
                        </td>
                        <td colspan="4">
                            <el-input type="textarea" v-model="tableData.paymentExplain" disabled :autosize="{minRows: 5}"></el-input>
                        </td>
                        <td>
                            费用归属项目
                        </td>
                        <td colspan="2">
                            <el-input type="textarea" v-model="tableData.project" disabled :autosize="{minRows: 5}"></el-input>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td colspan="2">支出类别|明细</td>
                        <td>币种</td>
                        <td>金额</td>
                        <td>预估汇率</td>
                        <td>预估本币金额</td>
                        <td>
                            不含税价格
                        </td>
                        <td>
                            税金
                        </td>
                    </tr>
                    <tr v-for="(payItem) in this.tableData.details" :key="payItem.index">
                        <td colspan="2">
                            {{payItem.bigType}}
                            <!-- /{{payItem.centreType}}/{{payItem.smallType}} -->
                        </td>
                        <td>
                            {{payItem.currency}}

                        </td>
                        <td class="money">
                            {{payItem.amount|numFilter}}
                        </td>
                        <td>
                            {{payItem.rate}}
                        </td>
                        <td class="money">
                            {{payItem.localAmount|numFilter}}
                        </td>
                        <td>
                            {{payItem.noTax}}
                        </td>
                        <td>
                            {{payItem.tax}}
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                    </tr>
                    <tr>
                        <td>
                            是否资金计划内
                        </td>
                        <td colspan="3">
                            {{this.tableData.capitalYes ? '是': '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{this.tableData.budgetYes ? '是': '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            合同号
                        </td>
                        <td colspan="2">
                            <span @click="borrowOddDetail()" :class="{'titlename':this.tableData.contract.orAmount=='1'}"> {{tableData.contract.numNo}}</span>
                            <!-- <el-tooltip class="item" effect="dark" content="查看" placement="left">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" :disabled="this.tabledata.contract.orAmount=='2'" @click="borrowOddDetail"></el-button>
                            </el-tooltip> -->
                        </td>
                        <td class="fontBold">
                            合同名称
                        </td>
                        <td colspan="4">
                            {{tableData.contract.name}}
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3" class="fontBold">
                            合同金额
                        </td>
                        <td rowspan="3" class="money">
                            <div v-if="this.moneyType">
                                {{tableData.contract.amount | numFilter}}
                            </div>
                            <div v-else>
                                {{tableData.contract.amount}}
                            </div>
                        </td>
                        <td rowspan="3" class="fontBold">
                            前期已付
                        </td>
                        <td class="fontBold">
                            累计已付款
                        </td>
                        <td class="money">
                            {{tableData.contract.payments|numFilter}}
                        </td>
                        <td rowspan="3" class="fontBold">
                            未付金额
                        </td>
                        <td colspan="2" rowspan="3" class="money">
                            <div v-if="this.moneyType2">
                                {{tableData.contract.unAmount | numFilter}}
                            </div>
                            <div v-else>
                                {{tableData.contract.unAmount}}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">累计付款比例（%）</td>
                        <td>
                            {{tableData.contract.cumulativeProShow}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">本次付款后累计支付比例（%）</td>
                        <td>
                            {{tableData.contract.cumulativeAfterShow}}
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
                        <td colspan="2" class="fontBold">
                            支付金额
                        </td>
                        <td>
                            <el-row>
                                <el-col :span="4" align="left" style="margin-left:5px">{{this.tableData.contract.symbol}}</el-col>
                                <el-col :span="18" align="right" style="margin-right:5px">{{tableData.contract.payAmount|numFilter}}</el-col>
                            </el-row>
                        </td>
                        <td class="fontBold">
                            金额大写
                        </td>
                        <td colspan="4">
                            （{{ this.tableData.details.length > 0 ? this.tableData.details[0].currency : '人民币'}}：&nbsp;&nbsp;&nbsp;{{tableData.contract.amountCap}}&nbsp;&nbsp;&nbsp;）
                        </td>
                    </tr>

                    <tr v-show="tableData.allocation == '是'" class="fontBold">
                        <td colspan="8">分摊明细（基本信息分摊选择是）</td>
                    </tr>
                    <tr v-show="tableData.allocation == '是'" class="fontBold">
                        <td colspan="2">承担单位</td>
                        <td>承担部门</td>
                        <td>支出项目</td>
                        <td>承担金额（{{this.tableData.contract.symbol}}）</td>
                        <td colspan="2">金额大写（{{this.tableData.details.length > 0 ? this.tableData.details[0].currency : '人民币'}}）</td>
                        <td>分摊比例</td>
                    </tr>
                    <tr v-show="tableData.allocation == '是'" v-for="(shareItem) in this.tableData.allocationDetails" :key="shareItem.index">
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
                            {{shareItem.amount|numFilter}}
                        </td>
                        <td colspan="2">
                            {{shareItem.amountCap}}
                        </td>
                        <td>
                            {{shareItem.proportion}}
                        </td>
                    </tr>
                    <tr v-show="tableData.allocation == '是'">
                        <td colspan="8">

                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">附件上传</td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr id="approval">
                        <td colspan="2" class="fontBold">领导审批</td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id">
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.userName}}</a> {{item.times | dateformat}}
                                    </div>
                                    <span style="color: #0c21e8;">【同意】</span>
                                    <span class="content">{{item.fullMessage}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <el-row v-if="comments && comments.length > 0">
                    <el-col :span="24">
                        <h3 style="margin-left: 10px;">审批意见</h3>
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
    name: 'PaymentDetail',
    data() {
        return {
            moneyType: false, //判断合同信息中 金额是否全为数字
            moneyType2: false, //判断合同信息中 金额是否全为数字
            tableData: {
                details: [],
                contract: {
                    numNo: '',
                    amount: '',
                    payments: '',
                    cumulativeProShow: '',
                    cumulativeAfterShow: ''
                } //合同信息
            },
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'payment-form_payment',
            formName: 'payment_forms',
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
    methods: {
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el);
            //  document.getElementById('approval').style.display = 'none';
        },
        ViewDetail() {
            if (
                this.tableData.submissionId &&
                this.tableData.submissionId != '' &&
                this.tableData.sub == 'true'
            ) {
                this.common.open(
                    '#/apps/submission/' + this.tableData.submissionId
                );
            }
        },
        //查看借款单详情
        travelDetail() {
            if (
                this.tableData.travelId &&
                this.tableData.travelId != null &&
                this.tableData.tra == 'true'
            ) {
                this.common.open('#/apps/travel/' + this.tableData.travelId);
            }
        },
        borrowOddDetail() {
            if (
                this.tableData.contract.contractId &&
                this.tableData.contract.contractId != '' &&
                this.tableData.contract.orAmount == '1'
            ) {
                this.common.open(
                    '#/apps/contract/' + this.tableData.contract.contractId
                );
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
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
                if (this.tableData.contract.orAmount == '2') {
                    this.tableData.contract.cumulativeAfterShow = this.tableData.contract.cumulativeAfter;
                    this.tableData.contract.cumulativeProShow = this.tableData.contract.cumulativePro;
                } else {
                    this.tableData.contract.cumulativeAfterShow = this.common.toDecimal2(
                        this.tableData.contract.cumulativeAfter
                    );
                    this.tableData.contract.cumulativeProShow = this.common.toDecimal2(
                        this.tableData.contract.cumulativePro
                    );
                }
                if (/^[0-9.]+$/.test(this.tableData.contract.amount)) {
                    //这是用正则表达是检查
                    this.moneyType = true;
                } else {
                    this.moneyType = false;
                }
                if (/^[0-9.]+$/.test(this.tableData.contract.unAmount)) {
                    //这是用正则表达是检查
                    this.moneyType2 = true;
                } else {
                    this.moneyType2 = false;
                }
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            this.getAgree();
            $self.crumbs = { items: crumbs.data, index: -1 };
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
}
</style>
<style lang="scss" scope>
#PaymentDetail {
    .titlename {
        color: #1c47f3;
        text-decoration: underline;
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
    .el-textarea.is-disabled .el-textarea__inner {
        background-color: #e0e1e205;
        border-color: #e4e7ed;
        color: #85888e;
        cursor: not-allowed;
    }
}
</style>