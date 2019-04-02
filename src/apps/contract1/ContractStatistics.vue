<template>
    <div id="ContractStatistics">
        <el-card>
            <el-row :gutter="12">
                <el-col>
                    <el-form :model="formInline" ref="formInline" label-width="120px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="合同名称：">
                                    <el-input v-model="formInline.contractName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同相对方：">
                                    <el-input v-model="formInline.partyB"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同类型：">
                                    <el-select v-model="formInline.contractType" placeholder="请选择" style="width:100%">
                                        <el-option v-for="item in contractTypes" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="承办部门：">
                                    <el-input v-model="formInline.hostDept"></el-input>
                                    <!-- <el-select v-model="formInline.hostDept" placeholder="请选择" style="width:100%">
                                        <el-option label="部门1" value="部门1"></el-option>
                                        <el-option label="部门2" value="部门2"></el-option>
                                        <el-option label="部门3" value="bm3"></el-option>
                                        <el-option label="部门4" value="bm4"></el-option>
                                        <el-option label="部门5" value="bm5"></el-option>
                                    </el-select> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="单据状态：">
                                    <el-select v-model="formInline.status" placeholder="请选择" style="width:100%">
                                        <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="创建时间：">
                                    <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="年份：" v-show="false">
                                    <el-date-picker v-model="formInline.contractPeriodStart" type="year" placeholder="选择日期" value-format="yyyy">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" align="center">
                                <el-form-item style="margin-right:110px">
                                    <el-button type="primary" @click="onSubmit(formInline)" size="small">统计</el-button>
                                    <el-button @click="exportTable()" size="small">导出</el-button>
                                    <el-button v-on:click="resetQuery()" size="small">重置</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <!-- 表格 -->
                    <el-table ref="form" :data="tableData" stripe @row-click="clickTableRow" :highlight-current-row='true'>
                        <el-table-column property="contractName" label="合同名称" min-width="200px">
                        </el-table-column>
                        <el-table-column property="contractNum" label="合同编号" min-width="200px" sortable>
                        </el-table-column>
                        <el-table-column property="contractType" label="合同类别" min-width="200px" sortable>
                        </el-table-column>
                        <el-table-column property="hostDept" label="承办部门" min-width="200px" sortable>
                        </el-table-column>
                        <el-table-column property="manager" label="经办人" min-width="90px">
                        </el-table-column>
                        <el-table-column property="partyB" label="合同相对方" min-width="150px">
                        </el-table-column>
                        <el-table-column property="created" label="发起时间" min-width="220px" sortable>
                            <template slot-scope="scope">
                                {{scope.row.created | dateformat}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="box-card" style="margin-top:10px">
            <ContractDetailt :formId="formId" ref="ContractDetail"></ContractDetailt>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import ContractDetailt from './ContractDetailt';
import { CONFIG } from '../data.js';
export default {
    name: 'ContractStatistics',
    data() {
        return {
            statusAll: CONFIG['status'],
            tableData: [],
            contractTypes: [
                {
                    id: '投',
                    name: '投资类'
                },
                {
                    id: '采',
                    name: '采购类'
                },
                {
                    id: '售',
                    name: '销售类'
                },
                {
                    id: '服',
                    name: '服务咨询类'
                },
                {
                    id: '金',
                    name: '金融类'
                },
                {
                    id: '建',
                    name: '建设类'
                },
                {
                    id: '物',
                    name: '物业类'
                },
                {
                    id: '合',
                    name: '其他类'
                },
                {
                    id: '人',
                    name: '人力资源类'
                },
                {
                    id: '密',
                    name: '保密类'
                }
            ],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            searchOptions: [],
            dialogDisabled: false,
            dateRange: [],
            selectOrg: '',
            activeName: 'first',

            formInline: {
                contractNum: '',
                contractName: '',
                partyB: '',
                contractType: '',
                hostDept: '',
                status: '',
                created: [],
                contractPeriodStart: ''
            },
            isShowChart: false
        };
    },
    props: ['formId'],
    components: {
        ContractDetailt
    },
    mounted() {
        this.getList();
    },
    computed: {},
    methods: {
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'id',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/contract_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '查询列表操作失败',
                        type: 'error'
                    });
                });
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.contractNum.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractNum',
                    filter: 'LIKE',
                    value: this.formInline.contractNum
                });
            }
            if (this.formInline.contractName.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractName',
                    filter: 'LIKE',
                    value: this.formInline.contractName
                });
            }
            if (this.formInline.partyB.trim() !== '') {
                this.searchOptions.push({
                    field: 'partyB',
                    filter: 'LIKE',
                    value: this.formInline.partyB
                });
            }
            if (this.formInline.contractType.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractType',
                    filter: 'LIKE',
                    value: this.formInline.contractType
                });
            }
            if (this.formInline.hostDept.trim() !== '') {
                this.searchOptions.push({
                    field: 'hostDept',
                    filter: 'LIKE',
                    value: this.formInline.hostDept
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
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
            if (this.formInline.contractPeriodStart.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractPeriodStart',
                    filter: 'LIKE',
                    // value: this.formInline.contractPeriodStart
                    value: moment(this.formInline.contractPeriodStart).format(
                        'YYYY'
                    )
                });
            }
            this.getList();
        },
        handleNodeClick(data, node) {
            this.selectOrg = node.data.label;
        },
        resetQuery() {
            this.formInline.contractNum = '';
            this.formInline.contractName = '';
            this.formInline.partyB = '';
            this.formInline.contractType = '';
            this.formInline.hostDept = '';
            this.formInline.status = '';
            this.formInline.created = [];
            this.formInline.contractPeriodStart = '';
            this.onSubmit();
        },
        exportTable() {
            this.onSubmit();
            const contractName = this.formInline.contractName ? this.formInline.contractName : '';
            const partb = this.formInline.partyB ? this.formInline.partyB : '';
            const contractType = this.formInline.contractType ? this.formInline.contractType : '';
            const hostDept = this.formInline.hostDept ? this.formInline.hostDept : '';
            const contractStatus = this.formInline.status ? this.formInline.status : '';
            const created1 = this.formInline.created[0] ? moment(this.formInline.created[0]).format('YYYY-MM-DD 00:00:00') : '';
            const created2 = this.formInline.created[1] ? moment(this.formInline.created[1]).format('YYYY-MM-DD 23:59:59') : '';
            const comntractNum = this.formInline.comntractNum ? this.formInline.comntractNum : '';
            const manager = this.formInline.manager ? this.formInline.manager : '';
            const url =
                '/api/v1/contract_forms/export?created1=' +
                created1 +
                '&created2=' +
                created2 +
                '&contractName=' +
                contractName +
                '&comntractNum=' +
                comntractNum +
                '&contractType=' +
                contractType +
                '&hostDept=' +
                partb +
                '&manager=' +
                manager +
                '&partb=' +
                partb +
                '&contractStatus=' +
                contractStatus;
                console.log(url)
            this.common.downloadExport(url);
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        }
    }
};
</script>
<style lang="scss">
</style>