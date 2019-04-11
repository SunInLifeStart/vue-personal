<template>
    <div id="ReimbursementDetail">
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
            <div>
                <el-button type="primary" @click="getFlowNode">查看流程</el-button>
            </div>
            <br />
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;">
                    <el-col :span="7">
                        <el-form-item label="流水单号：">
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
                    <!-- <el-col :span="1" v-if="this.rows.type=='国内差旅报销'">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.rows.travelView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('travel')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.rows.travelView == false">
                            <el-button type="text" icon="el-icon-view" style="color:gray;"></el-button>
                        </el-tooltip>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label="呈报件：">
                            <span style="font-size:10px" @click="ViewDetail('chengbao')" :class="{'titlename':this.tableData.subView}"> {{tableData.submissionName}}</span>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.rows.subView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.rows.subView == false">
                            <el-button type="text" icon="el-icon-view" style="color:gray;"></el-button>
                        </el-tooltip>
                    </el-col> -->
                </el-row>
                <table class="tablePrint" style="width: 99%; height: 100%; table-layout: fixed; word-break: break-all;margin-top:10px;">
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
                        <td>
                            提单人
                        </td>
                        <td>
                            {{tableData.creatorName}}
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.organName}}
                        </td>
                        <td>
                            提单时间
                        </td>
                        <td colspan="2">
                            {{tableData.created}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            收款人
                        </td>
                        <td>
                            {{tableData.payee}}
                        </td>
                        <td>
                            开户行
                        </td>
                        <td colspan="2">
                            {{tableData.bank}}
                        </td>
                        <td>
                            银行卡号
                        </td>
                        <td colspan="2">
                            {{tableData.cardNo}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            结算方式
                        </td>
                        <td>
                            {{tableData.clearing}}
                        </td>
                        <td>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.expenseDep}}
                        </td>
                        <td>
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
                        <td colspan="8" style="font-weight:bold;">
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
                        <td colspan="2">
                            费用类别
                        </td>
                        <td>
                            币种
                        </td>
                        <td>
                            金额
                        </td>
                        <td>
                            预估汇率
                        </td>
                        <td>
                            预估本币金额
                        </td>
                        <td>
                            不含税价格
                        </td>
                        <td>
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
                            {{item.costItem}}
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
                        <td colspan="2">
                            金额合计
                        </td>
                        <td>
                            <span style="float:left;"> {{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}}</span>
                            <span style="float:right;">{{parseFloat(this.tableData.total).toLocaleString()}}</span>
                        </td>
                        <td>
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
                            {{tableData.budget.fundPlan == true ? '是' : '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{tableData.budget.est == true ? '是' : '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">借款信息</td>
                    </tr>
                    <tr>
                        <td>
                            是否有借款
                        </td>
                        <td colspan="2">
                            关联借款单号
                        </td>
                        <td>
                            借款未核销金额
                        </td>
                        <td colspan="2">
                            借款已核销金额
                        </td>
                        <td colspan="2">
                            借款剩余金额是否退还
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {{tableData.borrow.bor ? '是': '否'}}
                        </td>
                        <td colspan="2">
                            {{tableData.borrow.borrowOdd}}
                            <el-tooltip class="item" effect="dark" content="查看" placement="left" v-show="this.tableData.borrow.borrowOdd">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="ViewDetail('borrow')"></el-button>
                            </el-tooltip>
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
                        <td>应付金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                            {{parseFloat(this.tableData.borrow.payAble).toLocaleString()}}
                        </td>
                        <td>应退金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                            {{parseFloat(this.tableData.borrow.shouldBack).toLocaleString()}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            金额大写
                        </td>
                        <td colspan="6">
                            ({{this.tableData.repayItems.length ==0 ? '人民币': this.tableData.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.tableData.borrow.upperSum}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;" v-show="tableData.share == true">
                            分摊明细
                        </td>
                    </tr>
                    <tr v-show="tableData.share == true">
                        <td colspan="2">
                            承担单位
                        </td>
                        <td>
                            承担部门
                        </td>
                        <td>
                            承担金额({{this.tableData.repayItems.length ==0 ? '￥': this.tableData.repayItems[0].currency.curValue}})
                        </td>
                        <td colspan="3">
                            金额大写【{{this.tableData.repayItems.length ==0 ? '人民币': this.tableData.repayItems[0].currency.label}}】
                        </td>
                        <td>
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
                            {{item.bearSum}}
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
                        <td>附件信息</td>
                        <td colspan="7">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
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
                                        <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    </div>
                                    <span style="color: #0c21e8;">【同意】</span>
                                    <span class="content">{{item.content}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <!--
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核流程：">
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="audit" v-for="item in rows.comments" :key="item.id">
                            <div class="avatar">
                                <img src="../../assets/avatar.png" alt="">
                            </div>
                            <div class="info">
                                <div class="creator">
                                    <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    <span v-if="item.action == 'APPROVE'">【同意】</span>
                                    <span v-if="item.action == 'REJECT'">【驳回】</span>
                                </div>
                                <div class="content">{{item.content}}</div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-show="this.actions && this.actions.length > 0">
                    <Comment ref="comment"></Comment>
                    <div style="margin-top: 10px; height: 32px; position: relative;">
                        <el-button type="primary" size="small" v-bind:class="{ active: action.type == 'REJECT' }" :key="action.type" v-for="action in actions" @click="doComment(action)">{{action.name}}</el-button>
                    </div>
                </el-row>
                -->
            </el-form>
            <el-row v-if="comments && comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
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
                depict: '',
                costItem: '',
                repayItems: [],
                share: false,
                fullScreen: false,
                total: '',
                budget: {
                    est: false,
                    fundPlan: false
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
            array: [],
            actions: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'appFlowName',
            formName: 'expense_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    components: {
        Comment
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
        print() {
            this.$print(this.$refs.formupdate.$el);
        },
        getAgree() {
            this.array = [];
            let j = -1;
            for (var i = 0; i < this.comments.length; i++) {
                if (this.comments[i].action == 'REJECT') {
                    j = i;
                }
            }

            if (j == -1) {
                let arrayConst = [];
                let boolean = false;
                for (var i = 0; i < this.comments.length; i++) {
                    if (
                        this.comments[i + 1] &&
                        this.comments[i + 1].action == 'PULL'
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
                        if (data.action != null && data.action == 'APPROVE') {
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
                        this.comments[a + 1].action == 'PULL'
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
                        if (data.action != null && data.action == 'APPROVE') {
                            this.array.push(data);
                        }
                    }
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
                depict: '',
                costItem: '',
                repayItems: [],
                share: false,
                total: '',
                budget: {
                    est: false,
                    fundPlan: false
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
            // $self.crumbs =  {items: crumbs.data, index: -1};
            // for(var i= 0; i<$self.crumbs.items.length; i++){
            //     if($self.crumbs.items[i].active){
            //         $self.crumbs.index = i;
            //     }
            // }
        },
        //驳回操作
        rejectPut() {
            if (this.tableData.borrow.borrowId != '') {
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
        }
    }
};
</script>
<style lang="scss" scope>
#ReimbursementDetail {
    .titlename {
        color: #1c47f3;
        text-decoration: underline;
    }
    .el-step__main {
        margin-top: 10px;
    }
    // table {
    //     border-collapse: collapse;
    //     margin: 0 auto;
    //     text-align: center;
    //     width: 100%;
    // }
    // table td,
    // table th {
    //     border: 1px solid #000;
    //     color: #000;
    //     height: 30px;
    //     vertical-align: middle;
    // }
    // table thead th {
    //     background-color: #cce8eb;
    // }
    // table tr:nth-child(odd) {
    //     background: #fff;
    // }
    // table tr:nth-child(even) {
    //     background: #fff;
    // }
    .attachments {
        margin-left: 10px;
        width: 170px;
        //height: 120px;
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
    .active {
        float: left;
        margin-right: 10px;
    }
    #actionList {
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        height: 40px;
        font-weight: bold;
        width: 100%;
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