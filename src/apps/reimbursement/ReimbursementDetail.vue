<template>
    <div id="ReimbursementDetail">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.index" style="margin-left: 10px;" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>

            </el-row>
        </div>
        <div class="formContent" style="margin-top: 5px;margin-left:10px;overflow:auto;">
            <div>
                <el-button type="primary" @click="getFlowNode" v-show="this.tableData.status && this.tableData.status != '04'">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-form :model='tableData' class="demo-form-inline" id="printContent" ref="formupdate" style="height:100%">
                <h4 style="text-align: center;">报销审批单</h4>
                <el-row style="margin-top: 10px;">
                    <el-col :span="7">
                        <el-form-item label="单据编号：" style="margin-left:5px;">
                            <span style="font-size:10px">
                                {{tableData.no}}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出差审批单：">
                            <span style="font-size:10px" @click="ViewDetail('travel')" :class="{'titlename':this.tableData.travelView}"> {{tableData.travelName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：">
                            <span style="font-size:10px" @click="ViewDetail('chengbao')" :class="{'titlename':this.tableData.subView}"> {{tableData.submissionName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tablePrint" style="width: 99%; height: 100%; table-layout: fixed; word-break: break-all;margin-top:5px;">
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            提单人
                        </td>
                        <td>
                            {{tableData.creatorName}}
                        </td>
                        <td class="fontBold">
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.organName}}
                        </td>
                        <td class="fontBold">
                            提单时间
                        </td>
                        <td colspan="2">
                            {{tableData.created}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            收款人
                        </td>
                        <td>
                            {{tableData.payee}}
                        </td>
                        <td class="fontBold">
                            开户行
                        </td>
                        <td colspan="2">
                            {{tableData.bank}}
                        </td>
                        <td class="fontBold">
                            银行卡号
                        </td>
                        <td colspan="2">
                            {{tableData.cardNo}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            结算方式
                        </td>
                        <td>
                            {{tableData.clearing}}
                        </td>
                        <td class="fontBold">
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.expenseDep}}
                        </td>
                        <td class="fontBold">
                            分摊
                        </td>
                        <td colspan="2">
                            {{tableData.share == true ? '是' : '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" class="fontBold">
                            报销明细
                        </td>
                    </tr>
                    <tr>
                        <td>
                            费用描述
                        </td>
                        <td colspan="4">
                            {{tableData.depict}}
                        </td>
                        <td>
                            费用归属项目
                        </td>
                        <td colspan="2">
                            {{tableData.costItem}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">
                            费用类别
                        </td>
                        <td class="fontBold">
                            币种
                        </td>
                        <td class="fontBold">
                            金额
                        </td>
                        <td class="fontBold">
                            预估汇率
                        </td>
                        <td class="fontBold">
                            预估本币金额
                        </td>
                        <td class="fontBold">
                            不含税价格
                        </td>
                        <td class="fontBold">
                            税金
                        </td>
                    </tr>
                    <tr v-for="item in tableData.repayItems" :key="item.index">
                        <td colspan="2">
                            {{item.bigTypeName}}
                        </td>
                        <td>
                            {{item.currency.label}}
                        </td>
                        <td>
                            {{item.money}}
                        </td>
                        <td>
                            {{item.estRate}}
                        </td>
                        <td>
                            {{item.estSum}}
                        </td>
                        <td>
                            {{item.noTax}}
                        </td>
                        <td>
                            {{item.tax}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">
                            金额合计
                        </td>
                        <td>
                            <span style="float:left;"> {{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}}</span>
                            <span style="float:right;">{{parseFloat(this.tableData.total).toLocaleString()}}</span>
                        </td>
                        <td class="fontBold">
                            金额大写
                        </td>
                        <td colspan="4">
                            <span> ({{this.tableData.repayItems.length ==0 ? '人民币': this.tableData.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.tableData.upper}})</span>
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
                            {{tableData.budget.fundPlan ? '是': '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{tableData.budget.est ? '是': '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" class="fontBold">借款信息</td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            是否有借款
                        </td>
                        <td colspan="2" class="fontBold">
                            关联借款单号
                        </td>
                        <td class="fontBold">
                            借款未核销金额
                        </td>
                        <td colspan="2" class="fontBold">
                            借款已核销金额
                        </td>
                        <td colspan="2" class="fontBold">
                            借款剩余金额是否退还
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {{tableData.borrow.bor ? '是': '否'}}
                        </td>
                        <td colspan="2">
                            <span @click="ViewDetail('borrow')" class="titlename"> {{tableData.borrow.borrowOdd}}</span>
                        </td>
                        <td>
                            {{parseFloat(this.tableData.borrow.noVerify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                            {{parseFloat(this.tableData.borrow.verify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                            {{tableData.borrow.sendDack? '是' : '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">应付金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                            {{parseFloat(this.tableData.borrow.payAble).toLocaleString()}}
                        </td>
                        <td class="fontBold">应退金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                            {{parseFloat(this.tableData.borrow.shouldBack).toLocaleString()}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">
                            金额大写
                        </td>
                        <td colspan="6">
                            ({{this.tableData.repayItems.length ==0 ? '人民币': this.tableData.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.tableData.borrow.upperSum}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;" v-show="tableData.share == true" class="fontBold">
                            分摊明细
                        </td>
                    </tr>
                    <tr v-show="tableData.share == true">
                        <td colspan="2" class="fontBold">
                            承担单位
                        </td>
                        <td class="fontBold">
                            承担部门
                        </td>
                        <td class="fontBold">
                            承担金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})
                        </td>
                        <td colspan="3" class="fontBold">
                            金额大写【{{this.tableData.repayItems.length ==0 ? '人民币': this.tableData.repayItems[0].currency.label}}】
                        </td>
                        <td class="fontBold">
                            分摊比例(%)
                        </td>
                    </tr>
                    <tr v-for="item in tableData.shares" :key="item.index" v-show="tableData.share == true">
                        <td colspan="2">
                            {{item.bearUnit}}
                        </td>
                        <td>
                            {{item.bearDep}}
                        </td>
                        <td>
                            {{item.bearSum.toLocaleString()}}
                        </td>
                        <td colspan="3">
                            {{item.upper}}
                        </td>
                        <td>
                            {{item.shareRatio}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">附件</td>
                    </tr>
                    <tr>
                        <td class="fontBold">附件信息</td>
                        <td colspan="7" style="padding: 10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            审批意见
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id">
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.userName}}</span> &nbsp; ({{item.times | dateformat}})
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
import moment from 'moment';
import cookies from 'js-cookie';
import { publicMethods } from '../application.js';
import FilesOperate from '../FilesOperate';
import printJS from 'print-js'

export default {
    mixins: [publicMethods],
    name: 'ReimbursementDetail',
    data() {
        return {
            tableData: {
                no: '',
                type: '',
                budgetSure: false,
                creatorName: '',
                organName: '',
                travellerId: '',
                travelName: '',
                created: '',
                payee: '',
                bank: '',
                cardNo: '',
                clearing: '',
                upper: '',
                expenseDep: '',
                repayItems: [],
                share: false,
                fullScreen: false,
                total: '',
                budget: {
                    estSum: '',
                    surplusSum: '',
                    fundPlan: '',
                    surplusPlan: ''
                },
                attachments: [],
                crumbNodeName: '',
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    // id: 187775797248,
                    borrowId: '',
                    verify: 0,
                    sendDack: false,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: []
            },
            actions: [],
            array: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'expense-form_reimbursement',
            formName: 'expense_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
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
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el);
            const style = '@page { margin: 0 } @media print { #printContent{height: inherit;color:red;}}'//自定义样式
            printJS({
                printable: 'printContent',//要打印内容的id
                type: 'html',
                style: style,
                scanStyles: false
            })
            //  document.getElementById('approval').style.display = 'none';
        },
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
                if (
                    this.tableData.submissionId &&
                    this.tableData.submissionId != '' &&
                    this.tableData.subView
                ) {
                    this.common.open(
                        '#/apps/submission/' + this.tableData.submissionId
                    );
                }
            } else if (view == 'travel') {
                if (
                    this.tableData.travellerId &&
                    this.tableData.travellerId != '' &&
                    this.tableData.travelView
                ) {
                    this.common.open(
                        '#/apps/travel/' + this.tableData.travellerId
                    );
                }
            }
        },
        clearForm() {
            this.tableData = {
                no: '',
                type: '',
                subView: true,
                budgetSure: false,
                travellerId: '',
                travelName: '',
                submissionId: '',
                submissionName: '',
                topPower: '',
                creatorName: '',
                organName: '',
                created: '',
                payee: '',
                bank: '',
                cardNo: '',
                clearing: '',
                upper: '',
                expenseDep: '',
                repayItems: [],
                share: false,
                total: '',
                budget: {
                    estSum: '',
                    surplusSum: '',
                    fundPlan: '',
                    surplusPlan: ''
                },
                attachments: [],
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    borrowId: '',
                    verify: 0,
                    sendDack: false,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: []
            };
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
        rejectPut() {
            const self = this;
            if (
                this.tableData.borrow.borrowId &&
                this.tableData.borrow.borrowId != ''
            ) {
                axios
                    .put(
                        '/api/v1/expense_forms/' +
                            this.formId +
                            '/updateBorrow/' +
                            this.tableData.borrow.borrowId,
                        '',
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
            }
            //});
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
                if (response.data.borrow == null) {
                    $self.tableData.borrow.payAble = response.data.total;
                    $self.tableData.borrow.upperSum = response.data.upper;
                }
                response.data.borrow =
                    response.data.borrow == null
                        ? $self.tableData.borrow
                        : response.data.borrow;
                $self.tableData = response.data;
                if (
                    $self.currentAction &&
                    $self.currentAction.action &&
                    $self.currentAction.action == 'REJECT'
                ) {
                    $self.rejectPut();
                }
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
            let actions = await $self.getActions();
            // let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            this.getAgree();
            // $self.crumbs =  {items: crumbs.data, index: -1};
            // for(var i= 0; i<$self.crumbs.items.length; i++){
            //     if($self.crumbs.items[i].active){
            //         $self.crumbs.index = i;
            //     }
            // }
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
#ReimbursementDetail {
    .formContent {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 15px 30px;
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