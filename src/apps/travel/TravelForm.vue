<template>
    <div id="travelForm">
        <div class="notice">
            <h2>注意</h2>
            <ol>
                <li>完整填写所有出差人员；</li>
                <li>预估费用按照厉行节俭的要求严格控制，费用标准请参考集团国内差旅制度；</li>
                <li>出差补助金额不需计入。</li>
            </ol>
        </div>
        <el-form :model='rows' class="demo-form-inline" ref="formupdate">
            <!-- <div style="">
                <el-form-item label="流水单号：">{{rows.number}}
                </el-form-item>
            </div> -->
            <el-row>
                <el-col :span="8">
                    <el-form-item label="流水单号：">{{rows.number}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="呈报件：" label-width="30px;">
                        <el-select v-model="rows.submission2" value-key="id" placeholder="选择呈报件" @change="SubmissionChange">
                            <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
            <table style="width: 100%; table-layout: fixed; word-break: break-all;">
                <col style="width: 14%" />
                <col style="width: 12%" />
                <col style="width: 14%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 16%" />
                <col style="width: 16%" />
                <col style="width: 10%" />
                <tr>
                    <td colspan="8" style="font-weight:bold;">
                        基本信息
                    </td>
                </tr>
                <tr>
                    <td colspan="1">
                        提单人
                    </td>
                    <td colspan="1">
                        <el-input v-model="rows.submitter" disabled="disabled"></el-input>
                    </td>
                    <td colspan="1">
                        <span class="span1">*</span> 费用承担部门
                    </td>
                    <td colspan="2">
                        <!-- <el-input v-model="rows.subOrganName"></el-input> -->
                        <!-- <el-form-item label="" prop="subOrganName"> -->
                             <el-select style="width:100%" v-model="rows.subOrganName" value-key="id" @change="changeOrgans()" placeholder="">
                            <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                        <!-- </el-form-item> -->
                        <!-- <el-select style="width:100%" v-model="rows.subOrganName" value-key="id" @change="changeOrgans()" placeholder="">
                            <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select> -->
                    </td>
                    <td colspan="1">提单时间</td>
                    <td colspan="2">
                        <el-date-picker style="width:100%" disabled="disabled" v-model="rows.submitted" value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="font-weight:bold;"> 出差信息</td>
                </tr>
                <tr>
                    <td colspan="1">
                        <span class="span1">*</span>出差事由
                    </td>
                    <td colspan="7">
                        <el-input v-model="rows.reason"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="1"><span class="span1">*</span>出差人员</td>
                    <td colspan="1">所属部门</td>
                    <td colspan="1"> <span class="span1">*</span>职务</td>
                    <td colspan="1"><span class="span1">*</span>出发地</td>
                    <td colspan="1"><span class="span1">*</span>目的地</td>
                    <td colspan="2"><span class="span1">*</span>出差时间</td>
                    <td colspan="1">出差天数（天）</td>
                </tr>
                <tr v-for="(item,index) in this.rows.evections" :key="item.index" @contextmenu.prevent="deleteItem(item,index,'message')">
                    <td colspan="1">
                        <span>{{index +1}}</span>
                        <span style="display: inline-block; width: 85%;">
                            <el-select v-model="item.bname1" value-key="id" @change="changeUser(item,index)" filterable placeholder="请选择出差人员">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item">
                                </el-option>
                            </el-select>
                        </span>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.borganName" disabled="disabled"></el-input>
                    </td>
                    <td colspan="1">
                        <el-select v-model="item.ranks">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.departure"></el-input>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.destination"></el-input>
                    </td>
                    <td colspan="1">
                        <template>
                            <el-date-picker v-model="item.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始时间" @input="getTime()">
                            </el-date-picker>
                            <!-- <el-date-picker v-model="item.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间">
                            </el-date-picker> -->
                        </template>
                    </td>
                    <td colspan="1">
                        <template>
                            <el-date-picker v-model="item.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束时间" @input="getTime()">
                            </el-date-picker>
                        </template>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.dateNumber"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="8">
                        <p @click="addItem('message')">插入</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="font-weight:bold;">预估费用</td>
                </tr>
                <tr>
                    <td colspan="2"><span class="span1">*</span>费用类别</td>
                    <td colspan="1"><span class="span1">*</span>单价</td>
                    <td colspan="1"><span class="span1">*</span>数量</td>
                    <td colspan="1">币种</td>
                    <td colspan="1">预估汇率</td>
                    <td colspan="1">原币金额合计</td>
                    <td colspan="1">预估本币金额</td>
                </tr>
                <tr v-for="(item,index) in this.rows.estimate" :key="index" @contextmenu.prevent="deleteItem(item,index,'cost')">
                    <td colspan="2">
                        <el-cascader :options="getclass" change-on-select filterable="" v-model="item.bsType" :props="{value:'name',label:'name'}">
                        </el-cascader>
                    </td>
                    <!-- <td colspan="1">
                        <el-input v-model="item.smallType"></el-input>
                    </td> -->
                    <td colspan="1">
                        <el-input v-model="item.price" @input="getAmount(item)"></el-input>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.number" @input="getAmount(item)"></el-input>
                    </td>
                    <td colspan="1">
                        <!-- @focus="currencyChange" -->
                        <el-select v-model="item.currency" placeholder="" @change="currencyChange2(item,index)">
                            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="{value:item.value, label: item.label}">
                            </el-option>
                        </el-select>
                    </td>
                    <td colspan="1">
                        <el-input v-model="item.rate" @input="getAmount(item)"></el-input>
                    </td>
                    <td colspan="1" id="moneyright">
                        <el-input v-model="item.subtotal"></el-input>
                    </td>
                    <td colspan="1" id="moneyright">
                        <el-input v-model="item.principal"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="8">
                        <p @click="addItem('fenDetaill')">插入</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">合计金额</td>
                    <!--@input="money(total)-->
                    <td colspan="6">
                        {{this.rows.estimate.length ==0 ? '￥': this.rows.estimate[0].currency.value}}
                        <el-input style="width:150px" v-model="rows.total" disabled></el-input>（金额大写:({{this.rows.estimate.length ==0 ? '人民币': this.rows.estimate[0].currency.label}} ): {{this.rows.upper}})
                        <!--
                        <el-input v-model="rows.upper" style="width:300px;text-align: center;"></el-input>-->）
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <span style="color:#06940c">附件上传</span>
                        </el-upload>
                    </td>
                    <td colspan="6">
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                    </td>
                </tr>

            </table>
        </el-form>
        <el-dialog title="提示"  append-to-body  :visible.sync="dialogVisible" width="30%">
            <span v-for="item in this.vacancy" :key="item">"{{item}}",</span>未填写，是否继续
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleab">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { CURRENCY } from '../data.js';
import moment from 'moment';
import axios from 'axios';
import cookies from 'js-cookie';
export default {
    name: 'travelForm',
    data() {
        return {
            dialogVisible:false,
            submissionSelections: [],
            getoid: '',
            //options2: CURRENCY['currency'],
            options2: [
                {
                    value: 'C$',
                    label: '加元',
                    disabled: false
                },
                {
                    value: 'SFr',
                    label: '瑞士法郎',
                    disabled: false
                },
                {
                    value: '￥',
                    label: '人民币',
                    disabled: false
                },
                {
                    value: '€',
                    label: '欧元',
                    disabled: false
                },
                {
                    value: '￡',
                    label: '英镑',
                    disabled: false
                },
                {
                    value: 'HK$',
                    label: '港币',
                    disabled: false
                },
                {
                    value: 'JPY￥',
                    label: '日元',
                    disabled: false
                },
                {
                    value: '$',
                    label: '美元',
                    disabled: false
                },
                {
                    value: 'MOP$',
                    label: '澳门币',
                    disabled: false
                },
                {
                    value: 'NT$',
                    label: '新台币',
                    disabled: false
                }
            ],
            options: [
                {
                    value: '员工',
                    label: '员工'
                },
                {
                    value: '部长/副部长',
                    label: '部长/副部长'
                },
                {
                    value: '总经理助理/董事会秘书',
                    label: '总经理助理/董事会秘书'
                },
                {
                    value: '副总经理',
                    label: '副总经理'
                },
                {
                    value: '总经理',
                    label: '总经理'
                },
                {
                    value: '董事长',
                    label: '董事长'
                }
            ],
            rows: {
                submission2:{},
                submissionName:'',
                submissionId:'',
                number: '',
                submitter: '',
                subOrganName: '',
                total: '0.00',
                reason: '',
                type: '出差申请单',
                evections: [
                    {
                        bname: '',
                        bid: '',
                        bname1: '',
                        borganName: '',
                        ranks: '',
                        departure: '',
                        destination: '',
                        dateNumber: '',
                        startTime: '',
                        endTime: '',
                        reason: ''
                    }
                ],
                estimate: [
                    {
                        bigType: '',
                        bsType: [],
                        price: '',
                        smallType: '',
                        number: '',
                        currency: {
                            value: '￥',
                            label: '人民币'
                        },
                        rate: 1,
                        principal: 0,
                        subtotal: ''
                    }
                ],
                attachments: [],
                upper: '零元整',
                submitted: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                // .format('YYYY-MM-DD hh:mm:ss')
            },
            users: [],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            pickerOptions2: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            pickerOptions1: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
                ]
            },
            bigtype: '',
            getclass: [],
            dataaa: [],
            cookie_uid: cookies.get('uid'),
            // rules: {
            //     nasubOrganNameme: [
            //         { required: true, message: '请选择费用承担部门', trigger: 'change' },
            //     ],
            //     ranks: [
            //         { required: true, message: '请选择活动区域', trigger: 'change' }
            //     ],
            // },
            vacancy:[],
        };
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }

        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.rows.submitter = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.rows.subOrganName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getNum();
        this.remoteMethod();
        this.getClass();
        this.organs();
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
            this.rows.submissionId = this.rows.submission2.id
        },
        submissionDetail() {
            if (this.rows.submission2 && this.rows.submission2 != null) {
                this.common.open('#/apps/submission/' + this.rows.submissionId);
            }
        },
        currencyChange2(item, index) {
            for (let data of this.rows.estimate) {
                data.currency = item.currency;
                data.rate = item.rate;
            }
        },
        currencyChange() {
            if (
                this.rows.estimate.length > 1 &&
                this.rows.estimate[0].currency
            ) {
                for (let data of this.options2) {
                    if (data != this.rows.estimate[0].currency) {
                        data.disabled = true;
                    }
                }
            } else {
                for (let data of this.options2) {
                    data.disabled = false;
                }
            }
        },
        getTime() {
            for (let data of this.rows.evections) {
                const time1 = Date.parse(
                    new Date(data.startTime.replace(/-/g, '/'))
                );
                const time2 = Date.parse(
                    new Date(data.endTime.replace(/-/g, '/'))
                );
                const time3 = time2 - time1;
                const time4 = Math.floor(time3 / (24 * 3600 * 1000));
                if (data.startTime && data.endTime) {
                    if (time1 > time2) {
                        this.$message({
                            message: '开始日期应小于结束日期',
                            type: 'warning'
                        });
                        data.endTime = '';
                    } else {
                        data.dateNumber = time4 + 1;
                    }
                }
            }
        },
        organs() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.organs = res.data;
            });
        },

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
        changeUser(item, index) {
            for (let data of this.users) {
                if (item.bname1.id == data.id) {
                    if (data.organ) {
                        item.borganName = data.organ.name;
                    } else {
                        item.borganName = '';
                    }
                }
            }
        },
        changeOrgans() {},
        remoteMethod() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        addItem(type) {
            if (type == 'message') {
                this.rows.evections.push({});
            }
            if (type == 'fenDetaill') {
                this.rows.estimate.push({
                    bsType: [],
                    price: '',
                    smallType: '',
                    number: '',
                    currency:
                        this.rows.estimate.length == 0
                            ? {
                                  value: '￥',
                                  label: '人民币'
                              }
                            : this.rows.estimate[0].currency,
                    rate:
                        this.rows.estimate.length == 0
                            ? '1'
                            : this.rows.estimate[0].rate,
                    principal: 0,
                    subtotal: 0
                });
            }
        },
        getNum() {
            const self = this;
            axios
                .get('/api/v1/travel_forms/no', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.rows.number = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        money() {
            if (this.rows.total) {
                this.rows.upper = this.common.DX(this.rows.total);
            } else {
                this.rows.upper = '零元整';
            }
        },
        getAmount(item) {
            for (let data of this.rows.estimate) {
                data.rate = item.rate;
                if (data.price && data.number && data.rate) {
                    data.principal = this.common.toDecimal2(
                        data.price * data.rate * data.number
                    );
                } else {
                    data.principal = 0;
                }
                if (data.number && data.price != 0) {
                    item.subtotal = this.common.toDecimal2(
                        item.price * item.number
                    );
                } else {
                    data.subtotal = 0;
                }
            }

            this.getAmounta();
            this.money();
        },
        getAmounta() {
            let sum = 0;
            for (let data of this.rows.estimate) {
                sum += parseFloat(data.subtotal);
            }
            this.rows.total = sum;
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'message') {
                    if (item.id) {
                        axios
                            .get('/api/v1/travel_forms/delEvection/' + item.id)
                            .then(res => {
                                this.rows.evections.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.rows.evections.splice(index, 1);
                    }
                }
                if (type == 'cost') {
                    if (item.id) {
                        axios
                            .get('/api/v1/travel_forms/delEstimate/' + item.id)
                            .then(res => {
                                this.rows.estimate.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.rows.estimate.splice(index, 1);
                    }
                }
            });
        },
        handleClick() {},
        getForm() {
            this.clearForm();
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/travel_forms/' + this.formId)
                    .then(res => {
                        let array = [];
                        if (res.data.estimate.length > 0) {
                            for (let data of res.data.estimate) {
                                let select = [];
                                select[0] = data.bigType;
                                select[1] = data.smallType
                                    ? data.smallType
                                    : '';
                                array.push({
                                    bsType: select,
                                    created: data.created,
                                    id: data.id,
                                    number: data.number,
                                    price: data.price,
                                    currency: {
                                        value: data.currency.curValue,
                                        label: data.currency.label
                                    },
                                    rate: data.rate,
                                    principal: data.principal,
                                    subtotal: data.subtotal
                                });
                            }
                        }
                        res.data.estimate = [];
                        res.data.estimate = array;
                        let array1 = [];
                        if (res.data.evections.length > 0) {
                            for (let data of res.data.evections) {
                                array1.push({
                                    bname1: data.bname,
                                    bname: data.bname,
                                    ranks: data.ranks,
                                    id: data.id,
                                    borganName: data.borganName,
                                    number: data.number,
                                    departure: data.departure,
                                    destination: data.destination,
                                    dateNumber: data.dateNumber,
                                    startTime: data.startTime,
                                    endTime: data.endTime
                                });
                            }
                        }
                        res.data.evections = [];
                        res.data.evections = array1;
                        this.rows = res.data;
                        this.rows.submission2 =res.data.submissionName
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        dialogVisibleab(){
            this.dialogVisible = false;
            // this.$refs['formupdate'].validate((valid) => {
            //     if (valid) {
                    this.saveForm();
                    this.$emit('saveStatus', false);
            //     } else {
            //         this.$emit('saveStatus', true);
            //     }
            // });
           
        },
        saveFormValidate() {
            let showCheck = true;
            for (let data of this.rows.estimate) {
                if (data.price == '') {
                    showCheck = false;
                }
            }
            if (this.rows.subOrganName == '集团领导') {
                alert('费用承担部门选择错误，请重新选择');
            } else if (showCheck == false) {
                this.$message({
                    message: '请输入预估费用的单价',
                    type: 'error'
                });
            } else if(this.rows.reason == '' || this.rows.evections.borganName == '' ||this.rows.evections.departure == ''||this.rows.evections.destination == ''
            ||this.rows.evections.startTime == '' ||this.rows.evections.endTime == '' ||this.rows.estimate.bsType == '' ||this.rows.estimate.number == '' ){
                 this.dialogVisible = true;
            }else{
                // this.$refs['formupdate'].validate((valid) => {
                //     if (valid) {
                        this.saveForm();
                        this.$emit('saveStatus', false);
                //     } else {
                //         this.$emit('saveStatus', true);
                //         // this.dialogVisible = true;
                //     }
                // });
            };
            this.vacancy = [];
            for(let item of this.rows.evections){
                if(item.ranks == ''){
                    alert('有必输项职务未填写，请继续填写');
                    this.dialogVisible = false;
                }
            }
            if(this.rows.reason == ''){
                this.vacancy.push('出差事由')
            }
            for(let item of this.rows.evections){
                if(item.borganName == ''){
                    this.vacancy.push('所属部门')
                }
                if(item.departure == ''){
                    this.vacancy.push('出发地')
                }
                if(item.destination == ''){
                    this.vacancy.push('目的地')
                }
                if(item.startTime == ''){
                    this.vacancy.push('出差开始时间')
                }
                if(item.endTime == ''){
                    this.vacancy.push('出差结束时间')
                }
            }
            for(let item of this.rows.estimate){
                if(item.bsType == ''){
                    this.vacancy.push('费用类别')
                }
                if(item.number == ''){
                    this.vacancy.push('数量')
                }
            }
        },
        saveForm(action = '') {
            const self = this;
            if (self.rows.submitted) {
                self.rows.submitted = moment(self.rows.submitted).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            } else {
                self.rows.submitted = '';
            }
            for (let data of this.rows.evections) {
                if (data.bname1.name) {
                    data.bname = data.bname1.name;
                } else {
                    data.bname = data.bname1;
                }
                data.bid = data.bname1.id;
            }
            if (this.rows.estimate.length > 0) {
                let array = [];
                array = this.rows.estimate;
                this.rows.estimate = [];
                for (let data of array) {
                    this.rows.estimate.push({
                        bigType: data.bsType[0],
                        price: data.price,
                        number: data.number,
                        id: data.id ? data.id : '',
                        currency: {
                            curValue: data.currency.value,
                            label: data.currency.label
                        },
                        rate: data.rate,
                        principal: data.principal,
                        subtotal: data.subtotal,
                        smallType: data.bsType[1]
                    });
                }
            } else {
                this.rows.estimate = [];
            }
            if(this.rows.submission2){
                this.rows.submissionName = this.rows.submission2.submissionNo;
                this.rows.submissionId = this.rows.submission2.id;
            }
            axios
                .post('/api/v1/travel_forms/save', JSON.stringify(this.rows), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$emit('refreshData');
                        if (this.operationType == 'edit') {
                            self.$emit('refreshDetail');
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/travel_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    node: '提交',
                    action: 'COMMIT',
                })
                .then(res => {});
        },

        submitCheck() {
            if (this.rows.subOrganName == '集团领导') {
                alert('费用承担部门选择错误，请重新选择');
            } else if(this.rows.reason == '' || this.rows.evections.borganName == '' ||this.rows.evections.departure == ''||this.rows.evections.destination == ''
            ||this.rows.evections.startTime == '' ||this.rows.evections.endTime == '' ||this.rows.estimate.bsType == '' ||this.rows.estimate.number == '' ){
                 this.dialogVisible = true;
            } else {
                this.saveForm('save');
                this.$emit('saveStatus', false);
            }
            this.vacancy = [];
            for(let item of this.rows.evections){
                if(item.ranks == ''){
                    alert('有必输项职务未填写，请继续填写');
                    this.dialogVisible = false;
                }
            }
            if(this.rows.reason == ''){
                this.vacancy.push('出差事由')
            }
            for(let item of this.rows.evections){
                if(item.borganName == ''){
                    this.vacancy.push('所属部门')
                }
                if(item.departure == ''){
                    this.vacancy.push('出发地')
                }
                if(item.destination == ''){
                    this.vacancy.push('目的地')
                }
                if(item.startTime == ''){
                    this.vacancy.push('出差开始时间')
                }
                if(item.endTime == ''){
                    this.vacancy.push('出差结束时间')
                }
            }
            for(let item of this.rows.estimate){
                if(item.bsType == ''){
                    this.vacancy.push('费用类别')
                }
                if(item.number == ''){
                    this.vacancy.push('数量')
                }
            }
            // if (this.operationType == 'create') {
            //     this.saveForm('save');
            // } else {
            //     this.submitForm();
            // }
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/travels/' + this.currentFormId + '/create', '', {
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
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/travel_forms/' +
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
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const array = [];

            for (let data of self.rows.evections) {
                for (let item of self.users) {
                    if (item.name == data.bname) {
                        array.push(item.id);
                    }
                }
            }
            for (let item of this.organs) {
                if (item.name == this.rows.subOrganName) {
                    this.getoid = item.id;
                }
            }
            const params = {
                action: 'APPROVE',
                assignees: array,

                oid:
                    this.getoid.toString() == ''
                        ? this.$store.getters.LoginData.oid
                        : this.getoid.toString()
            };
            axios
                .put(
                    '/api/v1/travels/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    self.$emit('refreshData');
                    self.comment();
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        cancelForm() {
            const self = this;
            axios
                .put('/api/v1/travel_forms/' + this.formId + '/cancel', '', {
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
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/travel_forms/delAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.rows.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachments.splice(index, 1);
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
        getno() {
            const self = this;
            axios
                .get(
                    '/api/v1/travel_forms/getNo?dept=' + this.cookie_oname,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.rows.fileNo = res.data;
                });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        getFormData() {
            return this.rows;
        },
        clearForm() {
            this.rows = {
                number: this.rows.number,
                submitter: this.cookie_uname,
                subOrganName: this.cookie_oname,
                total: '0.00',
                upper: '零元整',
                reason: '',
                type: '',
                evections: [
                    {
                        bname: '',
                        bname1: '',
                        borganName: '',
                        ranks: '',
                        departure: '',
                        destination: '',
                        dateNumber: '',
                        startTime: '',
                        endTime: ''
                    }
                ],
                estimate: [
                    {
                        bigType: '',
                        bsType: [],
                        price: '',
                        smallType: '',
                        number: '',
                        currency: {
                            value: '￥',
                            label: '人民币'
                        },
                        rate: '1',
                        principal: 0,
                        subtotal: ''
                    }
                ],
                attachments: [],
                submitted: moment()
                    .utc()
                    .format('YYYY-MM-DD hh:mm:ss')
            };
            this.getNum()
        }
    }
};
</script>
<style lang="scss">
#travelForm {
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
        .span1{
            color:red;
            margin-right: 5px;
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
    .attachments {
        position: relative;
        // margin-bottom: 40px;
        margin-right: 30px;
        width: 200px;
        // height: 80px;
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 180px;
    }
    .el-input--suffix .el-input__inner {
        padding-right: 0;
    }
    .el-cascader {
        width: 100%;
    }
    #moneyright {
        .el-input__inner {
            text-align: right;
        }
    }
    .notice{
        color: red;
        ol{
            font-size: 17px;
        }
    }
}
</style>