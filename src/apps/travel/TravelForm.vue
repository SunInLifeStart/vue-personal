<template>
    <el-dialog title="出差申请" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
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
                        <el-form-item label="出差类型：">
                            <el-select v-model="formData.travelType" placeholder="选择出差类型" @change="SubmissionChange">
                                <el-option v-for="item in typeoption" :key="item.id" :label="item.label" :value="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：" label-width="30px;">
                            <el-select v-model="formData.submission2" value-key="id" placeholder="选择呈报件" @change="SubmissionChange">
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
                            <el-input v-model="formData.submitter" disabled="disabled"></el-input>
                        </td>
                        <td colspan="1">
                            <span class="span1">*</span> 费用承担部门
                        </td>
                        <td colspan="2">
                            <el-select style="width:100%" v-model="formData.subOrganName" value-key="id" @change="changeOrgans()" placeholder="">
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
                    <tr v-for="(item,index) in this.formData.evections" :key="item.index" @contextmenu.prevent="deleteItem(item,index,'message')">
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
                    <tr v-for="(item,index) in this.formData.estimate" :key="index" @contextmenu.prevent="deleteItem(item,index,'cost')">
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
                        <td colspan="6">
                            <!-- {{this.formData.estimate.length ==0 ? '￥': this.formData.estimate[0].currency.value}} -->
                            <!-- <el-input style="width:150px" v-model="formData.total" disabled></el-input>（金额大写:({{this.formData.estimate.length ==0 ? '人民币': this.formData.estimate[0].currency.label}} ): {{this.formData.upper}}) -->
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
            <el-dialog title="提示" append-to-body :visible.sync="dialogVisible" width="30%">
                <span v-for="item in this.vacancy" :key="item">"{{item}}",</span>未填写，是否继续
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisibleab">确 定</el-button>
                </span>
            </el-dialog>
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
            users: [],
            appFlowName: 'motor-trainingapplication_train',
            //
            dialogVisible: false,
            submissionSelections: [],
            getoid: '',
            typeoption: [
                {
                    label: '市内',
                    value: '市内'
                },
                {
                    label: '市外',
                    value: '市外'
                }
            ],
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
            formData: {
                submission2: {},
                submissionName: '',
                submissionId: '',
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
            vacancy: []
        };
    },
    watch: {
        'formData.lowercase'(val) {
            this.formData.upper = val ? this.convertCurrency(val) : '';
        }
    },
    components: {
        FilesOperate
    },
    mounted() {
        // this.getNum();
        // this.remoteMethod();
        // this.getClass();
        // this.organs();
        // this.getSubmissionlList();
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
            this.formData.submissionId = this.formData.submission2.id;
        },
        submissionDetail() {
            if (
                this.formData.submission2 &&
                this.formData.submission2 != null
            ) {
                this.common.open(
                    '#/apps/submission/' + this.formData.submissionId
                );
            }
        },
        currencyChange2(item, index) {
            for (let data of this.formData.estimate) {
                data.currency = item.currency;
                data.rate = item.rate;
            }
        },
        currencyChange() {
            if (
                this.formData.estimate.length > 1 &&
                this.formData.estimate[0].currency
            ) {
                for (let data of this.options2) {
                    if (data != this.formData.estimate[0].currency) {
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
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.organs = res.data;
            });
        },
        addItem(type) {
            if (type == 'message') {
                this.formData.evections.push({});
            }
            if (type == 'fenDetaill') {
                this.formData.estimate.push({
                    bsType: [],
                    price: '',
                    smallType: '',
                    number: '',
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
            }
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
        
        getNum() {
            const self = this;
            axios
                .get('/api/v1/travel_forms/no', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.formData.number = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        money() {
            if (this.formData.total) {
                this.formData.upper = this.common.DX(this.formData.total);
            } else {
                this.formData.upper = '零元整';
            }
        },
        */
        dialogVisibleab() {
            this.dialogVisible = false;
            this.saveForm();
            this.$emit('saveStatus', false);
        },

        setDataFromParent(data) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                attachments: [],
                // number:this.formData.number,
                travelType: '',
                submission2: '',
                submitter: '',
                subOrganName: '',
                submitted: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                reason: '',
                evections: [
                    {
                        bname1: '',
                        borganName: '',
                        ranks: '',
                        departure: '',
                        destination: '',
                        endTime: '',
                        startTime: '',
                        dateNumber: ''
                    }
                ],
                estimate: [
                    {
                        bsType: [],
                        price: '',
                        number: '',
                        currency: '人民币',
                        rate: '',
                        subtotal: '',
                        principal: ''
                    }
                ]
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            let response = await $self.saveFormData(
                '/api/v1/trainingApplication/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
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
                        await $self.startSignal(actions.data.types[0]);
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