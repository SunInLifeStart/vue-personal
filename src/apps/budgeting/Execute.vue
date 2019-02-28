<template>
    <div id="Execute">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="统计年份：">
                <el-date-picker v-model="formInline.startYear" type="year" placeholder="选择起始年">
                </el-date-picker> -
                <el-date-picker v-model="formInline.endYear" type="year" placeholder="选择结束年">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="toolbar">
            <router-link to="/apps/budgetingsignal">
                <el-button type="primary" icon="el-icon-plus">执行生成</el-button>
            </router-link>
            <el-button type="primary">导出</el-button>
            <el-button type="primary">打印</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow" :highlight-current-row='true' class="lista">
            <el-table-column type="selection" label="全选" width="55">
            </el-table-column>
            <el-table-column prop="budgetProject" label="年度预算项" min-width="180"></el-table-column>
            <el-table-column prop="budgetSum" label="预算总额" min-width="180"></el-table-column>
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
import moment from "moment";
export default {
    name: 'Execute',
    data() {
        return {
            formInline: {
                startYear: moment(new Date()).format("YYYY"),
                endYear: moment(new Date()).format("YYYY"),
            },
            tableData: YUSUAN['zhixingList'],
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
    mounted() {
        this.getOrgan();
    },
    methods: {
        saveForm() { },
        submitForm() { },
        //查询
        onSubmit() {
            console.log('查询submit')
            const self = this
            const params = {
                startYear: this.formInline.startYear,
                endYear: this.formInline.startYear
            }
            axios
                .post('/budget/executionPlan/budgetDepartmentQuery', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    console.log(res)
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
        //获得部门id、name
        getOrgan() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                console.log(res)
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