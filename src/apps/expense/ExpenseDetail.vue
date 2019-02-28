<template>
    <div id="ExpenseDetail" :class="{fullScreen:fullScreen}">
        <!--
        <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps>
        -->
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
            <el-form :model='rows' class="demo-form-inline" ref="formupdate">
                <p style="text-align: center;">{{rows.type}}</p>
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                        <el-form-item label="流水单号：">
                            {{rows.no}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：">
                            {{rows.submissionName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7" v-if="this.rows.type=='国际差旅报销'">
                        <el-form-item label="出差人最高职务：">
                            {{rows.topPower}}
                        </el-form-item>
                    </el-col>
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
                            {{rows.creatorName}}
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            {{rows.organName}}
                        </td>
                        <td>
                            提单时间
                        </td>
                        <td colspan="2">
                            {{rows.created}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            收款人
                        </td>
                        <td>
                            {{rows.payee}}
                        </td>
                        <td>
                            开户行
                        </td>
                        <td colspan="2">
                            {{rows.bank}}
                        </td>
                        <td>
                            银行卡号
                        </td>
                        <td colspan="2">
                            {{rows.cardNo}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            结算方式
                        </td>
                        <td>
                            {{rows.clearing}}
                        </td>
                        <td>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{rows.expenseDep}}
                        </td>
                        <td>
                            分摊
                        </td>
                        <td colspan="2">
                            {{rows.share == true ? '是' : '否'}}
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
                        <td colspan="2">
                            费用类别
                        </td>
                        <td>
                            费用描述
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
                            费用归属项目
                        </td>
                    </tr>
                    <tr v-for="item in rows.repayItems" :key="item.index">
                        <td colspan="2">
                            {{item.bigTypeName}}/{{item.smallTypeName}}
                        </td>
                        <td>
                            {{item.depict}}
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
                            <span style="float:left;"> {{this.rows.repayItems.length ==0 ? '￥': this.rows.repayItems[0].currency.curValue}}</span>
                            <span style="float:right;">{{parseFloat(this.rows.total).toLocaleString()}}</span>
                        </td>
                        <td>
                            金额大写
                        </td>
                        <td colspan="4">
                            <span> ({{this.rows.repayItems.length ==0 ? '人民币': this.rows.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.rows.upper}})</span>
                        </td>
                    </tr>
                    <tr v-show="false">
                        <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                    </tr>
                    <tr v-show="false">
                        <td>
                            预算金额
                        </td>
                        <td>
                            {{rows.budget.estSum}}
                        </td>
                        <td>
                            剩余预算金额
                        </td>
                        <td>
                            {{rows.budget.surplusSum}}
                        </td>
                        <td>
                            资金计划
                        </td>
                        <td>
                            {{rows.budget.fundPlan}}
                        </td>
                        <td>
                            剩余资金计划
                        </td>
                        <td>
                            {{rows.budget.surplusPlan}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <el-radio-group v-model="rows.budgetSure" disabled>
                                <el-radio :label="true">预算外</el-radio>
                                <el-radio :label="false">预算内</el-radio>
                            </el-radio-group>
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
                            {{rows.borrow.bor ? '是': '否'}}
                        </td>
                        <td colspan="2">
                            {{rows.borrow.borrowOdd}}
                            <el-tooltip class="item" effect="dark" content="查看" placement="left" v-show="this.rows.borrow.borrowOdd">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="ViewDetail('borrow')"></el-button>
                            </el-tooltip>
                        </td>
                        <td>
                            {{parseFloat(this.rows.borrow.noVerify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                        {{parseFloat(this.rows.borrow.verify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                            {{rows.borrow.sendDack? '是' : '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td>应付金额({{this.rows.repayItems.length ==0 ? '￥': this.rows.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                         {{parseFloat(this.rows.borrow.payAble).toLocaleString()}}
                        </td>
                        <td>应退金额({{this.rows.repayItems.length ==0 ? '￥': this.rows.repayItems[0].currency.curValue}})</td>
                        <td colspan="3">
                        {{parseFloat(this.rows.borrow.shouldBack).toLocaleString()}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            金额大写
                        </td>
                        <td colspan="6">
                            ({{this.rows.repayItems.length ==0 ? '人民币': this.rows.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.rows.borrow.upperSum}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;" v-show="rows.share == true">
                            分摊明细
                        </td>
                    </tr>
                    <tr v-show="rows.share == true">
                        <td colspan="2">
                            承担单位
                        </td>
                        <td>
                            承担部门
                        </td>
                        <td>
                            承担金额({{this.rows.repayItems.length ==0 ? '￥': this.rows.repayItems[0].currency.curValue}})
                        </td>
                        <td colspan="3">
                            金额大写【{{this.rows.repayItems.length ==0 ? '人民币': this.rows.repayItems[0].currency.label}}】
                        </td>
                        <td>
                            分摊比例(%)
                        </td>
                    </tr>
                    <tr v-for="item in rows.shares" :key="item.index" v-show="rows.share == true">
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
                            <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
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
            <el-row v-if="this.rows.comments && this.rows.comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
                    <div class="items">
                        <div class="item" v-for="item in this.rows.comments" :key="item.id">
                            <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                            <div class="info">
                                <div class="creator">
                                    <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
                                    <span v-if="item.action == 'APPROVE'">【同意】</span>
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
                    <el-form-item v-show="this.showBuget == true">
                        <el-radio-group v-model="rows.budgetSure" :disabled="this.showDisabled">
                            <el-radio :label="true">预算外</el-radio>
                            <el-radio :label="false">预算内</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
export default {
    name: 'ExpenseDetail',
    data() {
        return {
            listData: {},
            rows: {
                no: '',
                type: '',
                budgetSure: false,
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
            typeSelectForeign: [
                'domTravels',
                'interTravels',
                'dailyExpenses',
                'donates',
                'enterExpenses',
                'boardFees',
                'awards'
            ],
            typeSelectChinese: [
                '国内差旅报销',
                '国际差旅报销',
                '日常支出(对私)',
                '捐赠',
                '招待费',
                '董事会费',
                '年度绩效及特别奖励'
            ],
            approveWord: false,
            type: '',
            actions: [],
            value: [],
            crumb: { items: [] },
            borrowOddSelections: [],
            currentPayeeId: 8374564,
            combinedUnit: [],
            borrowPerson: [],
            array: [],
            users: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            fullScreen: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            showDisabled: true,
            showBuget: false
        };
    },
    props: ['formId'],
    mounted() {
        this.getForm();
        this.getAllUsers();
    },
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
                this.getAllUsers();
            } else {
                this.rows = {};
            }
        }
    },
    components: {
        Comment
    },
    methods: {
        ViewDetail(view) {
            if (view == 'borrow') {
                if (
                    this.rows.borrow.borrowId &&
                    this.rows.borrow.borrowId != ''
                ) {
                    this.common.open(
                        '#/apps/loan/' + this.rows.borrow.borrowId
                    );
                }
            } else if (view == 'chengbao') {
                if (this.rows.submissionId && this.rows.submissionId != '') {
                    this.common.open(
                        '#/apps/submission/' + this.rows.submissionId
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
            for (var i = 0; i < this.rows.comments.length; i++) {
                if (this.rows.comments[i].action == 'REJECT') {
                    j = i;
                }
            }

            if (j == -1) {
                let arrayConst = [];
                let boolean = false;
                for (var i = 0; i < this.rows.comments.length; i++) {
                    if (
                        this.rows.comments[i + 1] &&
                        this.rows.comments[i + 1].action == 'PULL'
                    ) {
                    } else {
                        arrayConst.push(this.rows.comments[i]);
                    }
                    if (i == this.rows.comments.length - 1) {
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
                for (var a = j + 1; a < this.rows.comments.length; a++) {
                    if (
                        this.rows.comments[a + 1] &&
                        this.rows.comments[a + 1].action == 'PULL'
                    ) {
                    } else {
                        arrayreject.push(this.rows.comments[a]);
                    }
                    if (a == this.rows.comments.length - 1) {
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
        getRejectList() {
            const self = this;
            axios
                .get('/api/v1/expenses/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        //获得输入类型
        getType() {
            if (this.typee != '') {
                for (let i = 0; i < this.typeSelectChinese.length; i++) {
                    if (this.typeSelectChinese[i] == this.typee) {
                        this.type = String(i);
                    }
                }
            }
        },
        //调取关联借款单号的接口
        getBorrowOdd(val) {
            if (val && val != '') {
                const self = this;
                axios
                    .get('/api/v1/expense_forms/queryNumbers/' + val)
                    .then(res => {
                        this.borrowOddSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        clearForm() {
            this.rows = {
                no: '',
                type: '',
                budgetSure: false,
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
        //根据值获得相应类型
        getTypeValue(value) {
            if (value) {
                axios.get('/api/v1/travel_forms/type/' + value).then(res => {
                    // return res.data.name;
                    // this.value.push(res.data.name);
                });
            }
        },
        getForm() {
            const self = this;
            self.clearForm();
            if (this.formId != '') {
                axios
                    .get('/api/v1/expense_forms/' + this.formId)
                    .then(res => {
                        this.listData = res.data;
                        if (res.data.borrow == null) {
                            self.rows.borrow.payAble = res.data.total;
                            self.rows.borrow.upperSum = res.data.upper;
                        }
                        res.data.borrow =
                            res.data.borrow == null
                                ? self.rows.borrow
                                : res.data.borrow;
                        self.rows = res.data;
                        if (self.rows.type != '') {
                            for (
                                let i = 0;
                                i < this.typeSelectChinese.length;
                                i++
                            ) {
                                if (
                                    this.typeSelectChinese[i] == self.rows.type
                                ) {
                                    this.type = String(i);
                                    this.getActions();
                                }
                            }
                        }
                        self.getAgree();
                        if (self.currentAction.type == 'REJECT') {
                            self.rejectPut();
                        }
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
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        getActions() {
            this.showDisabled = true;
            /** 
            this.actions.push(
                { type: 'APPROVE', name: '同意' },
                { type: 'REJECT', name: '驳回' }
            );
            console.log('zzheshi');
            console.log(this.actions);
            */

            const param = this.formId;
            axios
                .get(
                    '/api/v1/' +
                        this.typeSelectForeign[parseInt(this.type)] +
                        '/' +
                        param +
                        '/actions'
                )
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
            axios
                .get(
                    '/api/v1/' +
                        this.typeSelectForeign[parseInt(this.type)] +
                        '/' +
                        this.formId +
                        '/crumb'
                )
                .then(res => {
                    this.crumb = { items: res.data, index: -1 };
                    res.data.forEach((item, index) => {
                        if (item.active) {
                            if (
                                item.key == 'Task_03' &&
                                this.$store.getters.LoginData.uname == '张宁昕'
                            ) {
                                this.showDisabled = false;
                            }
                            this.crumbNodeName = item.name;
                            this.crumb.index = index;
                            if (item.assignes) {
                                item.name =
                                    item.name + '(' + item.assignes + ')';
                            }
                        }
                    });
                });
        },
        handleCommand(command) {
            this.rejectTarget = command[0];
            this.doComment(command[1]);
        },
        getRejectList() {
            let self = this;
            axios
                .get(
                    '/api/v1/' +
                        this.typeSelectForeign[parseInt(this.type)] +
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
        cleanForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.showBuget = false;
            this.textarea = '';
            this.submitData = {};
        },
        doAction(action) {
            this.cleanForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
                this.cleanForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(
                            '/api/v1/' +
                                this.typeSelectForeign[parseInt(this.type)] +
                                '/' +
                                this.formId +
                                '/pull'
                        )
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
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
                    this.seleteUserLabel = '请选择前加签人';
                }
            } else if ('fullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'closeFullScreen',
                    name: '关闭全屏'
                });
                this.fullScreen = true;
                //this.common.open(`/#/apps/annos/${this.formId}`);
            } else if ('closeFullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                this.fullScreen = false;
            } else if ('APPROVE'.includes(action.type)) {
                if (this.$store.getters.LoginData.uname == '张宁昕') {
                    this.showBuget = true;
                }
                this.dialogVisible = true;
            } else {
                this.dialogVisible = true;
            }
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/expense_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
                    node: this.crumbNodeName
                })
                .then(res => {
                    this.getActions();
                    this.getForm();
                    if (comment == 'formOnlyComment') {
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                });
        },
        onSubmit() {
            const self = this;
            if (
                this.currentAction.type == 'APPROVE' &&
                this.showDisabled == false
            ) {
                axios
                    .post(
                        '/api/v1/expense_forms/updateBudgetSure/' +
                            this.rows.id +
                            '?budgetSure=' +
                            this.rows.budgetSure,
                        '',
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        this.submitForm();
                    })
                    .catch(function() {
                        self.$message({
                            message: '预算信息保存失败',
                            type: 'error'
                        });
                    });
            } else {
                this.submitForm();
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
                        //this.rejectPut();
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
                if (self.currentAction.type == 'APPROVE') {
                    self.submitData.inbudget = this.rows.budgetSure;
                }
                axios
                    .put(
                        '/api/v1/' +
                            this.typeSelectForeign[parseInt(this.type)] +
                            '/' +
                            this.formId +
                            '/signal',
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        if (self.currentAction.type == 'CANCEL') {
                            self.$emit('refreshExpenseList');
                        }
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        },
        //驳回操作
        rejectPut() {
            /** 
            axios
                .put(
                    '/api/v1/expense_forms/' + this.formId + '/reject',
                    JSON.stringify({
                        status: '已驳回'
                    }),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    
                    */
            if (this.rows.borrow.borrowId != '') {
                axios
                    .put(
                        '/api/v1/expense_forms/' +
                            this.formId +
                            '/updateBorrow/' +
                            this.rows.borrow.borrowId,
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
        doComment(action) {
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();
            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }

            axios
                .put(`/api/v1/expense_forms/${this.formId}/comment`, {
                    content: comment,
                    action: action.type
                })
                .then(res => {
                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();
                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(
                                '/api/v1/' +
                                    this.typeSelectForeign[
                                        parseInt(this.type)
                                    ] +
                                    '/' +
                                    this.formId +
                                    '/signal',
                                {
                                    action: action.type,
                                    inbudget: this.approveWord,
                                    assignees: atIds,
                                    rejectTarget: this.rejectTarget
                                }
                            )
                            .then(res => {
                                this.getActions();
                            });
                    }
                });
        }
    }
};
</script>
<style lang="scss" >
#ExpenseDetail {
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
