<template>
    <div id="LoanForm">
        <el-form :model='selectItem' class="demo-form-inline" ref="formupdate">
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
                        <el-input style="width:200px;" v-model="selectItem.number" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9" style="position: relative;">
                    <span class="span2">*</span>
                    <el-form-item label="出差审批单：" label-width="110px">
                        <el-select v-model="selectItem.travelPeople" placeholder="" @change="travelChange">
                            <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="travelDetail"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="7" style="position: relative;">
                    <span class="span3">*</span>
                    <el-form-item label="呈报件：" label-width="30px;">
                        <el-select v-model="selectItem.submission" placeholder="" @change="SubmissionChange">
                            <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
            <table>
                <tr>
                    <th colspan="6" style="font-weight:bold;">基本信息</th>
                </tr>
                <tr>
                    <td width="10%" height="20px">提单人</td>
                    <td width="10%">
                        <el-input v-model="selectItem.creatorName" disabled></el-input>
                    </td>
                    <td width="10%">
                        <span class="span1">*</span> 费用承担部门</td>
                    <td width="10%">
                        <el-select v-model="selectItem.borrowDept" filterable>
                            <el-option v-for="item in organ" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </td>
                    <td width="10%">借款时间</td>
                    <td width="10%">
                        <el-date-picker v-model="selectItem.borrowTime" type="datetime" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td width="10%" height="20px">
                        <span class="span1">*</span>借款人</td>
                    <td width="10%">
                        <el-select v-model="selectItem.borrower" filterable>
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </td>
                    <td width="10%">
                        <span class="span1">*</span>开户行</td>
                    <td width="10%">
                        <el-input v-model="selectItem.bank "></el-input>
                    </td>
                    <td width="10%">
                        <span class="span1">*</span>银行卡号</td>
                    <td width="10%">
                        <el-input v-model="selectItem.cardNum "></el-input>
                    </td>
                </tr>
                <tr>
                    <th colspan="6" style="font-weight:bold">借款信息</th>
                </tr>
                <tr>
                    <td width="10%">
                        <span class="span1">*</span>借款用途</td>
                    <td width="10%">
                        <span class="span1">*</span>借款金额</td>
                    <td width="10%">币种</td>
                    <td width="10%">预估汇率</td>
                    <td width="10%" colspan="2">预估本币金额</td>
                </tr>
                <tr v-for="(Item,index) in this.selectItem.borrows" :key="Item.index" @contextmenu.prevent="deleteItem(Item,index,'borrowsDetail')">
                    <td>
                        <el-cascader :options="getclass" change-on-select v-model="Item.purpose1" :props="{value:'name',label:'name'}">
                        </el-cascader>
                    </td>
                    <td>
                        <el-input v-model="Item.loanAmount" @input="getAmount(Item)"></el-input>
                    </td>
                    <td>
                        <el-select v-model="Item.currency" placeholder="选择币种" filterable @change="getDollar(Item)">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="Item.estimateRate" @input="getAmount(Item)"></el-input>
                    </td>
                    <td colspan="2">
                        <el-input v-model="Item.estimateDomestic" @input="getAmount(Item)"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <el-button size="small" style="width:100%;" @click="addItem('borrowsDetail')">插入</el-button>
                    </td>
                </tr>
                <tr>
                    <td width="10%" colspan="2">金额合计</td>
                    <td>
                        <el-row>
                            <el-col :span="5" align="left">{{this.dollar}}</el-col>
                            <el-col :span="19" align="right">{{selectItem.total}}</el-col>
                        </el-row>
                    </td>
                    <td>
                        金额大写
                    </td>
                    <td colspan="2">
                        （{{this.selectItem.borrows.length > 0 ? this.selectItem.borrows[0].currency : '人民币'}}：&nbsp;&nbsp;{{selectItem.dx}}&nbsp;&nbsp;)
                    </td>
                </tr>
                <tr>
                    <td width="10%" colspan="2">
                        <span class="span1">*</span>结算方式</td>
                    <td colspan="4">
                        <el-select v-model="selectItem.settlement" placeholder="选择结算方式" style="width:100%" filterable>
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
                    <td colspan="2" style="padding-left:50px">
                        <span class="span1">*</span> 附件上传
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
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';
import { CURRENCY } from '../data.js';
export default {
    name: 'LoanForm',
    data() {
        return {
            dialogVisible: false,
            cookie_uid: cookies.get('uid'),
            getclass: [],
            info: '',
            users: [],
            organ: [],
            getoid: '',
            array: [],
            array12: [],
            travelSelections: [],
            submissionSelections: [],
            selectItem: {
                subId: '',
                subNo: '',
                busId: '',
                busNo: '',
                dx: '',
                number: '',
                borrowDept: this.cookie_oname,
                creatorName: this.cookie_uname,
                borrower: this.cookie_uname,
                borrows: [
                    {
                        currency: '人民币',
                        estimateRate: 1,
                        purpose1: [],
                        purpose: ''
                    }
                ],
                borrowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                attachments: []
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options: CURRENCY['currency'],
            dollar: '￥', //币符
            vacancy: [],
            productGroupRules: {
                productGroupNum: [
                    {
                        required: true,
                        message: '请选择借款用途',
                        trigger: 'change'
                    }
                ],
                loanAmount: [
                    {
                        required: true,
                        message: '请输入借款金额',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        this.getUser();
        this.getOrgan();
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.selectItem.creatorName = decodeURIComponent(
                    item.split('=')[1]
                );
                self.selectItem.borrower = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.borrowDept = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getNum();
        this.getClass();
        this.getTravelList();
        this.getSubmissionlList();
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            }
        }
    },
    methods: {
        travelChange(val) {
            (this.selectItem.busId = this.selectItem.travelPeople.id),
                (this.selectItem.busNo = this.selectItem.travelPeople.number);
        },
        //根据uid获取列表
        getTravelList() {
            const self = this;
            if (self.cookie_uid != '') {
                axios
                    .get('/api/v1/travel_forms/findDone/' + self.cookie_uid)
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
                this.selectItem.travelPeople &&
                this.selectItem.travelPeople != null
            ) {
                this.common.open('#/apps/travel/' + this.selectItem.busId);
            }
        },
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            if (self.cookie_uid != '') {
                axios
                    .post(
                        '/api/v1/submission_forms/queryDone/' + this.cookie_uid
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
        SubmissionChange() {
            this.selectItem.subId = this.selectItem.submission.id;
            this.selectItem.subNo = this.selectItem.submission.submissionNo;
        },
        submissionDetail() {
            if (
                this.selectItem.submission &&
                this.selectItem.submission != null
            ) {
                this.common.open('#/apps/submission/' + this.selectItem.subId);
            }
        },
        getDollar(type) {
            for (let item of this.options) {
                if (item.label == type.currency) {
                    this.dollar = item.dollar;
                }
            }
            if (this.selectItem.borrows.length > 1) {
                for (let index of this.selectItem.borrows) {
                    (index.currency = type.currency),
                        (index.estimateRate = type.estimateRate);
                }
            }
        },
        checkTabledata() {
            let boolean = true;
            for (let data of this.selectItem.borrows) {
                if (!data.purpose1[0] || data.loanAmount == '') {
                    boolean = false;
                }
            }
            return boolean;
        },
        checkType(type) {
            if (
                this.selectItem.borrowDept != '' &&
                this.selectItem.borrower != '' &&
                this.selectItem.bank != '' &&
                this.selectItem.cardNum != '' &&
                this.selectItem.settlement != '' &&
                this.checkTabledata() == true
            ) {
                if (
                    this.selectItem.travelPeople &&
                    this.selectItem.submission
                ) {
                    this.docheckNeed(type);
                } else {
                    this.doCheckDialog(type);
                }
            } else {
                this.$message({
                    message: '请输入必填项',
                    type: 'error'
                });
            }
        },
        docheckNeed(type) {
            if (type == 'saveform') {
                this.saveFormValidate();
            } else {
                this.submitCheck();
            }
        },
        doCheckDialog(type) {
            this.$confirm('信息不够完善，是否要继续操作', '提示', {
                type: 'warning'
            }).then(() => {
                if (type == 'saveform') {
                    this.saveFormValidate();
                } else {
                    this.submitCheck();
                }
            });
        },
        saveFormValidate() {
            // this.$refs['formupdate'].validate(valid => {
            // if (valid) {
            if (this.selectItem.borrowDept == '集团领导') {
                this.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else {
                this.saveForm1();
            }
            // }
            // });
        },
        submitCheck() {
            //this.$refs['formupdate'].validate(valid => {
            // if (valid) {
            this.$confirm(
                '请确认所有单据齐全，整齐平铺粘贴于A4纸上，并在首张单据右上角空白处注明流水单号后交到资金财务部;是否确认提交？',
                '提示',
                { type: 'warning' }
            ).then(() => {
                if (this.selectItem.borrowDept == '集团领导') {
                    this.$message({
                        message: '费用承担部门选择错误，请重新选择',
                        type: 'error'
                    });
                } else {
                    if (this.operationType == 'create') {
                        this.saveForm1('save');
                    } else {
                        this.submitForm();
                    }
                }
            });
            // }
            // });
        },
        //借款用途
        getClass() {
            axios.get('/api/v1/reim/code/021001').then(res => {
                axios.get('/api/v1/reim/code/021001003').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001005').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001007').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001010').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001011').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001019').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001020').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001028').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001012').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001021').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001023').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001026').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001027').then(res => {
                    this.array.push(res.data[0]);
                });
                axios.get('/api/v1/reim/code/021001028').then(res => {
                    this.array.push(res.data[0]);
                });
                res.data[0].children = this.array;
                this.array12.push(res.data[0]);
                axios.get('/api/v1/reim/code/026004').then(res => {
                    this.getclass = this.array12;
                    this.getclass.push(res.data[0]);
                });
            });
        },
        //获得用户列表
        getUser() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        //获得费用承担部门
        getOrgan() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.organ = res.data;
            });
        },
        getAmount(Item) {
            if (this.selectItem.borrows.length > 1) {
                for (let index of this.selectItem.borrows) {
                    index.currency = Item.currency;
                    index.estimateRate = Item.estimateRate;
                    if (index.loanAmount && index.estimateRate) {
                        index.estimateDomestic = this.common.toDecimal2(
                            index.loanAmount * index.estimateRate
                        );
                    } else {
                        index.estimateDomestic = 0;
                    }
                }
            } else if (Item.loanAmount && Item.estimateRate) {
                Item.estimateDomestic = this.common.toDecimal2(
                    Item.loanAmount * Item.estimateRate
                );
            } else {
                Item.estimateDomestic = 0;
            }
            this.totalPayment();
        },
        //合计金额计算
        totalPayment() {
            let sum = 0;
            for (let data of this.selectItem.borrows) {
                // sum += parseFloat(data.estimateDomestic);
                sum += parseFloat(data.loanAmount);
            }
            this.selectItem.total = this.common.toDecimal2(sum);
            this.getDx();
        },
        //金额大写
        getDx() {
            this.selectItem.dx = this.common.DX(this.selectItem.total);
        },
        //获得流水号
        getNum() {
            const self = this;
            axios
                .get('/api/v1/loan_forms/getNo', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.selectItem.number = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        clearForm() {
            this.selectItem = {
                dx: '',
                number: this.selectItem.number,
                borrowDept: this.cookie_oname,
                creatorName: this.cookie_uname,
                borrower: this.cookie_uname,
                borrows: [
                    {
                        currency: '人民币',
                        estimateRate: 1,
                        purpose1: [],
                        purpose: ''
                    }
                ],
                borrowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                attachments: []
            };
            this.dollar = '￥';
            this.getNum();
        },
        //添加借款信息
        addItem(type) {
            if (type == 'borrowsDetail') {
                if (this.selectItem.borrows.length > 0) {
                    this.selectItem.borrows.push({
                        currency: this.selectItem.borrows[0].currency,
                        estimateRate: this.selectItem.borrows[0].estimateRate,
                        purpose1: [],
                        purpose: ''
                    });
                } else {
                    this.selectItem.borrows.push({
                        currency: '人民币',
                        estimateRate: 1,
                        purpose1: [],
                        purpose: ''
                    });
                }
            }
        },
        deleteItemright1(index) {
            this.tableData1.splice(index);
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/loan_forms/' + this.formId)
                    .then(res => {
                        let array2 = [];
                        // self.selectItem = res.data;
                        for (let item of this.options) {
                            if (item.label == res.data.borrows[0].currency) {
                                this.dollar = item.dollar;
                            }
                        }
                        for (let data of res.data.borrows) {
                            let select = [];
                            select[0] = data.bigType;
                            select[1] = data.centreType;
                            select[2] = data.smallType;
                            array2.push({
                                purpose1: select,
                                currency: data.currency,
                                estimateDomestic: data.estimateDomestic,
                                estimateRate: data.estimateRate,
                                loanAmount: data.loanAmount,
                                id: data.id
                            });
                        }
                        res.data.borrows = [];
                        res.data.borrows = array2;
                        this.selectItem = res.data;
                        this.selectItem.travelPeople = res.data.busNo;
                        this.getDx();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveForm1(action) {
            const self = this;
            if (self.selectItem.borrowTime) {
                self.selectItem.borrowTime = moment(
                    self.selectItem.borrowTime
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                self.selectItem.borrowTime = '';
            }
            for (let item of this.users) {
                if (item.name == this.selectItem.borrower) {
                    this.selectItem.borrowerId = item.id;
                }
            }
            if (this.selectItem.borrows.length > 0) {
                let array1 = [];
                array1 = this.selectItem.borrows;
                this.selectItem.borrows = [];
                for (let data of array1) {
                    this.selectItem.borrows.push({
                        id: data.id,
                        bigType: data.purpose1[0],
                        centreType: data.purpose1[1],
                        smallType: data.purpose1[2],
                        loanAmount: data.loanAmount,
                        currency: data.currency,
                        estimateRate: data.estimateRate,
                        estimateDomestic: data.estimateDomestic
                    });
                }
            }
            axios
                .post(
                    '/api/v1/loan_forms/save',
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
                        self.submitForm();
                    } else {
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        self.$emit('refreshData');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put('/api/v1/loan_forms/' + this.currentFormId + '/comment', {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/loans/' + this.currentFormId + '/create', '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/loan_forms/' +
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
                        message: 'commit提交失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            for (let item of this.organ) {
                if (item.name == this.selectItem.borrowDept) {
                    this.getoid = item.id;
                }
            }
            const params = {
                action: 'COMMIT',
                needGeneralManager: this.selectItem.manager,
                needChairman: this.selectItem.chairman,
                // money: this.selectItem.total.toString(),
                money: String(
                    this.common.toDecimal2(
                        this.selectItem.total *
                            this.selectItem.borrows[0].estimateRate
                    )
                ),
                oid: this.getoid.toString()
            };
            axios
                .put(
                    '/api/v1/loans/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    this.comment();
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                })
                .catch(function() {
                    self.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                });
        },
        cancelForm() {
            const self = this;
            axios
                .put('/api/v1/loan_forms/' + this.formId + '/cancel', '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteAttachment(id) {
            const self = this;
            if (this.selectItem.attachments.length > 0) {
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
                            });
                    }
                );
            }
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'borrowsDetail') {
                    if (item.id) {
                        axios
                            .get('/api/v1/loan_forms/deleteBorrow/' + item.id)
                            .then(res => {
                                this.selectItem.borrows.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '删除失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.selectItem.borrows.splice(index, 1);
                    }
                }
            });
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
        downloadFile(item) {
            this.common.preview(item);
        }
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
        border: 1px solid #000;
        color: #000;
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
    .notice {
        color: red;
        ol {
            font-size: 17px;
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
}
</style>