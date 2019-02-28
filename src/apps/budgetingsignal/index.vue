<template>
    <div id="budgetingsignal">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="关联月度资金计划：">
                <el-input v-model="formInline.year"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- <div style="text-align:right"> -->
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <router-link to="/apps/budgeting">
                    <el-button style="text-align:right">返回</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <div class="toolbar">
            <el-button type="primary" @click="saveForm">保存</el-button>
            <el-button type="primary" @click="saveForm('save')">提交生成</el-button>
            <el-button type="primary" @click="getCode()">导出</el-button>
            <el-button type="primary">打印</el-button>
        </div>
        <el-table :data="formInline.tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow" :highlight-current-row='true' class="lista">
            <el-table-column type="selection" label="全选" width="55">
            </el-table-column>
            <el-table-column prop="budgetProject" label="预算项" min-width="180"></el-table-column>
            <el-table-column prop="budgetSum" label="资金预算总额" min-width="180"></el-table-column>
            <el-table-column prop="reimSum" label="报销执行总额" min-width="180"></el-table-column>
            <el-table-column prop="executeSum" label="实际执行总额" min-width="180">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.executeSum"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="implementationRate" label="执行率" min-width="180"></el-table-column>
            <el-table-column prop="remark" label="备注/执行差异说明" min-width="180">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>

    </div>
</template>

<script>
import axios from 'axios';
import { YUSUAN } from '../data.js';
import cookies from 'js-cookie'
import moment from "moment";
export default {
    name: 'budgetingsignal',
    data() {
        return {
            formInline: {
                year: moment(new Date()).format("YYYY"),
                tableData: YUSUAN['zhixingList'],
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            costUnit: '',
            organs: []
        };
    },
    components: {},
    props: ['formId', 'operationType'],
    mounted() {
        this.getOrgan();
    },
    methods: {
        //获得码值
        getCode() {
            const self = this
            const params = {
                typeCode: '001'
            }
            axios.post('/budget/codeTable/query', JSON.stringify(params), {
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                console.log(res)
            });
        },
        saveForm(action) {
            const self = this
            console.log('saveForm')
            console.log(this.formInline)
            axios
                .post('/budget/BudgetDptForm/imtSave', JSON.stringify(this.formInline.tableData), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    console.log(res)
                    self.currentFormId = res.data.content;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        // self.$emit('refreshData');
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },
        submitForm() {
            console.log('执行提交submit')
            const self = this
            const params = {
                id: this.currentFormId,
                cmtId: cookies.get('uid'),
                cmtName: cookies.get('uname')
            }
            axios
                .post('/budget/BudgetDptForm/imtCommit', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    console.log('提交：')
                    console.log(res)
                    // self.tableData = res.data.list
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },

        onSubmit() {
            const self = this
            const params = {
                year: this.formInline.year,
                crtDeptId: 13
                // crtDeptId: cookies.get('oid')
            }
            axios
                .post('/budget/BudgetDptForm/queryTotal', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    console.log('查询：')
                    console.log(res)
                    // self.tableData = res.data.list
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },
        clickTableRow() { },
        getList() {
            console.log('getlist');
        },
        getOrgan() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.organs = res.data;
            });
        },
        //分页查询
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        }
    }
};
</script>
<style>
</style>