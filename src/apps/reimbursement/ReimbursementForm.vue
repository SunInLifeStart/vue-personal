<template>
    <el-dialog title="对私报销表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="90%" style="text-align: center;">
        <div id="ReimbursementForm">
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;">
                    <el-col :span="6">
                        <el-form-item label="流水单号：" label-width="100px">
                            <el-input style="width:160px;" v-model="formData.no" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="出差审批单：" label-width="115px">
                            <el-select v-model="travelPeople" placeholder="选择出差审批单" @change="travelChange" allow-create filterable>
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="travelDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="呈报件：" label-width="25px;">
                            <el-select v-model="submission" filterable placeholder="选择呈报件" allow-create @change="SubmissionChange">
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
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="招待费审批表：" label-width="25px;">
                            <el-select v-model="expenses" filterable placeholder="选择招待费审批单" allow-create @change="expensesChange">
                                <el-option v-for="item in expensesSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.expensesView">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="expensesDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.expensesView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>

                <table border="1px solid #f00" style="width: 99%; height: 100%; table-layout: fixed; word-break: break-all;margin-top:20px;">
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
                            <el-input v-model="formData.creatorName" disabled></el-input>
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.organName" disabled></el-input>
                        </td>
                        <td>
                            提单时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="formData.created" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span style="color:red;">*</span>
                            收款人
                        </td>
                        <td>
                            <el-select v-model="formData.payee" placeholder="请选择" @change="payeeChange" filterable>
                                <el-option v-for="item in borrowPerson" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            开户行
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.bank"></el-input>
                        </td>
                        <td>
                            银行卡号
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.cardNo"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span style="color:red;">*</span>
                            结算方式
                        </td>
                        <td>
                            <el-select v-model="formData.clearing" placeholder="请选择">
                                <el-option v-for="item in clearing_method" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            <el-select v-model="formData.expenseDep" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in combinedUnit" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            分摊
                        </td>
                        <td colspan="2">
                            <el-radio-group v-model="formData.share" @change="radioChange('share')">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
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
                            <el-input v-model="formData.depict"></el-input>
                        </td>
                        <td>
                            费用归属项目
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.costItem"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span style="color:red;">*</span>
                            费用类别
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            币种
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            金额
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            预估汇率
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            预估本币金额
                        </td>
                        <td>
                            <!--<span style="color:red;">*</span>-->
                            不含税价格
                        </td>
                        <td>
                            <!--<span style="color:red;">*</span>-->
                            税金
                        </td>
                    </tr>
                    <tr v-for="(item,index) in formData.repayItems" :key="item.index" @contextmenu.prevent="youjian(index,'baoxiao')">
                        <td colspan="2">
                            <el-cascader :options="options_spec" @change="selectChangeType(item,index)" filterable v-model="item.min" :props="prop"></el-cascader>
                        </td>
                        <td>
                            <el-select v-model="item.currency" placeholder="人民币" value-key="value" @change="handleChange(item, index,'currency')">
                                <el-option v-for="item in currency_method" :key="item.value" :label="item.label" :value="{value:item.value, label: item.label}">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="item.money" oninput="if(value.length>9) value=value.slice(0,9)" type="number" @mousewheel.native.prevent @input="loseFocus(item,index,'money')"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.estRate" type="number" @mousewheel.native.prevent @input="loseFocus(item,index,'money')"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.estSum" type="number" @mousewheel.native.prevent></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.noTax" oninput="if(value.length>9) value=value.slice(0,9)" @mousewheel.native.prevent @input="loseFocus(item,index,'money','notax')"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.tax" oninput="if(value.length>9) value=value.slice(0,9)" @mousewheel.native.prevent @input="loseFocus(item,index,'money', 'tax')"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <p @click="insert('baoDetail')">插入</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            金额合计
                        </td>
                        <td colspan="2">
                            <span style="float:left;"> {{this.formData.repayItems.length ==0 ? '￥': this.formData.repayItems[0].currency.value}}</span>
                            <span style="float:right;">{{parseFloat(this.formData.total).toLocaleString()}}</span>
                        </td>
                        <td>
                            金额大写
                        </td>
                        <td colspan="4">
                            <span> ({{this.formData.repayItems.length ==0 ? '人民币': this.formData.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.formData.upper}})</span>
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
                            <el-radio-group v-model="formData.budget.fundPlan">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            <el-radio-group v-model="formData.budget.est">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">借款信息</td>
                    </tr>
                    <tr>
                        <td>
                            <span style="color:red;">*</span>
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
                            <el-radio-group v-model="formData.borrow.bor" @change="radioChange('bor')">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                        <td colspan="2">
                            <el-select v-model="formData.borrow.borrowOdd" placeholder="请选择" @change="borrowOddChange" :disabled="this.formData.borrow.bor== null || this.formData.borrow.bor == false">
                                <el-option v-for="item in borrowOddSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="left">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="borrowOddDetail"></el-button>
                            </el-tooltip>
                        </td>
                        <td>
                            {{parseFloat(this.formData.borrow.noVerify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                            {{parseFloat(this.formData.borrow.verify).toLocaleString()}}
                        </td>
                        <td colspan="2">
                            <el-radio-group v-model="formData.borrow.sendDack" @change="radioChange('sendDack')" :disabled="this.formData.borrow.bor== null || this.formData.borrow.bor == false ">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td>应付金额({{this.formData.repayItems.length ==0 ? '￥': this.formData.repayItems[0].currency.value}})</td>
                        <td colspan="3">
                            {{parseFloat(this.formData.borrow.payAble).toLocaleString()}}
                        </td>
                        <td>应退金额({{this.formData.repayItems.length ==0 ? '￥': this.formData.repayItems[0].currency.value}})</td>
                        <td colspan="3">
                            {{parseFloat(this.formData.borrow.shouldBack).toLocaleString()}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            金额大写
                        </td>
                        <td colspan="6">
                            ({{this.formData.repayItems.length ==0 ? '人民币': this.formData.repayItems[0].currency.label}}:&nbsp;&nbsp;{{this.formData.borrow.upperSum}})
                        </td>
                    </tr>
                    <tr v-show="formData.share == true">
                        <td colspan="8" style="font-weight:bold;">
                            分摊明细
                        </td>
                    </tr>
                    <tr v-show="formData.share == true">
                        <td colspan="2">
                            承担单位
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            承担部门
                        </td>
                        <td>
                            <span style="color:red;">*</span>
                            承担金额({{this.formData.repayItems.length ==0 ? '￥': this.formData.repayItems[0].currency.value}})
                        </td>
                        <td colspan="3">
                            金额大写【{{this.formData.repayItems.length ==0 ? '人民币': this.formData.repayItems[0].currency.label}}】
                        </td>
                        <td>
                            分摊比例(%)
                        </td>
                    </tr>
                    <tr v-for="(item,index) in formData.shares" :key="item.index" @contextmenu.prevent="youjian(index,'fentan')" v-show="formData.share == true">
                        <td colspan="2">
                            <el-input v-model="item.bearUnit"></el-input>
                        </td>
                        <td>
                            <el-select v-model="item.bearDep" placeholder="请选择">
                                <el-option v-for="item in combinedUnit" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="item.bearSum" type="number" @mousewheel.native.prevent @input="loseFocus(item,index,'bearSum')"></el-input>
                        </td>
                        <td colspan="3">
                            <el-input v-model="item.upper"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.shareRatio" type="number" @mousewheel.native.prevent></el-input>
                        </td>
                    </tr>
                    <tr v-show="formData.share == true">
                        <td colspan="8">
                            <p @click="insert('fentan')">插入</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            附件</td>
                    </tr>
                    <tr>
                        <td>
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c">
                                    <span style="color:red;">*</span> 附件上传
                                    <i class="el-icon-plus"></i>
                                </span>
                            </el-upload>

                        </td>
                        <td colspan="7" style="padding: 10px;">
                            <div v-for="(item,index) in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments,'/api/v1/expense_forms/deleteAtt/' + item.id,'get')"></FilesOperate>
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
/* eslint-disable */
import moment from 'moment';
import axios from 'axios';
import FilesOperate from '../FilesOperate';
import cookies from 'js-cookie';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
import { debug } from 'util';
export default {
    mixins: [publicMethods],
    name: 'ReimbursementForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            options_spec: [],
            selectOptions: [],
            appFlowName: 'expense-form_reimbursement',
            clearing_method: [
                '网银',
                '电汇',
                '现金支票',
                '转账支票',
                '信汇',
                '现金',
                '存单'
            ],
            currency_method: [
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
            borrowOddSelections: [],
            showBank: false,
            prop: {
                value: 'name',
                label: 'name',
                id: 'id',
                children: 'children'
            },
            combinedUnit: [],
            borrowPerson: [],
            travelPeople: '',
            expenses: '',
            expensesSelections: [],
            submission: '',
            submissionSelections: [],
            travelSelections: [],
            changeTotal: 0,
            travelList: []
        };
    },
    watch: {
        changeTotal: function() {
            this.radioChange('bor');
            if (this.formData.shares && this.formData.shares.length > 0) {
                this.shareRadio();
            }
        }
    },
    components: {
        FilesOperate
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
                    this.options_spec = response;
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
        //限制一张单子只能选择一种大类的方
        getSelectOptions() {
            this.options_spec = [];
            if (
                this.tableData.length > 1 &&
                this.tableData[0].min[0] &&
                this.type != '6'
            ) {
                this.options_spec = this.selectOptions;
                const param = this.tableData[0].min[0];
                for (let data of this.options_spec) {
                    if (data.code != param) {
                        data.disabled = true;
                    }
                }
            } else {
                this.options_spec = [];
                this.getTypeOpertions();
                this.options_spec = this.selectOptions;
            }
        },
        getSelectCascader() {
            self.selectOptions = [];
            axios.get('/api/v1/reim/queryCode').then(res => {
                for (let data of res.data) {
                    if (
                        data.code != '001' &&
                        data.code != '002' &&
                        data.code != '003' &&
                        data.code != '004' &&
                        data.code != '005'
                    ) {
                        if (data.children != null) {
                            for (let data1 of data.children) {
                                self.selectOptions.push(data1);
                            }
                        } else {
                            self.selectOptions.push(data);
                        }
                    }
                }
                for (let data of this.selectOptions) {
                    data.disabled = false;
                }
            });
        },
        //根据级联控件获取到的费用类型id数组，根据接口获得对应的汉字描述
        selectChangeType(item, index) {
            item.bigTypeName = item.min.join(',');
        },
        //获取表单的流水编号
        getNo() {
            const self = this;
            let params = {
                code: 'expense_forms'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.no = res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        //获取收款人列表（需求让新加‘多人’,允许多人选）
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.borrowPerson = [];
                for (let data of res.data) {
                    this.borrowPerson.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.borrowPerson.push({
                    id: '多人',
                    name: '多人'
                });
            });
        },
        //获取各个部门数据
        getOgans() {
            axios.get('/api/v1/users/list/organss').then(res => {
                this.combinedUnit = [];
                for (let data of res.data) {
                    this.combinedUnit.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.combinedUnit = res.data;
            });
        },
        //报销明细和分摊明细鼠标右键删除方法
        youjian(index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'baoxiao') {
                    if (
                        !this.createForm_status &&
                        this.formData.repayItems[index].id
                    ) {
                        //调删除方法
                        axios
                            .get(
                                '/api/v1/expense_forms/deleteItem/' +
                                    this.formData.repayItems[index].id
                            )
                            .then(res => {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                //  this.$emit('deleteItem');
                                this.formData.repayItems.splice(index, 1);
                                if (this.formData.repayItems.length <= 0) {
                                    this.formData.total = this.common.toDecimal2(
                                        0
                                    );
                                    this.formData.upper = this.common.DX(
                                        '0.00'
                                    );
                                    this.changeTotal = this.formData.total;
                                } else {
                                    this.totalSalary();
                                }
                            })
                            .catch(function() {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.formData.repayItems.splice(index, 1);
                        if (this.formData.repayItems.length <= 0) {
                            this.formData.total = this.common.toDecimal2(0);
                            this.formData.upper = this.common.DX('0.00');
                            this.changeTotal = this.formData.total;
                        } else {
                            this.totalSalary();
                        }
                    }
                } else if (type == 'fentan') {
                    if (
                        !this.createForm_status &&
                        this.formData.shares[index].id
                    ) {
                        axios
                            .get(
                                '/api/v1/expense_forms/deleteShare/' +
                                    this.formData.shares[index].id
                            )
                            .then(res => {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                //  this.$emit('deleteItem');
                                this.formData.shares.splice(index, 1);
                            })
                            .catch(function() {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.formData.shares.splice(index, 1);
                    }
                }
            });
        },
        clickRow(row) {
            const self = this;
            self.event.returnValue = false;
        },
        checkBaoDetail() {
            let boolean = true;
            for (let data of this.formData.repayItems) {
                if (
                    !data.min[0] ||
                    data.currency == '' ||
                    data.money == '' ||
                    data.estRate == '' ||
                    data.estSum == ''
                ) {
                    boolean = false;
                }
            }
            return boolean;
        },
        checkFenDetail() {
            let boolean = true;
            for (let data of this.formData.shares) {
                if (data.bearDep == '' || parseInt(data.bearSum) <= 0) {
                    boolean = false;
                }
            }
            return boolean;
        },
        //点击插入新增列表数据的方法
        insert(type) {
            if (type == 'baoDetail') {
                if (this.checkBaoDetail()) {
                    this.formData.repayItems.push({
                        min: [],
                        tax: 0,
                        noTax: 0,
                        bigTypeName: '',
                        smallTypeName: '',
                        currency:
                            this.formData.repayItems.length == 0
                                ? {
                                      value: '￥',
                                      label: '人民币'
                                  }
                                : this.formData.repayItems[0].currency,
                        money: '',
                        id: '',
                        estRate:
                            this.formData.repayItems.length == 0
                                ? 1
                                : this.formData.repayItems[0].estRate,
                        estSum: this.common.toDecimal2(0)
                    });
                } else {
                    this.$message({
                        message: '请输入报销明细必填项',
                        type: 'error'
                    });
                }
            } else if (type == 'fentan') {
                if (this.checkFenDetail()) {
                    this.formData.shares.push({
                        bearUnit: '中关村发展集团',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: ''
                    });
                } else {
                    this.$message({
                        message: '请输入分摊明细选项',
                        type: 'error'
                    });
                }
            }
        },
        //获取详情前清空数据方法，要调用，不然有缓存，影响借款相关数据
        getClearForm() {
            this.expenses = '';
            this.submission = '';
            this.travelPeople = '';
            this.getOgans();
            this.getUsers();
            // this.getTravelList();
            // this.getSubmissionlList();
            this.formData = {
                no: '',
                id: '',
                expensesView: true,
                expensesId: '',
                expensesName: '',
                subView: true,
                travelView: true,
                travellerId: '',
                travelName: '',
                budgetSure: false,
                submissionId: '',
                submissionName: '',
                creatorName: cookies.get('uname'),
                organName: cookies.get('oname'),
                created: moment().format('YYYY-MM-DD HH:mm:ss'),
                payee: '',
                payeeId: '',
                expenseId: cookies.get('oid'),
                bank: '',
                cardNo: '',
                clearing: '',
                depict: '',
                costItem: '',
                upper: '',
                expenseDep: this.$store.getters.LoginData.oname,
                share: false,
                total: this.common.toDecimal2(0),
                budget: {
                    est: false,
                    fundPlan: false
                },
                attachments: [],
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    total: 0,
                    borrowId: '',
                    verify: 0,
                    sendDack: true,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: [
                    {
                        bearUnit: '中关村发展集团',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: '',
                        id: ''
                    }
                ],
                repayItems: []
            };
        },
        //编辑表单
        async setDataFromParent(data) {
            let $self = this;
            $self.getClearForm();
            $self.getClass();
            $self.getSubmissionlList();
            $self.getTravelList();
            this.getExpenseslList();
            // this.formData = data;
            $self.url = '/api/v1/expense_forms/' + data.id;
            let response = await $self.getDetails();
            if (response) {
                if (
                    response.data.submissionId &&
                    response.data.submissionId != null
                ) {
                    if (response.data.subView) {
                        this.submission = parseInt(response.data.submissionId);
                    } else {
                        this.submission = response.data.submissionId;
                    }
                }
                if (
                    response.data.expensesId &&
                    response.data.expensesId != null
                ) {
                    if (response.data.expensesView) {
                        this.expenses = parseInt(response.data.expensesId);
                    } else {
                        this.expenses = response.data.expensesId;
                    }
                }
                if (
                    response.data.travellerId &&
                    response.data.travellerId != null
                ) {
                    if (response.data.travelView) {
                        this.travelPeople = parseInt(response.data.travellerId);
                    } else {
                        this.travelPeople = response.data.travellerId;
                    }
                }
                //获取关联单号，显示关联单号
                //是否借款赋值判断
                if (response.data.borrow != null) {
                    $self.getBorrowOdd(response.data.payeeId);
                }
                if (response.data.borrow == null) {
                    $self.formData.borrow.payAble = response.data.total;
                    $self.formData.borrow.upperSum = response.data.upper;
                }
                response.data.borrow =
                    response.data.borrow == null
                        ? this.formData.borrow
                        : response.data.borrow;
                for (let data of response.data.repayItems) {
                    data.min = data.bigTypeName.split(',');
                    data.currency = {
                        value: data.currency.curValue,
                        label: data.currency.label
                    };
                }
                $self.formData = response.data;
                $self.radioChange('bor');
                $self.formId = $self.formData.id;
                $self.dialogFormVisible = true;
                $self.createForm_status = false;
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
        },
        createForm() {
            this.getUsers();
            this.getOgans();
            this.getSubmissionlList();
            this.getTravelList();
            this.getExpenseslList();
            this.getClass();
            this.formData = this.resetForm();
            this.submission = '';
            this.travelPeople = '';
            this.expenses = '';
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
            this.getNo();
            //  this.getSubmissionlList();
            // this.getTravelList();
            // this.getSelectCascader();
        },
        //币种改变了都变
        handleChange(item, index, type) {
            for (let data of this.formData.repayItems) {
                data.currency = item.currency;
                data.estRate = item.estRate;
                data.noTax = 0;
                data.tax = 0;
            }
            if (type == 'currency') {
                if (item.currency.label == '人民币') {
                    item.estRate = 1;
                    this.loseFocus(item, index, 'money');
                } else {
                    item.estRate = this.common.toDecimal5(0);
                    item.estSum = this.common.toDecimal2(0);
                    this.loseFocus(item, index, 'money');
                }
            }
        },
        //报销列表预估本币金额和预估汇率的计算，然后再就是金额合计
        loseFocus(item, index, type, shui) {
            if (type == 'money') {
                for (let data of this.formData.repayItems) {
                    data.estRate = item.estRate;
                    if (data.money != '' && data.estRate != '') {
                        data.estSum = this.common.toDecimal2(
                            parseFloat(data.estRate) * parseFloat(data.money)
                        );
                    } else {
                        data.estSum = this.common.toDecimal2(0);
                    }
                    if (shui && shui == 'tax') {
                        item.noTax = this.common.toDecimal2(
                            parseFloat(item.estSum) - parseFloat(item.tax)
                        );
                    } else if (shui && shui == 'notax') {
                        item.tax = this.common.toDecimal2(
                            parseFloat(item.estSum) - parseFloat(item.noTax)
                        );
                    } else {
                        item.tax = this.common.toDecimal2(0);
                        item.noTax = this.common.toDecimal2(0);
                    }
                }
                this.totalSalary();
            }

            if (
                type == 'bearSum' &&
                item.bearSum != null &&
                item.bearSum != '' &&
                parseInt(this.formData.total) > 0
            ) {
                this.shareRadio();
            } else {
                item.shareRatio = this.common.toDecimal2(0);
                item.upper = this.common.DX(this.common.toDecimal2(0));
            }
        },
        //分摊情况下，根据输入的分摊金额计算分摊比例
        shareRadio() {
            if (parseInt(this.formData.total) > 0) {
                for (let data of this.formData.shares) {
                    data.upper = this.common.DX(
                        this.common.toDecimal2(data.bearSum)
                    ); //字符串
                    data.shareRatio = this.common.toDecimal2(
                        parseFloat(data.bearSum) /
                            parseFloat(this.formData.total) *
                            100
                    );
                }
            } else {
                for (let data of this.formData.shares) {
                    data.upper = this.common.DX(
                        this.common.toDecimal2(data.bearSum)
                    ); //字符串
                    data.shareRatio = this.common.toDecimal2(0);
                }
            }
        },
        //计算报销金额合计的方法
        totalSalary() {
            let sum = 0;
            for (let data of this.formData.repayItems) {
                if (data.money != '') {
                    sum += parseFloat(data.money);
                }
            }
            this.formData.total = this.common.toDecimal2(sum);
            this.formData.upper = this.common.DX(this.formData.total);
            this.changeTotal = this.common.toDecimal2(sum);
        },
        getExpenseslList() {
            const self = this;
            self.expensesSelections = [];
            if (cookies.get('uid')) {
                axios
                    .get(
                        '/api/v1/entertainmentExpense/listDone/' +
                            cookies.get('uid')
                    )
                    .then(res => {
                        if (res.data.content) {
                            for (let data of res.data.content) {
                                this.expensesSelections.push({
                                    id: data.id,
                                    number: data.number
                                });
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
        //部门呈报件改变
        expensesChange(val) {
            console.log(val);
            this.formData.expensesView = true;
            let boolean = false;
            for (let data of this.expensesSelections) {
                if (data.id == val) {
                    boolean = true;
                }
            }
            this.formData.expensesView = boolean;
        },
        //查看选择的部门呈报件（点击小眼睛）
        expensesDetail() {
            if (
                this.expenses &&
                this.expenses != null &&
                this.formData.expensesView
            ) {
                this.common.open('#/apps/expenses/' + this.expenses);
            }
        },
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            self.submissionSelections = [];
            if (cookies.get('uid')) {
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
        },
        //查看选择的部门呈报件（点击小眼睛）
        submissionDetail() {
            if (this.submission && this.submission != null && this.subView) {
                this.common.open('#/apps/submission/' + this.submission);
            }
        },
        //获取出差审批单的列表（只有国内报销有）
        getTravelList() {
            const self = this;
            if (cookies.get('uid')) {
                axios
                    .get('/api/v1/travel_forms/findDone/' + cookies.get('uid'))
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
        //出差审批单改变的时候获取对应信息，把出差人员数组传给singal接口
        travelChange(val) {
            if (val && val != '') {
                this.formData.travelView = true;
                let boolean = false;
                for (let data of this.travelSelections) {
                    if (data.id == val) {
                        boolean = true;
                    }
                }
                this.formData.travelView = boolean;
                this.formData.travellerId = val;
            }
        },
        //查看选择的出差审批单详情（点击出差审批单后的小眼睛可见）
        travelDetail() {
            if (
                this.travelPeople &&
                this.travelPeople != null &&
                this.travelView
            ) {
                this.common.open('#/apps/travel/' + this.travelPeople);
            }
        },
        //关联借款单号
        //选取的收款人发生变化时，调用该人所有关联的借款单子（getBorrowOdd）
        payeeChange(val) {
            //调获取id的接口；
            //获取单号的列表；
            //this.rows.payee = this.rows.payee.name;
            if (val != '多人') {
                for (let data of this.borrowPerson) {
                    if (data.id == val) {
                        this.formData.payee = data.name;
                    }
                }
                this.formData.payeeId = val;
                this.getBorrowOdd(val);
            } else {
                this.formData.payee = '多人';
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
        //关联借款单号发生变化，调用getBorrow接口获取该条单据的核销金额和未核销金额等数据
        borrowOddChange(val) {
            this.getBorrow(val);
        },
        //关联的借款单号改变，根据关联单号获取核销金额和未核销金额
        getBorrow(val) {
            const self = this;
            axios
                .get('/api/v1/expense_forms/findBorrow/' + val)
                .then(res => {
                    self.formData.borrow.borrowId = val;
                    self.formData.borrow.verify = res.data.verify;
                    self.formData.borrow.noVerify = res.data.noVerify;
                    self.formData.borrow.total = res.data.total;
                    self.radioChange('bor');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        //分摊按钮和是否借款按钮改变触发的方法
        radioChange(type) {
            if (type == 'bor') {
                if (!this.formData.borrow.bor) {
                    this.formData.borrow.payAble = this.formData.total;
                    this.formData.borrow.borrowOdd = '';
                    this.formData.borrow.borrowId = '';
                    this.formData.borrow.noVerify = 0;
                    this.formData.borrow.verify = 0;
                    this.formData.borrow.sendDack = false;
                    this.formData.borrow.shouldBack = this.common.toDecimal2(0);
                    this.formData.borrow.upperSum = this.common.DX(
                        this.formData.borrow.payAble
                    );
                } else {
                    this.borrowComputed();
                }
            } else if (type == 'sendDack') {
                this.radioChange('bor');
            }
        },
        //有借款单子的情况下计算应付金额和应退金额的值
        borrowComputed() {
            let compare =
                parseFloat(this.formData.total) -
                parseFloat(this.formData.borrow.noVerify);
            if (compare == 0) {
                this.formData.borrow.payAble = this.common.toDecimal2(0);
                this.formData.borrow.shouldBack = this.common.toDecimal2(0);
                this.formData.borrow.upperSum = this.common.DX(
                    this.formData.borrow.payAble
                );
            } else if (compare > 0) {
                this.formData.borrow.payAble = this.common.toDecimal2(compare);
                this.formData.borrow.shouldBack = this.common.toDecimal2(0);
                this.formData.borrow.upperSum = this.common.DX(
                    this.formData.borrow.payAble
                );
            } else if (compare < 0) {
                //if (this.rows.borrow.sendDack) {
                let compareSendBack =
                    parseFloat(this.formData.borrow.noVerify) -
                    parseFloat(this.formData.total);
                this.formData.borrow.payAble = this.common.toDecimal2(0);
                this.formData.borrow.shouldBack = this.common.toDecimal2(
                    compareSendBack
                );
                this.formData.borrow.upperSum = this.common.DX(
                    this.formData.borrow.shouldBack
                );
            }
        },
        //查看关联借款单号的详情（点击关联借款单号后面的小眼睛可见）
        borrowOddDetail() {
            if (
                this.formData.borrow.borrowId &&
                this.formData.borrow.borrowId != ''
            ) {
                this.common.open(
                    '#/apps/loan/' + this.formData.borrow.borrowId
                );
            }
        },
        resetForm() {
            let formData = {
                no: '',
                id: '',
                expensesView: true,
                expensesId: '',
                expensesName: '',
                subView: true,
                travelView: true,
                travellerId: '',
                travelName: '',
                budgetSure: false,
                submissionId: '',
                submissionName: '',
                creatorName: cookies.get('uname'),
                organName: cookies.get('oname'),
                created: moment().format('YYYY-MM-DD HH:mm:ss'),
                payee: '',
                payeeId: '',
                expenseId: cookies.get('oid'),
                bank: '',
                cardNo: '',
                clearing: '',
                depict: '',
                costItem: '',
                upper: '',
                expenseDep: this.$store.getters.LoginData.oname,
                share: false,
                total: this.common.toDecimal2(0),
                budget: {
                    est: false,
                    fundPlan: false
                },
                est: false,
                fundPlan: false,
                attachments: [],
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    total: 0,
                    borrowId: '',
                    verify: 0,
                    sendDack: true,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: [
                    {
                        bearUnit: '中关村发展集团',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: ''
                    }
                ],
                repayItems: [
                    {
                        min: [],
                        bigTypeName: '',
                        smallTypeName: '',
                        tax: 0,
                        noTax: 0,
                        currency: {
                            value: '￥',
                            label: '人民币'
                        },
                        money: '',
                        id: '',
                        estRate: 1,
                        estSum: this.common.toDecimal2(0)
                    }
                ],
                leaderadvice: '',
                leaderadvice1: ''
            };
            return formData;
        },
        saveFormValidate(type) {
            if (this.formData.expenseDep == '集团领导') {
                this.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else {
                if (
                    this.formData.payee != '' &&
                    this.formData.expenseDep != '' &&
                    this.formData.clearing != '' &&
                    this.checkBaoDetail() &&
                    this.formData.attachments.length > 0
                ) {
                    if (this.formData.share) {
                        if (this.checkFenDetail()) {
                            this.saveForm(type);
                        } else {
                            this.$message({
                                message: '请输入报销明细分摊必输项',
                                type: 'error'
                            });
                        }
                    } else {
                        this.saveForm(type);
                    }
                } else {
                    this.$message({
                        message: '请输入必填项',
                        type: 'error'
                    });
                }
            }

            // this.saveForm(type);
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            for (let data of this.formData.shares) {
                data.bearSum = parseFloat(data.bearSum);
                data.shareRatio = data.shareRatio;
                data.estSum = parseFloat(data.estSum);
            }
            for (let data of this.borrowOddSelections) {
                if (this.formData.borrow.borrowOdd == data.id) {
                    this.formData.borrow.borrowOdd = data.number;
                }
            }
            this.formData.borrow.payAble = parseFloat(
                this.formData.borrow.payAble
            );
            this.formData.borrow.shouldBack = parseFloat(
                this.formData.borrow.shouldBack
            );
            for (let data of this.formData.repayItems) {
                data.currency = {
                    curValue: data.currency.value,
                    label: data.currency.label
                };
            }
            this.formData.total = parseFloat(this.formData.total);
            this.formData.est = this.formData.budget.est;
            this.formData.fundPlan = this.formData.budget.fundPlan;
            const self = this;
            if (self.formData.created) {
                self.formData.created = moment(self.formData.created).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            } else {
                self.formData.created = moment(new Date()).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            }
            if (this.travelPeople != '') {
                this.formData.travellerId = this.travelPeople;
                for (let data of this.travelSelections) {
                    if (data.id == this.travelPeople) {
                        this.formData.travelName = data.number;
                    }
                }
                if (this.formData.travelView == false) {
                    this.formData.travelName = this.formData.travellerId;
                }
            }
            if (this.submission != '') {
                this.formData.submissionId = this.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.submission) {
                        this.formData.submissionName = data.submissionNo;
                    }
                }
                if (this.formData.subView == false) {
                    this.formData.submissionName = this.formData.submissionId;
                }
            }
            if (this.expenses != '') {
                this.formData.expensesId = this.expenses;
                for (let data of this.expensesSelections) {
                    if (data.id == this.expenses) {
                        this.formData.expensesName = data.number;
                    }
                }
                if (this.formData.expensesView == false) {
                    this.formData.expensesName = this.formData.expensesId;
                }
            }
            let response = await $self.saveFormData(
                '/api/v1/expense_forms/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = $self.dialogSelectCode = false;
                if (params) {
                    $self.msgTips('提交成功', 'success');
                    if (this.createForm_status) {
                        let data = await $self.startSignalForStart('reload');
                        if (data) {
                            $self.emitMessage();
                            $self.updateBorrow($self.formId);
                        }
                        //如果是 "新建提交" 启动工作流（调用两次）
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
                        $self.updateBorrow($self.formId);
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
        updateBorrow(formId) {
            if (this.formData.borrow.borrowId != '') {
                axios
                    .put(
                        '/api/v1/expense_forms/' +
                            formId +
                            '/updateBorrow/' +
                            this.formData.borrow.borrowId,
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
                            message: '更新借款金额失败',
                            type: 'error'
                        });
                    });
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
    },
    mounted() {
        this.getUsers();
        this.getOgans();
        // this.getTravelList();
        // this.getSubmissionlList();
    }
};
</script>
<style lang="scss">
#ReimbursementForm {
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
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
        .el-table--border.is-scrolling-left
        ~ .el-table__fixed {
        border-right: 1px solid #020819;
    }
    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #020819;
    }
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;

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
}
</style>