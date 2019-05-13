<template>
    <el-dialog title="付款申请单" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="90%" style="text-align: center;">
        <div id="PaymentForm">
            <el-form :model='formData' ref="formData">
                <el-row style="margin-bottom:10px">
                    <el-col :span="7">
                        <el-form-item label="单据编号：">
                            {{formData.numericalOrder}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='出差申请单：' label-width="110px">
                            <el-select v-model="formData.travelId" filterable placeholder="选择出差申请单" allow-create @change="travelChange">
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.tra == 'true'">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="travelDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.tra!='true'">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label='呈报件：' label-width="110px">
                            <el-select style="min-width:240px" v-model="submission" filterable placeholder="选择呈报件" allow-create @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.sub=='true'">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.sub!='true'">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
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
                        <td colspan="8" class="fontBold">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            提单人
                        </td>
                        <td>
                            <el-input v-model="formData.applicantName" disabled></el-input>
                        </td>
                        <td class="fontBold">
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.organ" disabled></el-input>
                        </td>
                        <td class="fontBold">
                            提单时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="formData.applicantTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            <span class="span">*</span>
                            收款单位
                        </td>
                        <td>
                            <!--
                            <el-select v-model="formData.receiptUnit" style="width:100%" filterable>
                                <el-option v-for="item in organsList" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                            -->
                            <el-input v-model="formData.receiptUnit"></el-input>
                        </td>
                        <td class="fontBold">
                            <span class="span" v-show="this.showSpan">*</span>
                            开户行
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.openingLine"></el-input>
                        </td>
                        <td class="fontBold">
                            <span class="span" v-show="this.showSpan">*</span>
                            银行账号
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.bankNumber"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            <span class="span">*</span>
                            结算方式
                        </td>
                        <td>
                            <!-- <el-input v-model="selectItem.settlement"></el-input> -->
                            <el-select v-model="formData.settlement" placeholder="请选择" @change="changeSettlemnt">
                                <el-option v-for="item in clearing_method" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="fontBold">
                            <span class="span">*</span>
                            费用承担部门
                        </td>
                        <td colspan="2">
                            <el-select v-model="formData.costUnit" style="width:100%" filterable>
                                <el-option v-for="item in organs" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="fontBold">
                            分摊
                        </td>
                        <td colspan="2">
                            <template>
                                <el-radio v-model="formData.allocation" label="是">是</el-radio>
                                <el-radio v-model="formData.allocation" label="否">否</el-radio>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" class="fontBold">
                            付款明细
                        </td>
                    </tr>
                    <tr>
                        <td>
                            支出说明
                        </td>
                        <td colspan="4">
                            <el-input v-model="formData.paymentExplain"></el-input>
                        </td>
                        <td>
                            费用归属项目
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.project"></el-input>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td colspan="2">
                            <span class="span">*</span>
                            支出类别|明细</td>
                        <td>币种</td>
                        <td>
                            <span class="span">*</span>
                            金额</td>
                        <td>预估汇率</td>
                        <td>预估本币金额</td>
                        <td>
                            不含税价格
                        </td>
                        <td>
                            税金
                        </td>
                    </tr>
                    <tr v-for="(payItem,index) in this.formData.details" :key="payItem.index" @contextmenu.prevent="deleteItem(payItem,index,'payDetail')">
                        <td colspan="2">
                            <el-cascader :options="getclass" change-on-select filterable v-model="payItem.type" :props="{value:'name',label:'name'}">
                            </el-cascader>
                        </td>
                        <td>
                            <el-select v-model="payItem.currency" filterable @change="getDollar(payItem)">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="payItem.amount" type="number" @mousewheel.native.prevent @input="getAmount('payDetail',payItem)"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.rate" type="number" @mousewheel.native.prevent @input="getAmount('payDetail',payItem)"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.localAmount" disabled class="money"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.noTax" type="number" @mousewheel.native.prevent @input="getAmount('payDetail',payItem,'notax')"></el-input>
                        </td>
                        <td>
                            <el-input v-model="payItem.tax" type="number" @mousewheel.native.prevent @input="getAmount('payDetail',payItem,'tax')"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <el-button size="small" style="width:100%;" @click="addItem('payDetail')">插入</el-button>
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
                            <el-radio-group v-model="formData.capitalYes">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            <el-radio-group v-model="formData.budgetYes">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td>
                            <span class="span">*</span>
                            合同号
                        </td>
                        <td colspan="2">
                            <el-autocomplete class="inline-input" placeholder="若无合同请选“无”" v-model="formData.contract.numNo" :fetch-suggestions="querySearch1" :trigger-on-focus="true" @input="showSee()" @select="handleSelect('numNo')">
                                <template slot-scope="{ item }">
                                    <div style="color:green">{{ item.value=item.contractNum}}</div>
                                </template>
                            </el-autocomplete>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="contractNoDetail" :disabled="this.moneyType!='1'"></el-button>
                            </el-tooltip>
                        </td>
                        <td>
                            <span class="span">*</span>
                            合同名称
                        </td>
                        <td colspan="4">
                            <el-autocomplete class="inline-input" placeholder="若无合同请选“无”" style="width:100%" v-model="formData.contract.name" :fetch-suggestions="querySearch" :trigger-on-focus="true" @input="showSee()" @select="handleSelect('name')">
                                <template slot-scope="{ item }">
                                    <div style="color:green">{{ item.value=item.contractName }}</div>
                                </template>
                            </el-autocomplete>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td rowspan="3">
                            <span class="span">*</span>
                            合同金额
                        </td>
                        <td rowspan="3">
                            <el-input v-if="this.moneyType=='1'" v-model="formData.contract.amount" class="money" type="number" @mousewheel.native.prevent @input="getAmount('contractDetail')"></el-input>
                            <el-input v-else v-model="formData.contract.amount" class="money"></el-input>
                        </td>
                        <td rowspan="3">
                            前期已付
                        </td>
                        <td>
                            <span class="span">*</span>
                            累计已付款
                        </td>
                        <td>
                            <el-input v-if="this.moneyType=='1'" v-model="formData.contract.payments" class="money" type="number" @mousewheel.native.prevent @input="getAmount('contractDetail')"></el-input>
                            <el-input v-else @mousewheel.native.prevent v-model="formData.contract.payments" type="number" class="money"></el-input>
                        </td>
                        <td rowspan="3">
                            <span class="span">*</span>
                            未付金额
                        </td>
                        <td colspan="2" rowspan="3">
                            <el-input v-if="this.moneyType=='1'" v-model="formData.contract.unAmount" disabled class="money"></el-input>
                            <el-input v-else v-model="formData.contract.unAmount" class="money"></el-input>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td>
                            <span class="span">*</span>
                            累计付款比例（%）</td>
                        <td>
                            <el-input v-if="this.moneyType=='1'" type="number" @mousewheel.native.prevent v-model="formData.contract.cumulativeProShow" disabled class="money"></el-input>
                            <el-input v-else @mousewheel.native.prevent type="number" v-model="formData.contract.cumulativeProShow" class="money" @input="getReal()"></el-input>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td>
                            <span class="span">*</span>
                            本次付款后累计支付比例（%）</td>
                        <td>
                            <el-input v-if="this.moneyType=='1'" @mousewheel.native.prevent type="number" v-model="formData.contract.cumulativeAfterShow" disabled class="money"></el-input>
                            <el-input v-else @mousewheel.native.prevent type="number" v-model="formData.contract.cumulativeAfterShow" class="money" @input="getReal()"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">
                            支付金额
                        </td>
                        <td>
                            <!-- <el-input v-model="selectItem.contract.payAmount" disabled></el-input> -->
                            <el-row>
                                <el-col :span="8" align="left">{{formData.contract.symbol}}</el-col>
                                <el-col :span="16" align="right">{{formData.contract.payAmount | numFilter}}</el-col>
                            </el-row>
                        </td>
                        <td class="fontBold">
                            金额大写
                        </td>
                        <td colspan="4">
                            （{{this.formData.details.length > 0 ? this.formData.details[0].currency : '人民币'}}：&nbsp;&nbsp;&nbsp;{{formData.contract.amountCap}}&nbsp;&nbsp;&nbsp;）
                        </td>
                    </tr>

                    <tr v-show="formData.allocation == '是'" class="fontBold">
                        <td colspan="8">分摊明细（基本信息分摊选择是）</td>
                    </tr>
                    <tr v-show="formData.allocation == '是'" class="fontBold">
                        <td colspan="2">承担单位</td>
                        <td>
                            <span class="span">*</span>
                            承担部门</td>
                        <td>支出项目</td>
                        <td>
                            <span class="span">*</span>
                            承担金额（{{this.formData.contract.symbol}}）</td>
                        <td colspan="2">金额大写({{this.formData.details.length > 0 ? this.formData.details[0].currency : '人民币'}})</td>
                        <td>分摊比例（%）</td>
                    </tr>
                    <tr v-show="formData.allocation == '是'" v-for="(shareItem,index) in this.formData.allocationDetails" :key="shareItem.index" @contextmenu.prevent="deleteItem(shareItem,index,'shareDetail')">
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
                            <el-input v-model="shareItem.amount" type="number" @mousewheel.native.prevent class="money" @input="getAmount('shareDetail',shareItem)"></el-input>
                        </td>
                        <td colspan="2">
                            <el-input v-model="shareItem.amountCap" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="shareItem.proportion" disabled></el-input>
                        </td>
                    </tr>
                    <tr v-show="formData.allocation == '是'">
                        <td colspan="8">
                            <el-button size="small" style="width:100%;" @click="addItem('shareDetail')">插入</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fontBold">
                            <el-upload name="files" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span class="span">*</span>
                                <span style="color:#06940c">附件上传
                                    <i class="el-icon-plus"></i>
                                </span>
                            </el-upload>
                        </td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="(item,index) in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments,'/api/v1/payment_forms/deleteAtt/' + item.id,'get')"></FilesOperate>
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
import { truncate } from 'fs';
export default {
    mixins: [publicMethods],
    name: 'PaymentForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            showSpan: false,
            currentRoles: [],
            branchCode: '',
            isMoney: '',
            moneyType: '2',
            clearing_method: [
                '网银',
                '电汇',
                '现金支票',
                '转账支票',
                '信汇',
                '现金',
                '存单',
                '网上托收'
            ],
            travelSelections: [],
            submission: '',
            submissionSelections: [],
            organs: [],
            restaurants: [],
            dollar: '￥', //币符
            prop: {
                value: 'code',
                label: 'name',
                children: 'children'
            },
            addxtnht: false, //判断是否为系统内合同（true：是 ， false: 否）
            selectContract: {
                creatorId: cookies.get('uid'),
                creatorName: cookies.get('uname'),
                organId: cookies.get('oid'),
                organName: cookies.get('oname')
            },
            dialogFormVisible: false,
            formData: this.resetForm(),
            appFlowName: 'payment-form_payment',
            options: [
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
    mounted() {},
    methods: {
        changeSettlemnt() {
            this.showSspan();
        },
        showSspan() {
            this.showSpan = false;
            this.showSpan =
                this.formData.settlement == '网上托收' ||
                this.formData.settlement == '现金支票' ||
                this.formData.settlement == '转账支票'
                    ? true
                    : false;
            return this.showSpan;
        },
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
                    response.push({
                        id: 565655656565,
                        name: '支出土地保证金(土地款)',
                        children: null
                    });
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
        getNum() {
            const self = this;
            let params = {
                code: 'payment_forms'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.numericalOrder =
                        res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        //获得费用承担部门
        getOrgan() {
            axios.get('/api/v1/users/list/organss').then(res => {
                this.organs = [];
                for (let data of res.data) {
                    this.organs.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.organs = res.data;
            });
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
        //根据uid获取列表
        getTravelList() {
            const self = this;
            if (cookies.get('uid') != '') {
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
        //选择出差人员改变
        travelChange(val) {
            if (val && val != '') {
                const self = this;
                this.formData.tra = 'true';
                let boolean = 'false';
                for (let item of this.travelSelections) {
                    if (item.id == this.formData.travelId) {
                        this.formData.travelCode = item.number;
                        boolean = 'true';
                    }
                }
                this.formData.tra = boolean;
                if (boolean == 'false') {
                    this.formData.travelId = val;
                    this.formData.travelCode = val;
                }
            }
        },
        //查看借款单详情
        travelDetail() {
            if (this.formData.travelId && this.formData.travelId != null) {
                this.common.open('#/apps/travel/' + this.formData.travelId);
            }
        },
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
            this.formData.sub = 'true';
            let boolean = 'false';
            for (let data of this.submissionSelections) {
                if (data.id == val) {
                    boolean = 'true';
                    this.formData.submissionId = this.submission;
                    this.formData.submissionName = data.submissionNo;
                }
            }
            this.formData.sub = boolean;
            if (boolean == 'false') {
                this.formData.submissionId = '';
                this.formData.submissionName = val;
            }
        },
        submissionDetail() {
            if (this.submission && this.submission != null) {
                this.common.open('#/apps/submission/' + this.submission);
            }
        },
        getDollar(type) {
            for (let index of this.formData.details) {
                index.currency = type.currency;
                // index.estimateRate = type.estimateRate;
            }
            for (let item of this.options) {
                if (item.label == type.currency) {
                    this.formData.contract.symbol = item.value;
                }
            }
        },
        contractNoDetail() {
            if (
                this.formData.contract.contractId &&
                this.formData.contract.contractId != ''
            ) {
                this.common.open(
                    '#/apps/contract/' + this.formData.contract.contractId
                );
            }
        },
        //获得真实值
        getReal() {
            if (this.moneyType != '1') {
                this.formData.contract.cumulativePro = this.formData.contract.cumulativeProShow;
                this.formData.contract.cumulativeAfter = this.formData.contract.cumulativeAfterShow;
            } else {
                this.formData.contract.cumulativePro = this.common.toDecimal5(
                    this.formData.contract.cumulativeProShow / 100
                );
                this.formData.contract.cumulativeAfter = this.common.toDecimal5(
                    this.formData.contract.cumulativeAfterShow / 100
                );
            }
        },
        //计算预估本币金额,未付款，累计付款比例,分摊比例,本次付款后累计支付比例
        getAmount(type, Item, shui) {
            if (type == 'payDetail') {
                for (let index of this.formData.details) {
                    index.rate = Item.rate;
                    if (index.amount && index.rate) {
                        index.localAmount = this.common.toDecimal2(
                            index.amount * index.rate
                        );
                    } else {
                        index.localAmount = 0;
                    }
                    if (shui && shui == 'tax') {
                        Item.noTax =
                            parseFloat(Item.localAmount) - parseFloat(Item.tax);
                    } else if (shui && shui == 'notax') {
                        Item.tax =
                            parseFloat(Item.localAmount) -
                            parseFloat(Item.noTax);
                    } else {
                        Item.tax = this.common.toDecimal2(0);
                        Item.noTax = this.common.toDecimal2(0);
                    }
                }
                this.totalPayment();
            }
            if (type == 'contractDetail') {
                if (
                    this.formData.contract.amount != 0 &&
                    this.moneyType == '1'
                ) {
                    if (
                        this.formData.contract.amount &&
                        this.formData.contract.payments
                    ) {
                        this.formData.contract.cumulativePro = this.common.toDecimal5(
                            this.formData.contract.payments /
                                this.formData.contract.amount
                        );
                        this.formData.contract.cumulativeProShow = this.common.toDecimal2(
                            this.formData.contract.cumulativePro * 100
                        );
                        this.formData.contract.unAmount =
                            this.formData.contract.amount -
                            this.formData.contract.payments;
                    } else {
                        this.formData.contract.cumulativePro = '0.0';
                        this.formData.contract.cumulativeProShow = '0.0';
                        this.formData.contract.unAmount = this.formData.contract.amount;
                    }
                } else if (this.moneyType == '2') {
                    this.formData.contract.cumulativePro = '0.0';
                    this.formData.contract.cumulativeProShow = '0.0';
                    this.formData.contract.cumulativeAfter = '0.0';
                    this.formData.contract.cumulativeAfterShow = '0.0';
                    this.formData.contract.unAmount = '0.0';
                } else {
                    this.formData.contract.cumulativePro = '0.0';
                    this.formData.contract.cumulativeProShow = '0.0';
                    this.formData.contract.cumulativeAfter = '0.0';
                    this.formData.contract.cumulativeAfterShow = '0.0';
                    this.formData.contract.unAmount = this.formData.contract.amount;
                }
            }
            if (type == 'shareDetail') {
                let shareSum = 0;
                for (let data of this.formData.allocationDetails) {
                    if (data.amount) {
                        shareSum += parseFloat(data.amount);
                    }
                }
                let allSum = parseFloat(this.formData.contract.payAmount);
                for (let data2 of this.formData.allocationDetails) {
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
            if (this.formData.contract.amount != 0 && this.moneyType == '1') {
                if (
                    this.formData.contract.amount &&
                    this.formData.contract.payments &&
                    this.formData.contract.payAmount
                ) {
                    const fenzi =
                        parseFloat(this.formData.contract.payments) +
                        parseFloat(this.formData.contract.payAmount);
                    this.formData.contract.cumulativeAfter = this.common.toDecimal5(
                        fenzi / this.formData.contract.amount
                    );
                    this.formData.contract.cumulativeAfterShow = this.common.toDecimal2(
                        this.formData.contract.cumulativeAfter * 100
                    );
                } else if (
                    this.formData.contract.amount &&
                    this.formData.contract.payAmount
                ) {
                    this.formData.contract.cumulativeAfter = this.common.toDecimal5(
                        this.formData.contract.payAmount /
                            this.formData.contract.amount
                    )
                        ? this.common.toDecimal5(
                              this.formData.contract.payAmount /
                                  this.formData.contract.amount
                          )
                        : '0.0';
                    this.formData.contract.cumulativeAfterShow = this.common.toDecimal2(
                        this.formData.contract.cumulativeAfter * 100
                    );
                } else {
                    this.formData.contract.cumulativeAfter = this.formData.contract.cumulativePro;
                    this.formData.contract.cumulativeAfterShow = this.formData.contract.cumulativeProShow;
                }
            }
        },
        //支付金额计算
        totalPayment() {
            let sum = 0;
            for (let data of this.formData.details) {
                sum += parseFloat(data.amount);
            }
            this.formData.contract.payAmount = this.common.toDecimal2(sum);
            this.formData.contract.amountCap = this.common.DX(sum);
            if (this.formData.allocationDetails[0].amount) {
                this.getAmount('shareDetail');
            }
        },
        //根据合同号查询累计已付款金额
        getTotal() {
            const self = this;
            if (this.formData.contract.contractId.toString() != '00000') {
                const params = {
                    numNo: this.formData.contract.contractId.toString()
                };
                axios
                    .post(
                        '/api/v1/payment_forms/total',
                        JSON.stringify(params),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        this.formData.contract.payments = res.data;
                        this.getAmount('contractDetail');
                    })
                    .catch(function() {
                        self.$message({
                            message: '未查询到已付款金额',
                            type: 'error'
                        });
                    });
            } else {
                this.getAmount('contractDetail');
            }
        },
        showSee() {
            this.moneyType = '2';
            this.formData.contract.contractId = '';
            this.addxtnht = false;
        },
        handleSelect(type) {
            this.formData.contract.contractId = '';
            if (type == 'numNo') {
                for (let item of this.restaurants) {
                    if (item.contractNum == this.formData.contract.numNo) {
                        this.moneyType = item.type;
                        this.formData.contract.contractId = item.id;
                        this.formData.contract.name = item.contractName;
                        this.formData.contract.amount = item.contractAmount;
                        this.isMoney = item.contractAmount;
                    }
                }
            }
            if (type == 'name') {
                for (let item of this.restaurants) {
                    if (item.contractName == this.formData.contract.name) {
                        this.moneyType = item.type;
                        this.formData.contract.contractId = item.id;
                        this.formData.contract.amount = item.contractAmount;
                        this.isMoney = item.contractAmount;
                        if (item.contractNum) {
                            this.formData.contract.numNo = item.contractNum;
                        } else {
                            this.formData.contract.numNo = String(item.id);
                        }
                    }
                }
            }
            this.getTotal();
        },
        setDataFromParent(data) {
            const self = this;
            this.submission = '';
            this.formData.travelId = '';
            this.formData.tra = '';
            this.formData.sub = '';
            this.getOrgan();
            this.loadAll();
            this.getClass();
            this.getTravelList();
            this.getSubmissionlList();
            for (let data of data.details) {
                data.type = data.bigType.split(',');
            }
            this.formData = data;
            if (self.formData.tra == 'true') {
                this.formData.travelId =
                    data.travelId == null || data.travelId == ''
                        ? ''
                        : parseInt(data.travelId);
            } else {
                this.formData.travelId =
                    data.travelId == null || data.travelId == ''
                        ? ''
                        : data.travelId;
            }
            if (self.formData.sub == 'true') {
                this.submission =
                    data.submissionId == null || data.submissionId == ''
                        ? ''
                        : parseInt(data.submissionId);
            } else {
                this.submission =
                    data.submissionName == null || data.submissionId == ''
                        ? ''
                        : data.submissionName;
            }
            this.moneyType = this.formData.contract.orAmount;
            if (this.formData.contract.orAmount == '2') {
                this.formData.contract.cumulativeAfterShow = this.formData.contract.cumulativeAfter;
                this.formData.contract.cumulativeProShow = this.formData.contract.cumulativePro;
            } else {
                this.formData.contract.cumulativeAfterShow = this.common.toDecimal2(
                    this.formData.contract.cumulativeAfter * 100
                );
                this.formData.contract.cumulativeProShow = this.common.toDecimal2(
                    this.formData.contract.cumulativePro * 100
                );
            }
            this.showSspan();
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        //获得已完成的合同编号
        loadAll() {
            const self = this;
            axios
                .post(
                    '/api/v1/contract_forms/queryForPayment?uid=' +
                        cookies.get('uid'),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.restaurants = res.data;
                    let wuItem = {
                        contractAmount: 0.0,
                        contractName: '无',
                        contractNum: '无',
                        id: '00000',
                        type: 2
                    };
                    let indexItem;
                    this.restaurants.forEach(function(item, index) {
                        if (
                            item.contractName == '无' &&
                            item.contractNum == '无'
                        ) {
                            wuItem = item;
                            indexItem = index;
                        }
                    });
                    if (indexItem) {
                        this.restaurants.splice(indexItem, 1);
                    }
                    this.restaurants.splice(0, 0, wuItem);
                })
                .catch(function() {
                    self.$message({
                        message: '合同列表获取失败',
                        type: 'error'
                    });
                });

            return;
        },
        checkPayDetail() {
            let paydetail = true;
            for (let data of this.formData.details) {
                if (!data.type[0] || data.rate == '' || data.amount == '') {
                    paydetail = false;
                }
            }
            return paydetail;
        },
        addItem(type) {
            const self = this;
            if (type == 'payDetail') {
                if (this.checkPayDetail()) {
                    this.formData.details.push({
                        currency:
                            this.formData.details.length == 0
                                ? '人民币'
                                : this.formData.details[0].currency,
                        rate:
                            this.formData.details.length == 0
                                ? '1'
                                : this.formData.details[0].rate,
                        localAmount: 0,
                        amount: 0,
                        type: [],
                        noTax: 0,
                        tax: 0,
                        bigType: ''
                    });
                } else {
                    self.$message({
                        message: '请输入付款明细',
                        type: 'error'
                    });
                }
            }
            if (type == 'shareDetail') {
                this.formData.allocationDetails.push({
                    organ: '',
                    proportion: '0',
                    project: '',
                    amount: '0',
                    amountCap: '',
                    unit: ''
                });
            }
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'payDetail') {
                    if (item.id) {
                        axios
                            .get('/api/v1/payment_forms/delDetails/' + item.id)
                            .then(res => {
                                this.formData.details.splice(index, 1);
                                this.totalPayment();
                                if (this.formData.details.length == 0) {
                                    this.formData.contract.symbol = '￥';
                                }
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    } else {
                        this.formData.details.splice(index, 1);
                        this.totalPayment();
                        if (this.formData.details.length == 0) {
                            this.formData.contract.symbol = '￥';
                        }
                    }
                }
                if (type == 'shareDetail') {
                    if (item.id) {
                        axios
                            .get(
                                '/api/v1/payment_forms/delAllDetails/' + item.id
                            )
                            .then(res => {
                                this.formData.allocationDetails.splice(
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
                        this.formData.allocationDetails.splice(index, 1);
                    }
                }
            });
        },
        createForm() {
            this.submission = '';
            this.loadAll();
            this.getOrgan();
            this.getClass();
            this.getTravelList();
            this.getSubmissionlList();
            this.formData = this.resetForm();
            this.getNum();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        resetForm() {
            let formData = {
                travelId: '', //选择的出差申请单
                type: '',
                paymentExplain: '',
                project: '',
                tra: 'true',
                sub: 'true',
                capitalYes: true,
                budgetYes: true,
                beyondContract: false,
                landExpense: false,
                openingLine: '',
                bankNumber: '',
                beyondMoney: false,
                settlement: '',
                receiptUnit: '',
                numericalOrder: '', //流水号
                allocation: '否', //分摊
                organ: cookies.get('oname'),
                costUnit: cookies.get('oname'),
                applicantName: cookies.get('uname'),
                applicantTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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
                        type: [],
                        noTax: 0,
                        tax: 0
                    }
                ],
                contract: {
                    numNo: '',
                    contractId: '',
                    name: '',
                    payments: 0.0,
                    amount: '0',
                    unAmount: '0.0',
                    symbol: '￥',
                    cumulativePro: '0.0',
                    cumulativeAfter: '0.0',
                    cumulativeProShow: '0.0',
                    cumulativeAfterShow: '0.0'
                }, //合同信息
                allocationDetails: [
                    {
                        organ: '',
                        proportion: '0',
                        project: '',
                        amount: '0',
                        amountCap: '',
                        unit: ''
                    }
                ], //分摊明细
                attachments: [] //附件
            };
            this.moneyType = '2';
            this.submission = '';
            return formData;
        },
        saveContract() {
            const self = this;
            this.selectContract.contractName = this.formData.contract.name;
            this.selectContract.contractNum = this.formData.contract.numNo;
            this.selectContract.contractAmount = this.formData.contract.amount;
            this.selectContract.inOutSys = '系统外合同';
            this.selectContract.type = '2';
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
                    this.formData.contract.contractId = res.data.id;
                    this.addxtnht = false;
                })
                .catch(function() {
                    self.$message({
                        message: '系统外合同保存失败',
                        type: 'error'
                    });
                });
        },
        compareBank() {
            const self = this;
            if (this.showSpan) {
                if (
                    this.formData.openingLine == '' ||
                    this.formData.bankNumber == ''
                ) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        saveFormValidate(type) {
            const self = this;
            this.formData.contract.orAmount = this.moneyType
                ? this.moneyType
                : '2';
            for (let item of this.restaurants) {
                if (
                    (item.contractNum == this.formData.contract.numNo ||
                        item.id == this.formData.contract.numNo) &&
                    item.contractName == this.formData.contract.name
                ) {
                    this.formData.contract.contractId = item.id;
                    this.formData.contract.orAmount = item.type
                        ? item.type
                        : '2';
                    this.addxtnht = true;
                }
            }
            if (this.formData.costUnit == '集团领导') {
                self.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else {
                if (
                    this.formData.receiptUnit == '' ||
                    this.formData.settlement == '' ||
                    this.formData.costUnit == '' ||
                    this.formData.contract.numNo == '' ||
                    this.formData.contract.name == '' ||
                    this.checkPayDetail() == false ||
                    this.formData.attachments.length <= 0 ||
                    this.compareBank() == false
                ) {
                    self.$message({
                        message: '请输入必填项',
                        type: 'error'
                    });
                } else {
                    if (this.addxtnht == false && type) {
                        this.$confirm(
                            '合同信息为系统外合同,是否添加?',
                            '提示',
                            {
                                type: 'warning'
                            }
                        ).then(() => {
                            this.saveForm(type);
                        });
                    } else {
                        this.saveForm(type);
                    }
                }
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
            let boolean = false;
            for (let data of this.formData.details) {
                if (data.type[0] == '支出土地保证金(土地款)') {
                    boolean = true;
                }
            }
            this.formData.landExpense = boolean;
            if (parseFloat(this.formData.contract.cumulativeAfterShow) > 1) {
                this.formData.beyondContract = true;
            } else {
                this.formData.beyondContract = false;
            }
            if (parseFloat(this.formData.contract.payAmount) > 10000000) {
                this.formData.beyondMoney = true;
            } else {
                this.formData.beyondMoney = false;
            }
            if ($self.formData.applicantTime) {
                $self.formData.applicantTime = moment(
                    $self.formData.applicantTime
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                $self.formData.applicantTime = '';
            }
            for (let data of this.formData.details) {
                data.bigType = data.type.join(',');
            }
            let response = await $self.saveFormData(
                '/api/v1/payment_forms/save',
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
                            if (!this.addxtnht) {
                                this.saveContract();
                            }
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
                        $self.emitMessage();
                        if (!this.addxtnht) {
                            this.saveContract();
                        }
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    this.addxtnht = false;
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
#PaymentForm {
    .span {
        color: red;
    }
    .hehe {
        color: red;
    }
    .fontBold {
        font-weight: bold;
    }
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
    .upload {
        position: relative;
        margin-right: 30px;
        // width: 100px;
        display: inline-block;
        cursor: pointer;
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