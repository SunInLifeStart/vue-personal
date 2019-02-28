<template>
    <div id="YuSuanShengDoList">
        <el-table :data="tableData" max-height="350" stripe @row-click="clickTableRow" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="budgetProject" label="年度预算项" min-width="200px;">
            </el-table-column>
            <el-table-column prop="budgetSum" label="预算总额" min-width="150px;">
            </el-table-column>
            <el-table-column prop="reimSum" label="报销执行总额" min-width="200px;">
            </el-table-column>
            <el-table-column prop="executeSum" label="实际执行总额" min-width="200px;">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.executeSum" @input="realMoney(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="implementationRate" label="执行率" min-width="200px;">
            </el-table-column>
            <el-table-column prop="remark" label="备注执行差异说明" min-width="200px;">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <!--
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
        -->
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'YuSuanShengDoList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    watch: {
        searchOptions: function() {
            //this.params.pageNum = 1;
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            axios
                .post(
                    '/budget/BudgetDptForm/' +
                        this.searchOptions.year +
                        '/imtQueryAll',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableData = res.data.content;
                    /** 
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    } else {
                        self.$emit('formId', '');
                    }
                    */
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        realMoney(row) {
            if (row.executeSum != '') {
                row.implementationRate =
                    this.common.toDecimal2(
                        parseFloat(row.implementationRate) /
                            parseFloat(row.budgetSum) *
                            100
                    ) + '%';
            } else {
                row.implementationRate =
                    this.common.toDecimal2(
                        parseFloat(row.reimSum) /
                            parseFloat(row.budgetSum) *
                            100
                    ) + '%';
            }
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        handleSelectionChange() {},
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        handleSizeChange() {},
        handlez(val) {
            this.currentPage = val;
        },
        handleNodeClick() {},
        handleClick() {}
    },
    mounted() {
        console.log('这是生成执行');
        this.getList();
    }
};
</script>
