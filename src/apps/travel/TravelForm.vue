<template>
    <el-dialog title="出差申请" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="90%" style="text-align: center;">
        <div id="travelForm">
            <div class="notice">
                <h2>注意</h2>
                <ol>
                    <li>完整填写所有出差人员；</li>
                    <li>预估费用按照厉行节俭的要求严格控制，费用标准请参考集团国内差旅制度；</li>
                    <li>出差补助金额不需计入。</li>
                </ol>
            </div>
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水单号：">{{formData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出差类型：" :required="true">
                            <el-select v-model="formData.travelType" :required="true" placeholder="选择出差类型" @change="SubmissionChange">
                                <el-option v-for="item in typeoption" :key="item.index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：" :required="true" label-width="30px;">
                            <el-select v-model="submission" clearable filterable placeholder="选择呈报件" allow-create @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
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
                            <el-input v-model="formData.submitter" disabled="disabled"></el-input>
                        </td>
                        <td colspan="1">
                            <span class="span1">*</span> 费用承担部门
                        </td>
                        <td colspan="2">
                            <el-select style="width:100%" v-model="formData.subOrganName" placeholder="">
                                <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td colspan="1">提单时间</td>
                        <td colspan="2">
                            <el-date-picker style="width:100%" disabled="disabled" v-model="formData.submitted" value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
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
                            <el-input v-model="formData.reason"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            <span class="span1">*</span>出差人员</td>
                        <td colspan="1">所属部门</td>
                        <td colspan="1">
                            <span class="span1">*</span>职务</td>
                        <td colspan="1">
                            <span class="span1">*</span>出发地</td>
                        <td colspan="1">
                            <span class="span1">*</span>目的地</td>
                        <td colspan="2">
                            <span class="span1">*</span>出差时间</td>
                        <td colspan="1">出差天数（天）</td>
                    </tr>
                    <tr v-for="(item,index) in formData.evections" :key="item.index" @contextmenu.prevent="deleteItem(item,index,'message')">
                        <td colspan="1">
                            <span>{{index +1}}</span>
                            <span style="display: inline-block; width: 85%;">
                                <el-select v-model="item.bname1" value-key="id" @change="changeUser(item,index)" filterable placeholder="选择出差人员">
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
                                <el-option v-for="item in options" :key="item.index" :label="item" :value="item">
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
                        <td colspan="2">
                            <span class="span1">*</span>费用类别</td>
                        <td colspan="1">
                            <span class="span1">*</span>单价</td>
                        <td colspan="1">
                            <span class="span1">*</span>数量/公里</td>
                        <td colspan="1">币种</td>
                        <td colspan="1">预估汇率</td>
                        <td colspan="1">原币金额合计</td>
                        <td colspan="1">预估本币金额</td>
                    </tr>
                    <tr v-for="(item,index) in formData.estimate" :key="index" @contextmenu.prevent="deleteItem(item,index,'cost')">
                        <td colspan="2">
                            <el-cascader :options="getclass" change-on-select filterable v-model="item.bsType" :props="{value:'name',label:'name'}">
                            </el-cascader>
                        </td>
                        <td colspan="1">
                            <el-input @mousewheel.native.prevent v-model.number="item.price" @input="getAmount(item)"></el-input>
                        </td>
                        <td colspan="1">
                            <el-input @mousewheel.native.prevent v-model.number="item.number" @input="getAmount(item)"></el-input>
                        </td>
                        <td colspan="1">
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
                        <td colspan="6">
                            {{this.formData.estimate.length ==0 ? '￥': this.formData.estimate[0].currency.value}} {{this.formData.total}} （金额大写:({{this.formData.estimate.length ==0 ? '人民币': this.formData.estimate[0].currency.label}} ): {{this.formData.upper}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c">附件上传</span>
                            </el-upload>
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in formData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div>
                        </td>
                    </tr>

                </table>
            </el-form>
        </div>
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
export default {
    mixins: [publicMethods],
    name: 'travelForm',
    data() {
        return {
            dialogFormVisible: false,
            formData: this.resetForm(),
            appFlowName: 'motor-trainingapplication_train',
            submission: '',
            submissionSelections: [],
            typeoption: ['市内', '市外'],
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
            options: [
                '员工',
                '部长/副部长',
                '总经理助理/董事会秘书',
                '副总经理',
                '总经理',
                '董事长',
                '总经理和董事长'
            ],
            formData: this.resetForm(),
            users: [],
            getclass: [
                {
                    id: 1,
                    name: '筹资',
                    code: '011',
                    children: [
                        {
                            id: 2,
                            name: '股权筹资',
                            code: '011001',
                            children: [
                                {
                                    id: 3,
                                    name: '入资款',
                                    code: '011001001',
                                    children: null
                                },
                                {
                                    id: 4,
                                    name: '股票筹资',
                                    code: '011001002',
                                    children: null
                                }
                            ]
                        },
                        {
                            id: 6,
                            name: '债务筹资',
                            code: '011002',
                            children: [
                                {
                                    id: 7,
                                    name: '流动负债',
                                    code: '011002001',
                                    children: null
                                },
                                {
                                    id: 4,
                                    name: '股票筹资',
                                    code: '011001002',
                                    children: null
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 232,
                    name: '计提类',
                    code: '027',
                    children: [
                        {
                            id: 233,
                            name: '计提折旧',
                            code: '027001',
                            children: null
                        },
                        {
                            id: 234,
                            name: '无形资产摊销',
                            code: '027002',
                            children: null
                        }
                    ]
                }
            ],
            loadData: {
                attachments: [
                    {
                        created: '2019-04-09 16:10:44',
                        iconUrl: '/thumb/131/196/2936.doc',
                        id: 2936,
                        name:
                            '进出口公司综合业务系统深化应用项目周报（20180604-20180608）.doc',
                        organId: 426,
                        organName: '综合管理部',
                        personal: false,
                        size: 50176,
                        type: 'DOC',
                        uid: 513,
                        uname: '董文宇',
                        url: '/api/v1/files/131/196/2936.doc'
                    }
                ],
                number: '',
                travelType: '市内',
                submitter: '123',
                subOrganName: '123',
                submitted: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                reason: '222',
                total: 778,
                upper: '这是大写',
                evections: [
                    {
                        bname1: {
                            attr1: '0000001',
                            avatar: '',
                            id: 497,
                            name: '高中成',
                            organ: { id: 425, name: '公司领导', parentId: 0 },
                            organs: [
                                { id: 425, name: '公司领导', parentId: 0 }
                            ],
                            roles: [
                                {
                                    id: 433,
                                    name: '协同发展董事长',
                                    en: 'xtfz_chairman'
                                }
                            ],
                            type: 2,
                            username: 'gaozc'
                        },
                        borganName: '公司领导',
                        ranks: '333',
                        departure: '333',
                        destination: '333',
                        endTime: '2019-04-30',
                        startTime: '2019-04-28',
                        dateNumber: 3,
                        id: ''
                    }
                ],
                estimate: [
                    {
                        bsType: [],
                        price: 2,
                        number: 33,
                        currency: {
                            value: '€',
                            label: '欧元'
                        },
                        rate: 1,
                        subtotal: '198.00',
                        principal: '66.00',
                        id: ''
                    }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        this.getUsers();
        this.organs();
    },
    methods: {
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
        SubmissionChange(val) {
            console.log(val);
            this.formData.tra = true;
            let boolean = false;
            for (let data of this.submissionSelections) {
                if (data.id == val) {
                    boolean = true;
                }
            }
            this.formData.travelView = boolean;
        },
        submissionDetail() {
            if (this.submission && this.submission != null) {
                this.common.open('#/apps/submission/' + this.submission);
            }
        },
        currencyChange2(item, index) {
            for (let data of this.formData.estimate) {
                data.currency = item.currency;
                // data.rate = item.rate;
            }
        },
        getTime() {
            for (let data of this.formData.evections) {
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
            axios.get('/api/v1/organs').then(res => {
                this.organs = res.data;
            });
        },
        checkTravelMessage() {
            let travelMessage = true;
            for (let data of this.formData.evections) {
                if (
                    data.bname == '' ||
                    data.ranks == '' ||
                    data.departure == '' ||
                    data.destination == '' ||
                    data.startTime == '' ||
                    data.endTime == ''
                ) {
                    travelMessage = false;
                }
            }
            return travelMessage;
        },
        checkTravelType() {
            let travelType = true;
            for (let data of this.formData.estimate) {
                if (
                    !data.bsType[0] ||
                    data.price == '' ||
                    data.number == '' ||
                    data.rate == ''
                ) {
                    travelType = false;
                }
            }
            return travelType;
        },
        addItem(type) {
            if (type == 'message') {
                if (this.checkTravelMessage()) {
                    this.formData.evections.push({
                        bname1: {},
                        bname: '',
                        borganName: '',
                        ranks: '',
                        departure: '',
                        destination: '',
                        endTime: '',
                        startTime: '',
                        dateNumber: '',
                        id: ''
                    });
                } else {
                    this.$message({
                        message: '请输入出差明细必填项',
                        type: 'error'
                    });
                }
            }
            if (type == 'fenDetaill') {
                if (this.checkTravelType()) {
                    this.formData.estimate.push({
                        id: '',
                        bsType: [],
                        price: '',
                        number: '',
                        smallType: '',
                        currency:
                            this.formData.estimate.length == 0
                                ? {
                                      value: '￥',
                                      label: '人民币'
                                  }
                                : this.formData.estimate[0].currency,
                        rate:
                            this.formData.estimate.length == 0
                                ? '1'
                                : this.formData.estimate[0].rate,
                        principal: 0,
                        subtotal: 0
                    });
                } else {
                    this.$message({
                        message: '请输入预估费用必输项',
                        type: 'error'
                    });
                }
            }
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'message') {
                    if (item.id && item.id != '') {
                        axios
                            .get('/api/v1/travel_forms/delEvection/' + item.id)
                            .then(res => {
                                this.formData.evections.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.formData.evections.splice(index, 1);
                    }
                }
                if (type == 'cost') {
                    if (item.id && item.id != '') {
                        axios
                            .get('/api/v1/travel_forms/delEstimate/' + item.id)
                            .then(res => {
                                this.formData.estimate.splice(index, 1);
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.formData.estimate.splice(index, 1);
                    }
                    this.getAmounta();
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
        changeUser(item, index) {
            for (let data of this.users) {
                if (item.bname1.id == data.id) {
                    item.bname = data.name;
                    if (data.organ) {
                        item.borganName = data.organ.name;
                    } else {
                        item.borganName = '';
                    }
                }
            }
        },
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        getNum() {
            const self = this;
            let params = {
                code: 'travel_forms'
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
            for (let data of this.formData.estimate) {
                data.rate = item.rate;
                if (data.price != '' && data.number != '' && data.rate != '') {
                    data.principal = this.common.toDecimal2(
                        data.price * data.rate * data.number
                    );
                } else {
                    data.principal = 0;
                }
            }
            if (item.number != '' && item.price != 0) {
                item.subtotal = this.common.toDecimal2(
                    item.price * item.number
                );
            } else {
                item.subtotal = 0;
            }
            this.getAmounta();
        },
        getAmounta() {
            let sum = 0;
            for (let data of this.formData.estimate) {
                sum += parseFloat(data.subtotal);
            }
            this.formData.total = sum;
            this.formData.upper = this.common.DX(this.formData.total);
        },
        setDataFromParent(data) {
            if (data.estimate.length > 0) {
                for (let item of data.estimate) {
                    item.bsType = item.bigType.split(',');
                    item.currency = {
                        value: item.currency.curValue,
                        label: item.currency.label
                    };
                }
            }
            for (let item of data.evections) {
                item.bname1 = item.bname;
            }
            if (data.submissionId && data.submissionId != null) {
                if (data.travelView) {
                    this.submission = parseInt(data.submissionId);
                } else {
                    this.submission = data.submissionId;
                }
            }
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.submission = '';
            this.formData = this.resetForm();
            this.getNum();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                attachments: [],
                number: '',
                travelView: true,
                travelType: '',
                submissionId: '',
                submissionName: '',
                submitter: cookies.get('uname'),
                subOrganName: cookies.get('oname'),
                submitted: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                reason: '',
                total: '',
                upper: '',
                evections: [
                    {
                        bname1: {},
                        bname: '',
                        borganName: '',
                        ranks: '',
                        departure: '',
                        destination: '',
                        endTime: '',
                        startTime: '',
                        dateNumber: '',
                        id: ''
                    }
                ],
                estimate: [
                    {
                        bsType: [],
                        price: '',
                        number: '',
                        currency: {
                            value: '￥',
                            label: '人民币'
                        },
                        rate: 1,
                        subtotal: 0,
                        principal: 0,
                        id: ''
                    }
                ]
            };
            return formData;
        },
        saveFormValidate(type) {
            if (this.formData.subOrganName == '集团领导') {
                this.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else if (
                this.formData.submission == '' ||
                this.formData.travelType == '' ||
                this.formData.subOrganName == '' ||
                this.formData.reason == '' ||
                this.checkTravelMessage() == false ||
                this.checkTravelType() == false
            ) {
                this.$message({
                    message: '请输入必填项',
                    type: 'error'
                });
            } else {
                this.saveForm(type);
            }
            // this.$refs['formupdate'].validate(valid => {
            //   if (valid) {
            //      this.saveForm(type);
            // }
            // });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if ($self.formData.submitted) {
                $self.formData.submitted = moment(
                    $self.formData.submitted
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                $self.formData.submitted = '';
            }
            /**
            for (let data of this.rows.evections) {
                if (data.bname1.name) {
                    data.bname = data.bname1.name;
                } else {
                    data.bname = data.bname1;
                }
                data.bid = data.bname1.id;
            }
            */
            if (this.formData.estimate.length > 0) {
                for (let data of this.formData.estimate) {
                    data.bigType = data.bsType.join(',');
                    data.currency = {
                        curValue: data.currency.value,
                        label: data.currency.label
                    };
                }
            }
            if (this.submission != '') {
                this.formData.submissionId = this.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.submission) {
                        this.formData.submissionName = data.submissionNo;
                    }
                }
                if (this.formData.travelView == false) {
                    this.formData.submissionName = this.formData.submissionId;
                }
            }
            let response = await $self.saveFormData(
                '/api/v1/travel_forms/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = false;
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
                    $self.msgTips('提交失败', 'warning');
                } else {
                    $self.msgTips('保存失败', 'warning');
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
            this.$refs.upload.clearFiles();
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
                                '/api/v1/travel_forms/delAttachment/' + id,
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
        .span1 {
            color: red;
            margin-right: 5px;
        }
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
    .attachments {
        position: relative;
        margin-right: 30px;
        width: 200px;
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
}
</style>