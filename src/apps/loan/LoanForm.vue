<template>
    <el-dialog title="借款申请单" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="90%" style="text-align: center;">
        <div id="LoanForm">
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <!-- <el-row style="margin-bottom:10px">
                <el-col :span="8">
                    流水号：{{selectItem.number}}
                </el-col>
            </el-row> -->
                <div class="notice">
                    <h2>注意</h2>
                    <ol>
                        <li>国内差旅借款请关联出差审批单，国际差旅借款请关联呈报件；</li>
                        <li>借款不应包含差旅补助，借款金额不得超过审批金额；</li>
                        <li>出差涉及多个部门时，费用承担部门选择借款人部门即可，报销时再分摊到多个部门；</li>
                        <li>借款人即为收款人，借款人需还清上一笔借款方可进行下一笔借款。</li>
                    </ol>
                </div>
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                        <el-form-item label="流水单号：">
                            <el-input style="width:200px;" v-model="formData.number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9" style="position: relative;">
                        <el-form-item label="出差审批单：" label-width="110px">
                            <el-select v-model="formData.travelPeople" filterable value-key="id" allow-create placeholder="" @change="travelChange">
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="travelDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" style="position: relative;">
                        <el-form-item label="呈报件：" label-width="30px;">
                            <el-select v-model="formData.submission" filterable allow-create value-key="id" placeholder="选择呈报件" @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.subView">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.subView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table>
                    <tr>
                        <th colspan="6" style="font-weight:bold;">基本信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">提单人</td>
                        <td width="10%">
                            <el-input v-model="formData.creatorName" disabled></el-input>
                        </td>
                        <td class="bolder" width="10%">
                            <span class="span1">*</span> 费用承担部门</td>
                        <td width="10%">
                            <el-select v-model="formData.borrowDept" filterable>
                                <el-option v-for="item in organ" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="bolder" width="10%">借款时间</td>
                        <td width="10%">
                            <el-date-picker v-model="formData.borrowTime" type="datetime" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">
                            <span class="span1">*</span>借款人</td>
                        <td width="10%">
                            <el-select v-model="formData.borrower" filterable>
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="bolder" width="10%">
                            <span class="span1">*</span>开户行</td>
                        <td width="10%">
                            <el-input v-model="formData.bank "></el-input>
                        </td>
                        <td class="bolder" width="10%">
                            <span class="span1">*</span>银行卡号</td>
                        <td width="10%">
                            <el-input v-model="formData.cardNum "></el-input>
                        </td>
                    </tr>
                    <tr>
                        <th class="bolder" colspan="6" style="font-weight:bold">借款信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%">
                            <span class="span1">*</span>借款用途</td>
                        <td class="bolder" width="10%">
                            <span class="span1">*</span>借款金额</td>
                        <td class="bolder" width="10%">币种</td>
                        <td class="bolder" width="10%">预估汇率</td>
                        <td class="bolder" width="10%" colspan="2">预估本币金额</td>
                    </tr>
                    <tr v-for="(Item,index) in this.formData.borrows" :key="Item.index" @contextmenu.prevent="deleteItem(Item,index)">
                        <td>
                            <el-input v-model="Item.bigType"></el-input>
                            <!--
                            <el-cascader :options="getclass" change-on-select v-model="Item.purpose1" :props="{value:'name',label:'name'}">
                            </el-cascader>
                            -->
                        </td>
                        <td>
                            <el-input type="number" oninput="if(value.length>13) value=value.slice(0,13)" @mousewheel.native.prevent v-model="Item.loanAmount" @input="getAmount(Item)"></el-input>
                        </td>
                        <td>
                            <el-select v-model="Item.currency" placeholder="" @change="currencyChange2(Item,index)">
                                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.label">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="Item.estimateRate" type="number" @mousewheel.native.prevent @input="getAmount(Item)"></el-input>
                        </td>
                        <td colspan="2">
                            <el-input v-model="Item.estimateDomestic" disabled></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6">
                            <el-button size="small" style="width:100%;" @click="addItem()">插入</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" colspan="2">金额合计</td>
                        <td>
                            <el-row>
                                <!-- {{this.selectItem.borrows.length ==0 ? '￥': this.selectItem.borrows[0].currency.value}} -->
                                <el-col :span="5" align="left">{{formData.symbol}}</el-col>
                                <el-col :span="19" align="right">{{formData.total}}</el-col>
                            </el-row>
                        </td>
                        <td class="bolder">
                            金额大写
                        </td>
                        <td colspan="2">
                            {{this.formData.borrows.length > 0 ? this.formData.borrows[0].currency : '人民币'}}:&nbsp;&nbsp;
                            <!-- （{{this.selectItem.borrows.length > 0 ? this.selectItem.borrows[0].currency : '人民币'}}：&nbsp;&nbsp;{{selectItem.dx}}&nbsp;&nbsp;) -->
                            {{formData.moneyUpper}}
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
                            <el-radio-group v-model="formData.fundPlan">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            <el-radio-group v-model="formData.est">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" colspan="2">
                            <span class="span1">*</span>结算方式</td>
                        <td colspan="4">
                            <el-select v-model="formData.settlement" placeholder="选择结算方式" style="width:100%" filterable>
                                <el-option key="0" label="网银" value="网银"></el-option>
                                <el-option key="1" label="电汇" value="电汇"></el-option>
                                <el-option key="2" label="现金支票" value="现金支票"></el-option>
                                <el-option key="3" label="转账支票" value="转账支票"></el-option>
                                <el-option key="4" label="信汇" value="信汇"></el-option>
                                <el-option key="5" label="现金" value="现金"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" colspan="2" style="padding-left:50px">
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :multiple="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c"> 附件上传
                                    <i class="el-icon-plus"></i>
                                </span>
                            </el-upload>

                        </td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="(item,index) in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments,'/api/v1/loan_forms/deleteAttachment/' + item.id,'get')"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                </table>
            </el-form>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogSelectCode" width="30%" append-to-body center>
            <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
                <el-option v-for="item in currentRoles" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveFormValidate()">保存</el-button>
                <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
            </span>
        </el-dialog>

        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
import { debug } from 'util';
export default {
    mixins: [publicMethods],
    name: 'LoanForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',

            dialogFormVisible: false,
            formData: this.resetForm(),
            appFlowName: 'loan-form_loan',
            organ: [],
            submissionSelections: [],
            travelSelections: [],
            options2: [
                {
                    value: 'C$',
                    label: '加元'
                },
                {
                    value: 'SFr',
                    label: '瑞士法郎'
                },
                {
                    value: '￥',
                    label: '人民币'
                },
                {
                    value: '€',
                    label: '欧元'
                },
                {
                    value: '￡',
                    label: '英镑'
                },
                {
                    value: 'HK$',
                    label: '港币'
                },
                {
                    value: 'JPY￥',
                    label: '日元'
                },
                {
                    value: '$',
                    label: '美元'
                },
                {
                    value: 'MOP$',
                    label: '澳门币'
                },
                {
                    value: 'NT$',
                    label: '新台币'
                }
            ],
            formData: this.resetForm(),
            users: [],
            getclass: []
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        //this.getUsers();
        // this.organs();
        // this.getTravelList();
        // this.getSubmissionlList();
    },
    methods: {
        getClass() {
            const self = this;
            const params = { type: 'category' };
            axios
                .post('/synergy-common/getAllTree', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    let response = [];
                    for (let data of res.data.content[0].children) {
                        response.push(this.interatorData(data));
                    }
                    this.getclass = response;
                })
                .catch(function() {
                    self.$message({
                        message: '获取费用类别失败',
                        type: 'error'
                    });
                });
        },
        interatorData(data) {
            if (data.children) {
                if (data.children && data.children.length > 0) {
                    for (let item of data.children) {
                        if (item.children && item.children.length > 0) {
                            this.interatorData(item.children);
                        } else {
                            item.children = null;
                        }
                    }
                    return data;
                } else {
                    data.children = null;
                    return data;
                }
            } else {
                return data;
            }
        },
        travelChange(val) {
            console.log(val);
            this.formData.travelView = true;
            let boolean = false;
            for (let data of this.travelSelections) {
                if (data.id == val) {
                    boolean = true;
                }
            }
            this.formData.travelView = boolean;
            /** 
            this.formData.travelView = true;
            let boolean = false;
            for (let data of this.travelSelections) {
                if (val.id && data.id == val.id) {
                    boolean = true;
                    this.formData.busId = this.formData.travelPeople.id;
                    this.formData.busNo = this.formData.travelPeople.number;
                }
            }
            this.formData.travelView = boolean;
            */
        },
        //根据uid获取列表
        getTravelList() {
            const self = this;
            this.travelSelections = [];
            if (cookies.get('uid') != '') {
                axios
                    .get('/api/v1/loan_forms/getTravels')
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
        travelDetail() {
            if (
                this.formData.travelPeople &&
                this.formData.travelPeople != null &&
                this.formData.travelView
            ) {
                this.common.open('#/apps/travel/' + this.formData.travelPeople);
            }
        },
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            this.submissionSelections = [];
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
        SubmissionChange(val) {
            console.log(val);
            this.formData.subView = true;
            let boolean = false;
            for (let data of this.submissionSelections) {
                if (data.id == val) {
                    boolean = true;
                }
            }
            this.formData.subView = boolean;

            /** 
            this.formData.subView = true;
            let boolean = false;
            for (let data of this.submissionSelections) {
                if (val.id && data.id == val.id) {
                    boolean = true;
                    this.formData.subId = this.formData.submission.id;
                    this.formData.subNo = this.formData.submission.submissionNo;
                }
            }
            this.formData.subView = boolean;
            */
        },
        submissionDetail() {
            if (
                this.formData.submission &&
                this.formData.submission != null &&
                this.formData.subView
            ) {
                this.common.open(
                    '#/apps/submission/' + this.formData.submission
                );
            }
        },
        currencyChange2(item, index) {
            for (let data of this.formData.borrows) {
                data.currency = item.currency;
                // data.rate = item.rate;
            }
            for (let data of this.options2) {
                if (item.currency == data.label) {
                    this.formData.symbol = data.value;
                }
            }
        },
        organs() {
            axios.get('/api/v1/users/list/organss').then(res => {
                this.organ = [];
                for (let data of res.data) {
                    this.organ.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.organ = res.data;
            });
        },
        checkLoanMessage() {
            let loanmessage = true;
            for (let data of this.formData.borrows) {
                if (
                    data.bigType == '' ||
                    data.loanAmount == '' ||
                    data.estimateRate == ''
                ) {
                    loanmessage = false;
                }
            }
            return loanmessage;
        },
        addItem() {
            const self = this;
            if (this.checkLoanMessage()) {
                this.formData.borrows.push({
                    currency:
                        this.formData.borrows.length == 0
                            ? '人民币'
                            : this.formData.borrows[0].currency,
                    estimateRate:
                        this.formData.borrows.length == 0
                            ? 1
                            : this.formData.borrows[0].estimateRate,
                    purpose1: [],
                    bigType: '',
                    purpose: '',
                    loanAmount: '',
                    estimateDomestic: '',
                    id: ''
                });
            } else {
                self.$message({
                    message: '请输入借款明细',
                    type: 'error'
                });
            }
        },
        deleteItem(item, index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (item.id && item.id != '') {
                    axios
                        .get('/api/v1/loan_forms/deleteBorrow/' + item.id)
                        .then(res => {
                            this.formData.borrows.splice(index, 1);
                            this.totalPayment();
                            if (this.formData.borrows.length == 0) {
                                this.formData.symbol = '￥';
                            }
                        })
                        .catch(function() {
                            self.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                        });
                } else {
                    this.formData.borrows.splice(index, 1);
                    this.totalPayment();
                    if (this.formData.borrows.length == 0) {
                        this.formData.symbol = '￥';
                    }
                }
            });
        },
        /**
        getClass() {
            const self = this;
            this.getclass = [];
            axios.get('/api/v1/reim/code/021001020').then(res => {
                let array = [];
                for (let data of res.data[0].children) {
                    if (data.name != '补助费') {
                        array.push(data);
                    }
                }
                self.getclass.push({
                    id: '134',
                    name: '差旅费(国内)',
                    children: array
                });
                axios.get('/api/v1/reim/code/021001005').then(res => {
                    self.getclass.push(res.data[0]);
                });
            });
        },
        */
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        getNum() {
            const self = this;
            let params = {
                code: 'loan_forms'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.number = res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        getAmount(item) {
            for (let data of this.formData.borrows) {
                data.estimateRate = item.estimateRate;
                if (data.loanAmount != '' && data.estimateRate != '') {
                    data.estimateDomestic = this.common.toDecimal2(
                        data.loanAmount * data.estimateRate
                    );
                } else {
                    data.estimateDomestic = 0;
                }
            }
            this.totalPayment();
        },
        //合计金额计算
        totalPayment() {
            let sum = 0;
            for (let data of this.formData.borrows) {
                sum += parseFloat(data.loanAmount);
            }
            this.formData.total = this.common.toDecimal2(sum);
            this.formData.moneyUpper = this.convertCurrency(
                this.formData.total
            );
        },
        setDataFromParent(data) {
            // this.getClass();
            this.getUsers();
            this.organs();
            this.getTravelList();
            this.getSubmissionlList();
            this.formData.travelPeople = '';
            this.formData.submission = '';
            /** 
            for (let item of data.borrows) {
                item.purpose1 = item.bigType.split(',');
            }
            */
            this.formData = data;
            if (data.busId && data.busId != '') {
                if (data.travelView) {
                    this.formData.travelPeople = parseInt(data.busId);
                } else {
                    this.formData.travelPeople = data.busId;
                }
            }
            if (data.subId && data.subId != '') {
                if (data.subView) {
                    this.formData.submission = parseInt(data.subId);
                } else {
                    this.formData.submission = data.subId;
                }
            }
            // this.formData.submission = data.subNo;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.getUsers();
            this.organs();
            this.formData = this.resetForm();
            this.formData.travelPeople = '';
            this.formData.submission = '';
            this.getNum();
            // this.getClass();
            this.getTravelList();
            this.getSubmissionlList();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        resetForm() {
            let formData = {
                subView: true,
                travelView: true,
                travelPeople: '',
                submission: '',
                subId: '',
                subNo: '',
                busId: '',
                busNo: '',
                dx: '',
                fundPlan: true,
                est: true,
                number: '',
                borrowDept: cookies.get('oname'),
                creatorName: cookies.get('uname'),
                borrower: cookies.get('uname'),
                borrowerId: cookies.get('uid'),
                borrows: [
                    {
                        currency: '人民币',
                        estimateRate: 1,
                        loanAmount: '',
                        estimateDomestic: '',
                        purpose1: [],
                        bigType: '',
                        purpose: '',
                        id: ''
                    }
                ],
                borrowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                attachments: [],
                symbol: '￥',
                moneyUpper: ''
            };
            return formData;
        },
        saveFormValidate(type) {
            if (this.formData.borrowDept == '集团领导') {
                this.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else if (
                this.formData.borrower == '' ||
                this.formData.borrowDept == '' ||
                this.formData.bank == '' ||
                this.formData.cardNum == '' ||
                this.formData.settlement == '' ||
                this.checkLoanMessage() == false
            ) {
                this.$message({
                    message: '请输入必填项',
                    type: 'error'
                });
            } else {
                this.saveForm(type);
            }
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            if ($self.formData.borrowTime) {
                $self.formData.borrowTime = moment(
                    $self.formData.borrowTime
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                $self.formData.borrowTime = '';
            }
            if (this.formData.travelPeople != '') {
                this.formData.busId = this.formData.travelPeople;
                for (let data of this.travelSelections) {
                    if (data.id == this.formData.travelPeople) {
                        this.formData.busNo = data.number;
                    }
                }
                if (this.formData.travelView == false) {
                    this.formData.busNo = this.formData.travelPeople;
                }
            }
            if (this.formData.submission != '') {
                this.formData.subId = this.formData.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.formData.submission) {
                        this.formData.subNo = data.submissionNo;
                    }
                }
                if (this.formData.subView == false) {
                    this.formData.subNo = this.formData.submission;
                }
            }
            /** 
            if (this.formData.travelView == false) {
                this.formData.busNo = this.formData.travelPeople;
            }
            if (this.formData.subView == false) {
                this.formData.subNo = this.formData.submission;
            }
            */
            for (let item of this.users) {
                if (item.name == this.formData.borrower) {
                    this.formData.borrowerId = item.id;
                }
            }
            /** 
            for (let data of this.formData.borrows) {
                data.bigType = data.purpose1.join(',');
            }
            */
            let response = await $self.saveFormData(
                '/api/v1/loan_forms/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = $self.dialogSelectCode = false;
                if (params) {
                    $self.msgTips('提交成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(function(
                            item
                        ) {
                            return item.action == 'COMMIT';
                        });
                        actions.data.types[0]['comment'] =
                            actions.data.types[0].name;
                        await $self.startSignal(
                            actions.data.types[0],
                            'fromeEdit'
                        );
                        $self.emitMessage();
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('提交失败', 'warning');
                    }
                } else {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('保存失败', 'warning');
                    }
                }
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
           // this.$refs.upload.clearFiles();
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        deleteAttachment(id) {
            const self = this;
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/loan_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.formData.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.formData.attachments.splice(
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
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {}
    }
};
</script>
<style lang="scss">
#LoanForm {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #ccc;
        padding: 0px;
        margin: 0px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 14px;
        height: 40px;
        text-align: center;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }
        input[type='number'] {
            -moz-appearance: textfield;
        }
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
    .notice {
        color: red;
        h2 {
            text-align: left;
        }
        ol {
            font-size: 17px;
            text-align: left;
        }
    }
    .span1 {
        color: red;
        margin-right: 5px;
    }
    .span2 {
        position: absolute;
        top: 10px;
        left: -5px;
        color: red;
    }
    .span3 {
        position: absolute;
        top: 10px;
        left: -10px;
        color: red;
    }
    .bolder {
        font-weight: bold;
    }
}
</style>