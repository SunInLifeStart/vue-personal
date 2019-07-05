<template>
    <div id="Conduct">
        <el-card class="box-card">
            <div id="ConductFilter">
                <el-form :inline="true" label-width="70px" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input placeholder="请输入提单人" v-model="formInline.creatorName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据编号">
                                <el-input placeholder=" 请输入单据编号 " v-model="formInline.numbers"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据类别">
                                <el-select v-model="formInline.dtype" clearable placeholder="请选择">
                                    <el-option v-for="item in options1" :key="item.index" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="费用承担部门">
                                <el-input v-model="formInline.organName" placeholder="费用承担部门"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8 ">
                            <el-form-item label="单据状态 ">
                                <el-select v-model="formInline.status " placeholder="请选择">
                                    <el-option v-for="item in statusOpertions " :key="item.value " :label="item.label " :value="item.value ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间">
                                <div>
                                    <el-date-picker style="width:100%" v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8 ">
                            <el-form-item class=" ">
                                <el-button type="primary " @click="searchList">查询</el-button>
                                <el-button @click="resetInput ">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="toolbar">
                <el-button type="primary" @click="excel()">导出</el-button>
            </div>
            <div id="ConductList">
                <el-table :data="tableData " stripe style="width: 100%; cursor:pointer " @row-click="showCurrentId" highlight-current-row>
                    <!--
                    <el-table-column type="selection" :reserve-selection="true"></el-table-column>-->
                    <el-table-column prop="uname" label="提单人" align="left" min-width="100">
                    </el-table-column>
                    <el-table-column prop="oname" label="公司部门" align="left" min-width="150">
                    </el-table-column>
                    <el-table-column prop="borrowDept" label="费用承担部门" align="left" min-width="150">
                    </el-table-column>
                    <el-table-column prop="numbers" label="单据编号" align="left" min-width="130">
                    </el-table-column>
                    <el-table-column prop="sum" label="金额" align="right" min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.sum |numFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="currency" label="币种" align="center" min-width="100">
                    </el-table-column>
                    <el-table-column prop="dtype" label="单据类别" align="left" min-width="110">
                    </el-table-column>
                    <el-table-column prop="type" label="审核状态" align="left">
                        <template slot-scope="scope">
                            {{scope.row.type | filterStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="created" label="提单时间" align="left" min-width="150">
                        <template slot-scope="scope">
                            {{scope.row.created | dateformat('YYYY-MM-DD HH:mm:ss')}}
                        </template>
                    </el-table-column>
                </el-table>
                <br />
                <el-pagination @size-change="sizeChange " @current-change="currentChange " :current-page="params.page " :page-sizes="[5, 10, 30, 50] " :page-size="params.pageSize " layout="total, sizes, prev, pager, next, jumper " :total="params.total "></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card ">
            <ExpensesDetail v-show="this.showExpenses" ref="ExpensesDetail" @reloadList="reloadList" @resetStatus="resetStatus"></ExpensesDetail>
            <PaymentDetail v-show="this.showPayment" ref="PaymentDetail" @reloadList="reloadList" @resetStatus="resetStatus"></PaymentDetail>
            <LoanDetail v-show="this.showLoan" ref="LoanDetail" @reloadList="reloadList" @resetStatus="resetStatus"></LoanDetail>
            <ReimbursementDetail v-show="this.showReimbursement" ref="ReimbursementDetail" @reloadList="reloadList" @resetStatus="resetStatus"></ReimbursementDetail>
            <TravelDetail v-show="this.showTravle" ref="TrainDetail" @reloadList="reloadList" @resetStatus="resetStatus"></TravelDetail>
            <!-- <GoodsDetail :formId="formId " ref="GoodsDetail " @reloadList="reloadList " @resetStatus="resetStatus "></GoodsDetail>-->
        </el-card>
    </div>
</template>
<script>
import { publicMethods } from '../application.js';
import moment from 'moment';
import LoanDetail from './LoanDetail';
import PaymentDetail from './PaymentDetail';
import TravelDetail from './TravelDetail';
import ReimbursementDetail from './ReimbursementDetail';
import ExpensesDetail from './ExpensesDetail';
import axios from 'axios';
export default {
    mixins: [publicMethods],
    name: 'Conduct',
    data() {
        return {
            tableData: [],
            tableDataAll: [],
            formDetails: {},
            formId: '',
            options1: [
                '全部',
                '招待费',
                '出差审批单',
                '费用报销单',
                '借款审批单',
                '付款申请单'
            ],
            statusOpertions: [
                {
                    value: '00',
                    label: '已保存'
                },
                {
                    value: '01',
                    label: '审核中'
                },
                {
                    value: '02',
                    label: '已驳回'
                },
                {
                    value: '04',
                    label: '已完成'
                }
            ],
            formInline: {
                creatorName: '',
                numbers: '',
                dtype: '全部',
                organName: '',
                status: '',
                created: []
            },
            params: {
                page: 1,
                pageSize: 5,
                options: [],
                orderBy: 'id',
                desc: true,
                bigType: '全部',
                total: 0
            },
            showLoan: false,
            showPayment: false,
            showExpenses: false,
            showReimbursement: false,
            showTravle: false,
            searchOptions: [],
            formName: 'motor-receive'
        };
    },
    filters: {
        filterStatus: function(data) {
            let xmlJson = {
                '00': '已保存',
                '01': '审核中',
                '02': '已驳回',
                '03': '已撤销',
                '04': '已完成'
            };
            return xmlJson[data];
        }
    },
    components: {
        LoanDetail,
        PaymentDetail,
        TravelDetail,
        ReimbursementDetail,
        ExpensesDetail
    },
    methods: {
        //导出
        excel() {
            const self = this;
            axios
                .post('/api/v1/reim/excel', JSON.stringify(this.tableDataAll), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.common.downloadExport(res.data);
                })
                .catch(function() {
                    self.$message({
                        message: '导出操作失败',
                        type: 'error'
                    });
                });
        },
        getFilter() {
            this.searchOptions = [];
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
                });
            }
            if (this.formInline.numbers.trim() !== '') {
                this.searchOptions.push({
                    field: 'numbers',
                    filter: 'LIKE',
                    value: this.formInline.numbers
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
                });
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.created[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            /** 
            this.searchOptions.push({
                field: 'status',
                filter: 'NOEQUAL',
                value: '已删除'
            });
            */
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            this.params.options = this.searchOptions;
        },
        //获取列表
        async getList(page) {
            this.showTravle = false;
            this.showLoan = false;
            this.showPayment = false;
            this.showExpenses = false;
            this.showReimbursement = false;
            let $self = this;
            this.getFilter();
            this.params.bigType = this.formInline.dtype;
            $self.url = '/api/v1/reim/stat';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    this.showDetailsPay(response.data.forms[0]);
                }
                $self.tableData = response.data.forms;
                $self.tableDataAll = response.data.form;
                $self.params.total = response.data.pageCount;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },
        async showDetailsPay(response) {
            let self = this;
            if (response.dtype && response.dtype != '') {
                if (response.dtype == '招待费') {
                    this.showExpenses = true;
                    self.$refs.ExpensesDetail.getFormDetails(response.id);
                } else if (response.dtype == '出差审批单') {
                    this.showTravle = true;
                    self.$refs.TravelDetail.getFormDetails(response.id);
                } else if (response.dtype == '费用报销单') {
                    this.showReimbursement = true;
                    self.$refs.ReimbursementDetail.getFormDetails(response.id);
                } else if (response.dtype == '借款审批单') {
                    this.showLoan = true;
                    self.$refs.LoanDetail.getFormDetails(response.id);
                } else if (response.dtype == '付款申请单') {
                    this.showPayment = true;
                    self.$refs.PaymentDetail.getFormDetails(response.id);
                }
            } else {
                self.msgTips('列表类型不存在', 'warning');
            }
        },
        //选择行
        showCurrentId(row) {
            this.showDetailsPay(row);
        },
        resetStatus(data) {},
        reloadList(params) {},
        reloadList() {},

        //分页
        currentChange(page) {
            this.params.page = page;
            this.getList(page);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.getList();
        },
        resetInput() {
            this.formInline.creatorName = this.formInline.organName = this.formInline.numbers =
                '';
            this.formInline.created = [];
            this.formInline.dtype = '全部';
            this.formInline.status = '';
            this.params.pege = 1;
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#Conduct {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
    }
    .el-select {
        width: 100%;
    }
    .card_margin_10 {
        margin-top: 10px;
    }
    .el-form-item--small.el-form-item {
        width: 100%;
    }
}
</style>
<style scoped>
#Conduct .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
</style>