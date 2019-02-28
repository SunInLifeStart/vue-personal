<template>
    <div id="PaymentForm">
        <div v-show="this.operationType == 'create'&& this.selectType == ''" style="margin-right:20px; margin-left:20px">
            <el-collapse v-for="(typeItem) in data1" :key="typeItem.index" v-model="activeName" accordion @change="handleChange">
                <el-collapse-item :title="(typeItem).name" :name='(typeItem).id'>
                    <div style="margin:8px">
                        <el-row>
                            <el-col :span="18">
                                <div>{{typeItem.describe}}</div>
                            </el-col>
                            <el-col :span="6">
                                <el-button style="float:right" size="mini" type="primary" @click="showForm(typeItem)">选择新增</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <div class="hehe">
                                    <p>{{typeItem.warn}}</p>
                                    <ul style="list-style:none">
                                        <li>{{typeItem.warn1}}</li>
                                        <li>{{typeItem.warn2}}</li>
                                        <li>{{typeItem.warn3}}</li>
                                        <li>{{typeItem.warn4}}</li>
                                        <li>{{typeItem.warn5}}</li>
                                        <li>{{typeItem.warn6}}</li>
                                    </ul>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div v-show="this.operationType !== 'create'||this.selectType == 'add'">
            <el-form :model='selectItem' ref="selectItem">
                <el-row>
                    <!-- <p style="text-align: center;">{{this.selectItem.type}}</p> -->
                    <h2 style="text-align: center;">{{this.selectItem.type}}</h2>
                </el-row>
                <br>
                <el-row style="margin-bottom:10px">
                    <el-col :span="7">
                        <!-- 流水号：{{selectItem.numericalOrder}} -->
                        <el-form-item label="流水号：">
                            {{selectItem.numericalOrder}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label='出差申请单：' :required="true" label-width="110px" v-show="this.selectItem.type == '国内差旅报销(对公)'">
                            <el-select v-model="selectItem.travelId" placeholder="选择出差申请单" @change="travelChange" v-show="this.selectItem.type == '国内差旅报销(对公)'">
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.selectItem.type == '国内差旅报销(对公)'">
                                <el-button type="text" style="margin-left: 5px;" icon="el-icon-view" @click="travelDetail"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='呈报件：' label-width="110px">
                            <el-select v-model="submission" placeholder="选择呈报件" @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出差人最高职权：" :required="true" label-width="140px" v-show="this.selectItem.type == '国际差旅报销(对公)'">
                            <el-select v-model="selectItem.ranks" placeholder="选择最高职权" @change="hignleaderChange">
                                <el-option v-for="item in hignLeaderSelections" :key="item.index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table style="width: 99%; height: 100%;margin-top: 5px; table-layout: fixed; word-break: break-all;">
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
                            提单人
                        </td>
                        <td>
                            <el-input v-model="selectItem.applicantName" disabled></el-input>
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="selectItem.organ" disabled></el-input>
                        </td>
                        <td>
                            提单时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="selectItem.applicantTime" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="span">*</span>
                            收款单位
                        </td>
                        <td>
                            <el-select v-if="this.selectItem.type=='委贷及借款支出' || this.selectItem.type=='结算中心-委贷及借款支出'" @change="selectReceiptUnit()" v-model="selectItem.receiptUnit" style="width:100%" filterable>
                                <el-option v-for="item in organsList" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                            <el-input v-else v-model="selectItem.receiptUnit"></el-input>
                        </td>
                        <td>
                            <span class="span">*</span>
                            开户行
                        </td>
                        <td colspan="2">
                            <el-input v-model="selectItem.openingLine"></el-input>
                        </td>
                        <td>
                            <span class="span">*</span>
                            银行账号
                        </td>
                        <td colspan="2">
                            <el-input v-model="selectItem.bankNumber"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="span">*</span>
                            结算方式
                        </td>
                        <td>
                            <!-- <el-input v-model="selectItem.settlement"></el-input> -->
                            <el-select v-model="selectItem.settlement" placeholder="请选择">
                                <el-option v-for="item in clearing_method" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <span class="span">*</span>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            <el-select v-model="selectItem.costUnit" style="width:100%" filterable>
                                <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            分摊
                        </td>
                        <td colspan="2">
                            <template>
                                <el-radio v-model="selectItem.allocation" label="是">是</el-radio>
                                <el-radio v-model="selectItem.allocation" label="否">否</el-radio>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            付款明细
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            支出类别|明细</td>
                        <td>
                            <span class="span">*</span>
                            支出说明</td>
                        <td>币种</td>
                        <td>
                            <span class="span">*</span>
                            金额</td>
                        <td>预估汇率</td>
                        <td>预估本币金额</td>
                        <td>费用归属项目</td>
                    </tr>
                    <tr v-for="(payItem,index) in this.selectItem.details" :key="payItem.index" @contextmenu.prevent="deleteItem(payItem,index,'payDetail')">
                        <td colspan="2">
                            <el-cascader v-model="payItem.type" placeholder="试试搜索" @change="selectChangeType(payItem,index)" :options="optionType" @focus="getSelectOptions" :props="prop" filterable style="width:100%"></el-cascader>
                        </td>
                        <td>
                            <el-input v-model="payItem.statement"></el-input>
                        </td>
                        <td>
                            <el-select v-model="payItem.currency" filterable @change="getDollar(payItem)">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="payItem.amount" @input="getAmount('payDetail',payItem)" class="money" style="text-align:right"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.rate" @input="getAmount('payDetail',payItem)"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.localAmount" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.costProject"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <el-button size="small" style="width:100%;" @click="addItem('payDetail')">插入</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="span">*</span>
                            合同号
                        </td>
                        <td colspan="2">
                            <el-autocomplete class="inline-input" v-model="selectItem.contract.numNo" :fetch-suggestions="querySearch1" :trigger-on-focus="true" @select="handleSelect('numNo')">
                                <template slot-scope="{ item }">
                                    <div style="color:green">{{ item.value=item.contractNum}}</div>
                                </template>
                            </el-autocomplete>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="contractNoDetail"></el-button>
                            </el-tooltip>
                        </td>
                        <td>
                            <span class="span">*</span>
                            合同名称
                        </td>
                        <td colspan="4">
                            <el-autocomplete class="inline-input" style="width:100%" v-model="selectItem.contract.name" :fetch-suggestions="querySearch" :trigger-on-focus="true" @select="handleSelect('name')">
                                <template slot-scope="{ item }">
                                    <div style="color:green">{{ item.value=item.contractName }}</div>
                                </template>
                            </el-autocomplete>
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3">
                            <span class="span">*</span>
                            合同金额
                        </td>
                        <td rowspan="3">
                            <el-input v-model="selectItem.contract.amount" @input="getAmount('contractDetail')"></el-input>
                        </td>
                        <td rowspan="3">
                            前期已付
                        </td>
                        <td>
                            累计已付款
                        </td>
                        <td>
                            <el-input v-model="selectItem.contract.payments" @input="getAmount('contractDetail')"></el-input>
                        </td>
                        <td rowspan="3">
                            未付金额
                        </td>
                        <td colspan="2" rowspan="3">
                            <el-input v-model="selectItem.contract.unAmount" disabled></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>累计付款比例</td>
                        <td>
                            <el-input v-model="selectItem.contract.cumulativePro" disabled></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>本次付款后累计支付比例</td>
                        <td>
                            <el-input v-model="selectItem.contract.cumulativeAfter" disabled></el-input>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td colspan="2">
                            预算金额
                        </td>
                        <td>
                            <el-input v-model="selectItem.contract.budgetAmount"></el-input>
                        </td>
                        <td colspan="2">
                            资金计划
                        </td>
                        <td colspan="3">
                            <el-input v-model="selectItem.contract.fundingPlan"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            剩余预算金额
                        </td>
                        <td>
                            <el-input v-model="selectItem.contract.reBudgetAmount"></el-input>
                        </td>
                        <td colspan="2">
                            剩余资金计划
                        </td>
                        <td colspan="3">
                            <el-input v-model="selectItem.contract.reFundingPlan"></el-input>
                        </td>
                    </tr> -->
                    <tr>
                        <td colspan="2">
                            支付金额
                        </td>
                        <td>
                            <!-- <el-input v-model="selectItem.contract.payAmount" disabled></el-input> -->
                            <el-row>
                                <el-col :span="8" align="left">{{this.dollar}}</el-col>
                                <el-col :span="16" align="right">{{selectItem.contract.payAmount}}</el-col>
                            </el-row>
                        </td>
                        <td>
                            金额大写
                        </td>
                        <td colspan="4">
                            （{{this.selectItem.details.length > 0 ? this.selectItem.details[0].currency : '人民币'}}：&nbsp;&nbsp;&nbsp;{{selectItem.contract.amountCap}}&nbsp;&nbsp;&nbsp;）
                        </td>
                    </tr>

                    <tr v-show="selectItem.allocation == '是'">
                        <td colspan="8">分摊明细（基本信息分摊选择是）</td>
                    </tr>
                    <tr v-show="selectItem.allocation == '是'">
                        <td colspan="2">承担单位</td>
                        <td>
                            <span class="span">*</span>
                            承担部门</td>
                        <td>支出项目</td>
                        <td>
                            <span class="span">*</span>
                            承担金额（{{this.dollar}}）</td>
                        <td colspan="2">金额大写({{this.selectItem.details.length > 0 ? this.selectItem.details[0].currency : '人民币'}})</td>
                        <td>分摊比例（%）</td>
                    </tr>
                    <tr v-show="selectItem.allocation == '是'" v-for="(shareItem,index) in this.selectItem.allocationDetails" :key="shareItem.index" @contextmenu.prevent="deleteItem(shareItem,index,'shareDetail')">
                        <td colspan="2">
                            <el-input v-model="shareItem.unit"></el-input>
                        </td>
                        <td>
                            <el-select v-model="shareItem.organ" style="width:100%" filterable>
                                <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="shareItem.project"></el-input>
                        </td>
                        <td>
                            <el-input v-model="shareItem.amount" @input="getAmount('shareDetail',shareItem)"></el-input>
                        </td>
                        <td colspan="2">
                            <el-input v-model="shareItem.amountCap" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="shareItem.proportion" disabled></el-input>
                        </td>
                    </tr>
                    <tr v-show="selectItem.allocation == '是'">
                        <td colspan="8">
                            <el-button size="small" style="width:100%;" @click="addItem('shareDetail')">插入</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">附件上传
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in selectItem.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div>
                        </td>
                    </tr>

                </table>
            </el-form>

        </div>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import { PAYMENT, CURRENCY } from '../data.js';
import cookies from 'js-cookie';

export default {
    name: 'PaymentForm',
    data() {
        return {
            titleType: '', //选择呈报件、选择出差申请单，标题
            clearing_method: [
                '网银',
                '电汇',
                '现金支票',
                '转账支票',
                '信汇',
                '现金',
                '存单'
            ],
            api: '',
            getoid: '',
            travelSelections: [], //出差申请单列表
            travelList: [],
            submission: '',
            hignlearder: '', //最高职权字段
            submissionSelections: [], //部门呈报件
            hignLeaderSelections: [
                '员工',
                '部长/副部长',
                '总经理助理/董事会秘书',
                '副总经理',
                '总经理',
                '董事长',
                '总经理和董事长'
            ],
            organs: [],
            organsList: [],
            selectType: '',
            cookie_uname: '',
            cookie_oname: '',
            cookie_oid: '',
            cookie_uid: '',
            restaurants: [],
            data1: PAYMENT['payType'],
            activeName: 1, //折叠面板
            info: '',
            selectItem: {
                travelId: '', //选择的出差申请单
                overBudget: false,
                type: '',
                ranks: '',
                numericalOrder: '', //流水号
                allocation: '否', //分摊
                submissionId: '',
                submissionName: '',
                costUnit: this.cookie_oname,
                organ: this.cookie_oname,
                applicantName: this.cookie_uname,
                applicantTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                details: [
                    //付款明细
                    {
                        type: [],
                        amount: 0,
                        rate: 1,
                        localAmount: 0,
                        currency: '人民币'
                    }
                ],
                contract: {
                    numNo: '',
                    contractId: '',
                    name: '',
                    payments: 0,
                    amount: 0,
                    budgetAmount: 0,
                    fundingPlan: 0,
                    reBudgetAmount: 0,
                    reFundingPlan: 0
                }, //合同信息
                allocationDetails: [{}], //分摊明细
                attachments: [] //附件
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options: CURRENCY['currency'],
            dollar: '￥', //币符
            prop: {
                value: 'code',
                label: 'name',
                children: 'children'
            },
            optionType: [],
            typeApi: [],
            addxtnht: false, //判断是否为系统内合同（true：是 ， false: 否）
            selectContract: {
                creatorId: cookies.get('uid'),
                creatorName: cookies.get('uname'),
                organId: cookies.get('oid'),
                organName: cookies.get('oname')
            }
        };
    },
    props: ['formId', 'operationType'],
    computed: {},
    mounted() {
        const self = this;
        this.getOrgan();
        this.getOrganList();
        this.getSubmissionlList();
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.selectItem.applicantName = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.organ = decodeURIComponent(item.split('=')[1]);
                self.selectItem.costUnit = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oid') > -1) {
                self.cookie_oid = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('uid') > -1) {
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
        });
        // this.getNum();
        this.loadAll();
    },
    watch: {
        formId: function() {
            this.getForm();
            this.loadAll();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            }
        }
    },
    methods: {
        //选择收款单位
        selectReceiptUnit() {
            for (let item of this.organsList) {
                if (item.name == this.selectItem.receiptUnit) {
                    this.selectItem.subOrganId = item.id.toString();
                }
            }
        },
        getDollar(type) {
            for (let item of this.options) {
                if (item.label == type.currency) {
                    this.dollar = item.dollar;
                }
            }
            if (this.selectItem.details.length > 1) {
                for (let index of this.selectItem.details) {
                    (index.currency = type.currency),
                        (index.estimateRate = type.estimateRate);
                }
            }
        },
        contractNoDetail() {
            if (
                this.selectItem.contract.contractId &&
                this.selectItem.contract.contractId != ''
            ) {
                this.common.open(
                    '#/apps/contract/' + this.selectItem.contract.contractId
                );
            }
        },
        //获得大类小类
        getType() {
            //国内差旅报销(对公)
            if (this.api == 'pubDomTravels') {
                this.typeApi.push('021001');
                this.getType1();
            }
            //国际差旅报销(对公)
            if (this.api == 'pubInterTravels') {
                this.typeApi.push('021001');
                this.getType2();
            }
            //日常支出-对公
            if (this.api == 'pubDailyExpenses') {
                this.typeApi.push('021001');
                // this.typeApi.push(212);
                this.typeApi.push('021002');
                this.typeApi.push('021003');
                this.typeApi.push('021004');

                this.typeApi.push('026001');
                this.typeApi.push('026002');
                this.typeApi.push('026003');
                this.typeApi.push('026004');
                this.typeApi.push('026005');
                // this.typeApi.push(266);
                // this.typeApi.push(267);
                // this.typeApi.push(268);
                this.typeApi.push('027001');
                this.typeApi.push('027002');
                this.typeApi.push('027003');
                this.typeApi.push('027004');
                this.typeApi.push('027005');
                this.typeApi.push('027006');
                this.typeApi.push('027007');
                this.typeApi.push('027008');
                this.getTypeRczc();
            }
            //招待费-对公
            if (this.api == 'pubEnterExpenses') {
                this.typeApi.push('021001');
                this.getType3();
            }
            //年度绩效及特别奖励-对公
            if (this.api == 'pubAwards') {
                this.typeApi.push('021001');
                this.getType4();
            }
            //缴纳税款
            if (this.api == 'paies') {
                this.typeApi.push('022001');
                this.typeApi.push('022002');
                this.typeApi.push('022003');
                this.typeApi.push('022004');
                this.typeApi.push('022005');
                this.getTypeO();
            }
            //对外还款
            if (this.api == 'refunds') {
                this.typeApi.push('023001');
                this.getTypeO();
            }
            //委贷或借款支出
            if (this.api == 'loanbies') {
                this.typeApi.push('024002');
                this.getTypeO();
            }
            //董事会费
            if (this.api == 'pubBoardFees') {
                this.typeApi.push('021001');
                this.getType5();
            }
            //项目、代持
            if (this.api == 'investProjects' || this.api == 'investHelds') {
                this.typeApi.push('024001');
                this.getTypeO();
            }
            //全部（资金划转、购买理财、分红及捐赠）
            if (
                this.api == 'transfers' ||
                this.api == 'moneyManagements' ||
                this.api == 'pubDonates' ||
                this.api == 'withdrawCashes' ||
                this.api == 'settleTransfers' ||
                this.api == 'settleLoans' ||
                this.api == 'settleDailyExpenses'
            ) {
                this.typeApi.push('011001');
                this.typeApi.push('011002');

                this.typeApi.push('012001');
                this.typeApi.push('012002');

                this.typeApi.push('013001');
                this.typeApi.push('013002');
                this.typeApi.push('013003');
                this.typeApi.push('013004');
                this.typeApi.push('013005');
                this.typeApi.push('013006');

                this.typeApi.push('014001');
                this.typeApi.push('014002');
                this.typeApi.push('014003');

                this.typeApi.push('021001');

                // this.typeApi.push(212);
                this.typeApi.push('021002');
                this.typeApi.push('021003');
                this.typeApi.push('021004');

                this.typeApi.push('022001');
                this.typeApi.push('022002');
                this.typeApi.push('022003');
                this.typeApi.push('022004');
                this.typeApi.push('022005');
                // this.typeApi.push(226);

                this.typeApi.push('023001');

                this.typeApi.push('024001');
                this.typeApi.push('024002');

                this.typeApi.push(251);

                this.typeApi.push('026001');
                this.typeApi.push('026002');
                this.typeApi.push('026003');
                this.typeApi.push('026004');
                this.typeApi.push('026005');
                // this.typeApi.push(266);
                // this.typeApi.push(267);
                // this.typeApi.push(268);

                this.typeApi.push('027001');
                this.typeApi.push('027002');
                this.typeApi.push('027003');
                this.typeApi.push('027004');
                this.typeApi.push('027005');
                this.typeApi.push('027006');
                this.typeApi.push('027007');
                this.typeApi.push('027008');
                this.getTypeO(this.typeApi);
            }
        },
        //国内差旅报销(对公)
        getType1() {
            this.optionType = [];
            for (let item of this.typeApi) {
                axios.get('/api/v1/reim/code/' + item).then(res => {
                    let linshi = res.data[0];
                    let linshi2 = linshi.children;
                    let linshiSub = [];
                    let linshi3 = [];
                    for (let item of linshi2) {
                        if (item.code == '021001020') {
                            linshi3.push(item);
                            for (let subitem of item.children) {
                                if (subitem.code != '021001020007') {
                                    linshiSub.push(subitem);
                                }
                            }
                        }
                    }
                    linshi3[0].children = linshiSub;
                    linshi.children = linshi3;
                    this.optionType.push(linshi);
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        //国际差旅报销(对公)
        getType2() {
            this.optionType = [];
            for (let item of this.typeApi) {
                axios.get('/api/v1/reim/code/' + item).then(res => {
                    let linshi = res.data[0];
                    let linshi2 = linshi.children;
                    let linshiSub = [];
                    let linshi3 = [];
                    for (let item of linshi2) {
                        if (item.code == '021001019') {
                            linshi3.push(item);
                            for (let subitem of item.children) {
                                if (subitem.code != '021001019007') {
                                    linshiSub.push(subitem);
                                }
                            }
                        }
                    }
                    linshi3[0].children = linshiSub;
                    linshi.children = linshi3;
                    this.optionType.push(linshi);
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        getType3() {
            this.optionType = [];
            for (let item of this.typeApi) {
                axios.get(' /api/v1/reim/code/' + item).then(res => {
                    let linshi = res.data[0];
                    let linshi2 = res.data[0].children;
                    let linshi3 = [];
                    for (let item of linshi2) {
                        if (item.code == '021001018') {
                            linshi3.push(item);
                        }
                    }
                    linshi.children = linshi3;
                    this.optionType.push(linshi);
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        getType4() {
            this.optionType = [];
            for (let item of this.typeApi) {
                axios.get(' /api/v1/reim/code/' + item).then(res => {
                    let linshi = res.data[0];
                    let linshi2 = res.data[0].children;
                    let linshi3 = [];
                    for (let item of linshi2) {
                        if (
                            item.code == '021001001' ||
                            item.code == '021001002'
                        ) {
                            linshi3.push(item);
                        }
                    }
                    linshi.children = linshi3;
                    this.optionType.push(linshi);
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        getType5() {
            this.optionType = [];
            for (let item of this.typeApi) {
                axios.get(' /api/v1/reim/code/' + item).then(res => {
                    let linshi = res.data[0];
                    let linshi2 = res.data[0].children;
                    let linshi3 = [];
                    for (let item of linshi2) {
                        if (item.code == '021001023') {
                            linshi3.push(item);
                        }
                    }
                    linshi.children = linshi3;
                    this.optionType.push(linshi);
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        getTypeRczc() {
            for (let item of this.typeApi) {
                axios.get('/api/v1/reim/code/' + item).then(res => {
                    if (res.data) {
                        if (item == '021001') {
                            let linshi = res.data[0];
                            let linshi2 = [];
                            for (let item of linshi.children) {
                                if (
                                    item.code != '021001019' &&
                                    item.code != '021001020'
                                ) {
                                    linshi2.push(item);
                                }
                            }
                            linshi.children = linshi2;
                            this.optionType.push(linshi);
                        } else {
                            this.optionType.push(res.data[0]);
                        }
                    }
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        getTypeO() {
            for (let item of this.typeApi) {
                axios.get('/api/v1/reim/code/' + item).then(res => {
                    if (res.data[0]) {
                        this.optionType.push(res.data[0]);
                    }
                });
            }
            for (let data of this.optionType) {
                data.disabled = false;
            }
            this.typeApi = [];
        },
        //大类小类固定选择
        getSelectOptions() {
            if (
                this.selectItem.details.length > 1 &&
                this.selectItem.details[0].type[0]
            ) {
                const param = this.selectItem.details[0].type[0];
                for (let data of this.optionType) {
                    if (data) {
                        if (data.code != param) {
                            data.disabled = true;
                        }
                    }
                }
            } else {
                for (let data of this.optionType) {
                    if (data) {
                        data.disabled = false;
                    }
                }
            }
        },
        //获得费用承担部门
        getOrgan() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.organs = res.data;
            });
        },
        //获得收款单位,分管子公司主管领导由收款单位决定
        getOrganList() {
            axios.get('/api/v1/users/sub/organ/list').then(res => {
                console.log(res);
                this.organsList = res.data;
            });
        },
        //计算预估本币金额,未付款，累计付款比例,分摊比例,本次付款后累计支付比例
        getAmount(type, Item) {
            if (type == 'payDetail') {
                if (this.selectItem.details.length > 1) {
                    for (let index of this.selectItem.details) {
                        index.rate = Item.rate;
                        if (index.amount && index.rate) {
                            index.localAmount = this.common.toDecimal2(
                                index.amount * index.rate
                            );
                        } else {
                            index.localAmount = 0;
                        }
                    }
                } else if (Item.amount && Item.rate) {
                    Item.localAmount = this.common.toDecimal2(
                        Item.amount * Item.rate
                    );
                } else {
                    Item.localAmount = 0;
                }
                this.totalPayment();
            }
            if (type == 'contractDetail') {
                if (this.selectItem.contract.amount != 0) {
                    if (
                        this.selectItem.contract.amount &&
                        this.selectItem.contract.payments
                    ) {
                        this.selectItem.contract.unAmount =
                            this.selectItem.contract.amount -
                            this.selectItem.contract.payments;
                        this.selectItem.contract.cumulativePro = this.common.toDecimal5(
                            this.selectItem.contract.payments /
                                this.selectItem.contract.amount
                        );
                    } else {
                        this.selectItem.contract.unAmount = this.selectItem.contract.amount;
                        this.selectItem.contract.cumulativePro = '0.0';
                    }
                } else {
                    this.selectItem.contract.unAmount = this.selectItem.contract.amount;
                    this.selectItem.contract.cumulativePro = '0.0';
                }
            }
            if (type == 'shareDetail') {
                let shareSum = 0;
                for (let data of this.selectItem.allocationDetails) {
                    if (data.amount) {
                        shareSum += parseFloat(data.amount);
                    }
                }
                let allSum = parseFloat(this.selectItem.contract.payAmount);
                for (let data2 of this.selectItem.allocationDetails) {
                    if (data2.amount) {
                        data2.amountCap = this.common.DX(data2.amount);
                        let ftbl = data2.amount / allSum * 100;
                        data2.proportion = this.common.toDecimal2(ftbl);
                    } else {
                        data2.proportion = '0.0';
                        data2.amountCap = '';
                    }
                }
            }
            if (this.selectItem.contract.amount != 0) {
                if (
                    this.selectItem.contract.amount &&
                    this.selectItem.contract.payments &&
                    this.selectItem.contract.payAmount
                ) {
                    const fenzi =
                        parseFloat(this.selectItem.contract.payments) +
                        parseFloat(this.selectItem.contract.payAmount);
                    this.selectItem.contract.cumulativeAfter = this.common.toDecimal5(
                        fenzi / this.selectItem.contract.amount
                    );
                } else {
                    this.selectItem.contract.cumulativeAfter = this.selectItem.contract.cumulativePro;
                }
            } else {
                this.selectItem.contract.cumulativeAfter = this.selectItem.contract.cumulativePro;
            }
        },
        //支付金额计算
        totalPayment() {
            let sum = 0;
            for (let data of this.selectItem.details) {
                sum += parseFloat(data.amount);
            }
            this.selectItem.contract.payAmount = this.common.toDecimal2(sum);
            this.selectItem.contract.amountCap = this.common.DX(sum);
            if (this.selectItem.allocationDetails[0].amount) {
                this.getAmount('shareDetail');
            }
        },
        clearForm() {
            this.selectItem = {
                type: '',
                ranks: '',
                subOrganId: '',
                numericalOrder: '', //流水号
                allocation: '否', //分摊
                organ: this.cookie_oname,
                costUnit: this.cookie_oname,
                applicantName: this.cookie_uname,
                applicantTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                submissionName: '',
                submissionId: '',
                details: [
                    //付款明细
                    {
                        amount: 0,
                        rate: 1,
                        localAmount: 0,
                        currency: '人民币',
                        bigType: '',
                        centreType: '',
                        smallType: '',
                        type: []
                    }
                ],
                contract: {
                    numNo: '',
                    contractId: '',
                    name: '',
                    budgetAmount: 0,
                    fundingPlan: 0,
                    reBudgetAmount: 0,
                    reFundingPlan: 0,
                    payments: 0,
                    amount: 0
                }, //合同信息
                allocationDetails: [{}], //分摊明细
                attachments: [] //附件
            };
            this.dollar = '￥';
            this.selectType = '';
            this.optionType = [];
            this.$emit('info', '');
        },
        addItem(type) {
            if (type == 'payDetail') {
                if (this.selectItem.details.length > 0) {
                    this.selectItem.details.push({
                        currency: this.selectItem.details[0].currency,
                        rate: this.selectItem.details[0].rate,
                        localAmount: 0,
                        amount: 0
                    });
                } else {
                    this.selectItem.details.push({
                        currency: '人民币',
                        rate: 1,
                        localAmount: 0,
                        amount: 0
                    });
                }
            }
            if (type == 'shareDetail') {
                this.selectItem.allocationDetails.push({});
            }
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'payDetail') {
                    if (item.id) {
                        axios
                            .get('/api/v1/payment_forms/delDetails/' + item.id)
                            .then(res => {
                                this.selectItem.details.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.selectItem.details.splice(index, 1);
                    }
                }
                if (type == 'shareDetail') {
                    if (item.id) {
                        axios
                            .get(
                                '/api/v1/payment_forms/delAllDetails/' + item.id
                            )
                            .then(res => {
                                this.selectItem.allocationDetails.splice(
                                    index,
                                    1
                                );
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.selectItem.allocationDetails.splice(index, 1);
                    }
                }
            });
        },
        saveContract(action) {
            const self = this;
            this.selectContract.contractName = this.selectItem.contract.name;
            this.selectContract.contractNum = this.selectItem.contract.numNo;
            this.selectContract.contractAmount = this.selectItem.contract.amount;
            this.selectContract.inOutSys = '系统外合同';
            axios
                .post(
                    '/api/v1/contract_forms/save',
                    JSON.stringify(this.selectContract),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.selectItem.contract.contractId = res.data.id;
                    this.addxtnht = false;
                    this.saveForm1(action);
                })
                .catch(function() {
                    self.$message({
                        message: '系统外合同保存失败',
                        type: 'error'
                    });
                });
        },
        saveForm(action) {
            const self = this;
            for (let item of this.restaurants) {
                if (
                    (item.contractNum == this.selectItem.contract.numNo ||
                        item.id == this.selectItem.contract.numNo) &&
                    item.contractName == this.selectItem.contract.name
                ) {
                    this.addxtnht = true;
                }
            }
            if (
                this.selectItem.contract.numNo == '' ||
                this.selectItem.contract.numNo == null ||
                (this.selectItem.contract.numNo == '空' &&
                    this.selectItem.contract.name == '') ||
                this.selectItem.contract.name == null ||
                this.selectItem.contract.name == '空'
            ) {
                this.addxtnht = true;
            }

            if (this.selectItem.costUnit == '集团领导') {
                self.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else if (this.addxtnht) {
                this.saveForm1(action);
                this.addxtnht = false;
            } else {
                this.$confirm('合同信息为系统外合同,是否添加?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.saveContract(action);
                });
            }
        },
        saveForm1(action = '') {
            const self = this;
            this.selectItem.overBudget = false;
            if (
                parseFloat(this.selectItem.contract.payAmount) >
                    parseFloat(this.selectItem.contract.reBudgetAmount) ||
                parseFloat(this.selectItem.contract.payAmount) >
                    parseFloat(this.selectItem.contract.reFundingPlan)
            ) {
                this.selectItem.overBudget = true;
            }
            if (self.selectItem.applicantTime) {
                self.selectItem.applicantTime = moment(
                    self.selectItem.applicantTime
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                self.selectItem.applicantTime = '';
            }
            if (this.submission != '') {
                this.selectItem.submissionId = this.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.submission) {
                        this.selectItem.submissionName = data.submissionNo;
                    }
                }
            }
            console.log(this.selectItem);
            axios
                .post(
                    '/api/v1/payment_forms/save',
                    JSON.stringify(this.selectItem),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (action == 'save') {
                        this.$confirm(
                            '请确认所有单据齐全，整齐平铺粘贴于A4纸上，并在首张单据右上角空白处注明流水单号后交到资金财务部。是否确认提交？',
                            '提示',
                            {
                                type: 'warning'
                            }
                        ).then(() => {
                            self.submitForm();
                        });
                    } else {
                        self.$emit('refreshData');
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.info = 'success';
                        this.$emit('info', this.info);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        selectChangeType(item, index) {
            item.bigType = '';
            item.centreType = '';
            item.smallType = '';
            if (item.type[0]) {
                item.bigTypeId = item.type[0];
                axios.get('/api/v1/reim/code/' + item.type[0]).then(res => {
                    item.bigType = res.data[0].name;
                });
            }
            if (item.type[1]) {
                item.centreTypeId = item.type[1];
                axios.get('/api/v1/reim/code/' + item.type[1]).then(res => {
                    item.centreType = res.data[0].name;
                });
            }
            if (item.type[2]) {
                item.smallTypeId = item.type[2];
                axios.get('/api/v1/reim/code/' + item.type[2]).then(res => {
                    item.smallType = res.data[0].name;
                });
            }
        },
        submitCheck(type) {
            if (this.selectItem.type == '国际差旅报销(对公)') {
                if (
                    this.selectItem.ranks == '' ||
                    this.selectItem.ranks == null
                ) {
                    this.$message({
                        message: '出差人最高职权不能为空，请输入',
                        type: 'error'
                    });
                } else {
                    this.submitCheck1(type);
                }
            } else if (this.selectItem.type == '国内差旅报销(对公)') {
                if (
                    this.selectItem.travelId == '' ||
                    this.selectItem.travelId == null
                ) {
                    this.$message({
                        message: '出差申请单不能为空，请输入',
                        type: 'error'
                    });
                } else {
                    this.submitCheck1(type);
                }
            } else {
                this.submitCheck1(type);
            }
        },
        submitCheck1(type) {
            if (this.rulesCheck() == true && this.rulesCheckFkmx() == true) {
                if (
                    this.ruleHint() == true &&
                    this.rulesCheckFkmxTs() == true &&
                    this.rulesCheckFtTs() == true
                ) {
                    this.saveForm(type);
                } else {
                    this.$confirm('信息不够完善，是否要继续操作', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.saveForm(type);
                    });
                }
            }
        },
        //输入项警告检查
        ruleHint() {
            let ruleHint = true;

            if (
                this.selectItem.contract.numNo == '' ||
                this.selectItem.contract.numNo == null
            ) {
                ruleHint = false;
            } else if (
                this.selectItem.contract.name == '' ||
                this.selectItem.contract.name == null
            ) {
                ruleHint = false;
            } else if (
                this.selectItem.contract.amount == '' ||
                this.selectItem.contract.amount == null
            ) {
                ruleHint = false;
            } else {
                ruleHint = true;
            }
            if (!ruleHint) {
                this.selectItem.contract.numNo = '空';
                this.selectItem.contract.name = '空';
                this.selectItem.contract.amount = 0;
            }
            return ruleHint;
        },
        //必输项检查
        rulesCheck() {
            if (
                this.selectItem.receiptUnit == '' ||
                this.selectItem.receiptUnit == null
            ) {
                this.$message({
                    message: '收款单位不能为空，请输入',
                    type: 'error'
                });
            } else if (
                this.selectItem.openingLine == '' ||
                this.selectItem.openingLine == null
            ) {
                this.$message({
                    message: '开户行不能为空，请输入',
                    type: 'error'
                });
            } else if (
                this.selectItem.bankNumber == '' ||
                this.selectItem.bankNumber == null
            ) {
                this.$message({
                    message: '银行卡号/银行账户不能为空，请输入',
                    type: 'error'
                });
            } else if (
                this.selectItem.settlement == '' ||
                this.selectItem.settlement == null
            ) {
                this.$message({
                    message: '结算方式不能为空，请输入',
                    type: 'error'
                });
            } else {
                return true;
            }
        },
        //付款明细填写完整度校验-非必输项，只提示
        rulesCheckFkmxTs() {
            let compareFkmxTs = true;
            for (let item of this.selectItem.details) {
                if (item.statement == '') {
                    compareFkmxTs = false;
                }
            }
            return compareFkmxTs;
        },
        //分摊信息填写完整度校验-非必输项，只提示
        rulesCheckFtTs() {
            let compareFtTs = true;
            if (this.selectItem.allocation == '是') {
                for (let item of this.selectItem.allocationDetails) {
                    if (
                        item.organ == null ||
                        item.organ == '' ||
                        item.amount == null ||
                        item.amount == ''
                    ) {
                        compareFtTs = false;
                    }
                }
            } else {
                compareFtTs = true;
            }
            return compareFtTs;
        },
        //付款明细填写完整度校验
        rulesCheckFkmx() {
            let compare = true;
            for (let item of this.selectItem.details) {
                if (item.type) {
                    if (
                        item.type.length == 0 ||
                        item.statement == '' ||
                        item.amount == ''
                    ) {
                        compare = false;
                    }
                } else {
                    compare = false;
                }
            }
            if (!compare) {
                this.$message({
                    message: '付款明细信息填写不完整，请输入',
                    type: 'error'
                });
            }
            return compare;
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/' +
                        this.api +
                        '/' +
                        this.currentFormId +
                        '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                    this.info = 'success';
                    this.$emit('info', this.info);
                })
                .catch(function() {
                    self.$message({
                        message: 'create操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/payment_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: 'commit操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            for (let item of this.organs) {
                if (item.name == this.selectItem.costUnit) {
                    this.getoid = item.id;
                }
            }
            let params;
            if (this.selectItem.type == '国际差旅报销(对公)') {
                params = {
                    action: 'COMMIT',
                    subOrganId: this.selectItem.subOrganId,
                    oid: this.getoid.toString(),
                    position: this.selectItem.ranks,
                    inbudget: this.selectItem.overBudget,
                    money: String(
                        this.common.toDecimal2(
                            this.selectItem.contract.payAmount *
                                this.selectItem.details[0].rate
                        )
                    )
                };
            } else if (this.selectItem.type == '国内差旅报销(对公)') {
                let array = [];
                if (this.travelList.length > 0) {
                    for (let data of this.travelList) {
                        array.push(data.bid);
                    }
                }
                params = {
                    action: 'COMMIT',
                    assignees: array,
                    subOrganId: this.selectItem.subOrganId,
                    oid: this.getoid.toString(),
                    inbudget: this.selectItem.overBudget,
                    money: String(
                        this.common.toDecimal2(
                            this.selectItem.contract.payAmount *
                                this.selectItem.details[0].rate
                        )
                    )
                };
            } else {
                params = {
                    action: 'COMMIT',
                    oid: this.getoid.toString(),
                    subOrganId: this.selectItem.subOrganId,
                    //是否需要总经理审批
                    inbudget: this.selectItem.overBudget,
                    money: String(
                        this.common.toDecimal2(
                            this.selectItem.contract.payAmount *
                                this.selectItem.details[0].rate
                        )
                    )
                };
            }
            axios
                .put(
                    '/api/v1/' +
                        this.api +
                        '/' +
                        this.currentFormId +
                        '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.$emit('refreshData');
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.comment();
                })
                .catch(function() {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/payment_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/payment_forms/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
                        this.submission = res.data.submissionId;
                        // this.submission = res.data.submissionName;

                        for (let item of this.options) {
                            if (item.label == res.data.details[0].currency) {
                                this.dollar = item.dollar;
                            }
                        }
                        let array = [];
                        for (let type1 of res.data.details) {
                            // type1.type = ["021001", "021001020", "021001020003"]
                            if (type1.bigTypeId) {
                                type1.type = [type1.bigTypeId.toString()];
                                if (type1.centreTypeId) {
                                    type1.type = [
                                        type1.bigTypeId.toString(),
                                        type1.centreTypeId.toString()
                                    ];
                                    if (type1.smallTypeId) {
                                        type1.type = [
                                            type1.bigTypeId.toString(),
                                            type1.centreTypeId.toString(),
                                            type1.smallTypeId.toString()
                                        ];
                                    }
                                }
                            }
                        }
                        this.optionType = [];
                        for (let item of this.data1) {
                            if (this.selectItem.type == item.name) {
                                this.api = item.api;
                                this.getType();
                            }
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
        //最高职权发生变化
        hignleaderChange() {},
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            if (cookies.get('uid') != '') {
                axios
                    .post(
                        '/api/v1/submission_forms/queryDone/' +
                            cookies.get('uid')
                    )
                    .then(res => {
                        self.submissionSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //部门呈报件改变
        SubmissionChange() {},
        submissionDetail() {
            if (this.submission && this.submission != null) {
                this.common.open('#/apps/submission/' + this.submission);
            }
        },
        //附件上传
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.attachments.push(item);
                });
            }
        },
        //下载附件
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        },
        //删除附件
        deleteAttachment(id) {
            const self = this;
            if (this.selectItem.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get('/api/v1/payment_forms/deleteAtt/' + id, '', {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
                            .then(res => {
                                self.selectItem.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.selectItem.attachments.splice(
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
        //获得流水号
        getNum() {
            const self = this;
            axios
                .get('/api/v1/payment_forms/no', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.selectItem.numericalOrder = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        showForm(typeItem) {
            this.selectItem.travelId = '';
            this.submission = '';
            this.hignlearder = '';
            this.selectType = 'add';
            this.$emit('info', 'add');
            this.selectItem.type = typeItem.name;
            if (this.selectItem.type == '国内差旅报销(对公)') {
                this.titleType = '出差申请单：';
            }
            if (this.selectItem.type == '国际差旅报销(对公)') {
                this.titleType = '呈报件：';
            }
            this.api = typeItem.api;
            this.typeApi = [];
            this.getNum();
            this.getType();
            this.loadAll();
            this.getTravelList();
            this.getSubmissionlList();
        },
        //根据合同名称查询
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearch1(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilter1(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return restaurant => {
                return (
                    restaurant.contractName
                        .toLowerCase()
                        .search(queryString.toLowerCase()) != -1
                );
            };
        },
        createFilter1(queryString) {
            return restaurant => {
                return (
                    restaurant.contractNum
                        .toLowerCase()
                        .search(queryString.toLowerCase()) != -1
                );
            };
        },
        //根据合同号查询
        querySearchNum(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilterNum(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilterNum(queryString) {
            return restaurant => {
                return (
                    restaurant.contractNum
                        .toLowerCase()
                        .search(queryString.toLowerCase()) != -1
                );
            };
        },
        //根据合同号查询累计已付款金额
        getTotal() {
            const self = this;
            const params = {
                numNo: this.selectItem.contract.contractId.toString(),
            };
            axios
                .post(
                    // '/api/v1/payment_forms/total?numNo=' +
                    '/api/v1/payment_forms/total', 

                    JSON.stringify(params),
                        // this.selectItem.contract.contractId.toString(),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.selectItem.contract.payments = res.data;
                    this.getAmount('contractDetail');
                })
                .catch(function() {
                    self.$message({
                        message: '未查询到已付款金额',
                        type: 'error'
                    });
                });
        },
        handleSelect(type) {
            if (type == 'numNo') {
                for (let item of this.restaurants) {
                    if (item.contractNum == this.selectItem.contract.numNo) {
                        this.selectItem.contract.contractId = item.id;
                        this.selectItem.contract.name = item.contractName;
                        this.selectItem.contract.amount = item.contractAmount;
                    }
                }
            }
            if (type == 'name') {
                for (let item of this.restaurants) {
                    if (item.contractName == this.selectItem.contract.name) {
                        this.selectItem.contract.contractId = item.id;
                        this.selectItem.contract.amount = item.contractAmount;
                        if (item.contractNum) {
                            this.selectItem.contract.numNo = item.contractNum;
                        } else {
                            this.selectItem.contract.numNo = String(item.id);
                        }
                    }
                }
            }
            this.getTotal();
        },
        //查看借款单详情
        travelDetail() {
            if (this.selectItem.travelId && this.selectItem.travelId != null) {
                this.common.open('#/apps/travel/' + this.selectItem.travelId);
            }
        },
        //获得已完成的合同编号
        loadAll() {
            const self = this;
            axios
                .post(
                    '/api/v1/contract_forms/queryForPayment?uid=' +
                        this.cookie_uid,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.restaurants = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '合同列表获取失败',
                        type: 'error'
                    });
                });

            return;
        },
        //根据uid获取列表
        getTravelList() {
            const self = this;
            if (self.cookie_uid != '') {
                axios
                    .get('/api/v1/travel_forms/findDone/' + this.cookie_uid)
                    // .get('/api/v1/travel_forms/findDone/' + 130)
                    .then(res => {
                        self.travelSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //选择出差人员改变
        travelChange(val) {
            if (val && val != '') {
                const self = this;
                for (let item of this.travelSelections) {
                    if (item.id == this.selectItem.travelId) {
                        this.selectItem.travelCode = item.number;
                    }
                }
                axios
                    .get('/api/v1/travel_forms/' + val)
                    .then(res => {
                        self.travelList = res.data.evections;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        handleChange(val) {
            console.log(val);
        }
    }
};
</script>
<style lang="scss" scoped>
#PaymentForm {
    .span {
        color: red;
    }
    .hehe {
        color: red;
    }
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #000;
        color: #666;
        height: 40px;
        vertical-align: middle;
    }
    table thead th {
        background-color: #cce8eb;
    }
    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
    }
    .money input {
        text-align: right;
    }
    .upload {
        position: relative;
        margin-right: 30px;
        // width: 100px;
        display: inline-block;
        cursor: pointer;
    }
    .attachments {
        position: relative;
        // margin-bottom: 40px;
        margin-right: 30px;
        width: 200px;
        // height: 120px;
        display: inline-block;
        cursor: pointer;
        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 20px;
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
}
</style>