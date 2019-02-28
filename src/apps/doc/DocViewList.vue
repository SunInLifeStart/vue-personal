<template>
    <div id="DocViewList">
        <el-card class="box-card">
            <span>发文拟稿</span>
            <el-table :data="tableDataOut" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow">
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="creatorName" label="拟稿人">
                </el-table-column>
                <el-table-column prop="organName" label="部门">
                </el-table-column>
                <el-table-column prop="created" label="登记日期">
                </el-table-column>
            </el-table>
            <!--
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
            -->
        </el-card>
        <el-card class="box-card" style="margin-top: 10px">
            <span>收文登记</span>
            <el-table :data="tableDataIncome" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRowIncome">
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="creatorName" label="拟稿人">
                </el-table-column>
                <el-table-column prop="organName" label="部门">
                </el-table-column>
                <el-table-column prop="created" label="登记日期">
                    <template slot-scope="scope">
                        {{scope.row.created | dateformat}}
                    </template>
                </el-table-column>
            </el-table>
            <!--
            <el-pagination @size-change="sizeChangeIncome" @current-change="currentChangeIncome" :current-page="paramsIncome.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="paramsIncome.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paramsIncome.total">
            </el-pagination>
            -->
        </el-card>
        <el-card class="box-card" style="margin-top: 10px">
            <span>部门呈报</span>
            <el-table :data="tableDataSub" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRowSub">
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="creatorName" label="拟稿人">
                </el-table-column>
                <el-table-column prop="organName" label="部门">
                </el-table-column>
                <el-table-column prop="created" label="登记日期">
                    <template slot-scope="scope">
                        {{scope.row.created | dateformat}}
                    </template>
                </el-table-column>
            </el-table>
            <!--
            <el-pagination @size-change="sizeChangeSub" @current-change="currentChangeSub" :current-page="paramsSub.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="paramsSub.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paramsSub.total">
            </el-pagination>
            -->
        </el-card>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'DocViewList',
    data() {
        return {
            tableDataOut: [],
            tableDataIncome: [],
            tableDataSub: [],
            params: {
                pageNum: 1,
                pageSize: 200,
                total: 0
            },
            paramsIncome: {
                pageNum: 1,
                pageSize: 200,
                total: 0
            },
            paramsSub: {
                pageNum: 1,
                pageSize: 200,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.searchOptions.push({
            field: 'creatorId',
            filter: 'EQUAL',
            value: this.$store.getters.LoginData.uid
        });
        this.getList();
        this.getIncomeList();
        this.getSubList();
    },
    watch: {
        searchOptions: function() {
            // this.params.pageNum = 1;
            //this.paramsIncome.pageNum = 1;
            // this.paramsSub.pageNum = 1;
            this.getList();
            this.getIncomeList();
            this.getSubList();
        }
    },
    methods: {
        clickTableRow(row) {
            this.$emit('formId', row.id, 'outgoing');
        },

        clickTableRowIncome(row) {
            this.$emit('formId', row.id, 'incoming');
        },
        clickTableRowSub(row) {
            this.$emit('formId', row.id, 'submission');
        },

        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'id',
                desc: true,
                type: 1,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/doc/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableDataOut = res.data.forms;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id, 'outgoing');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getIncomeList() {
            const self = this;
            const params = {
                page: this.paramsIncome.pageNum,
                pageSize: this.paramsIncome.pageSize,
                orderBy: 'id',
                type: 2,
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/doc/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableDataIncome = res.data.forms;
                    // self.paramsIncome.total = res.data.totalCount;
                    /** 
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
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
        getSubList() {
            const self = this;
            const params = {
                page: this.paramsSub.pageNum,
                pageSize: this.paramsSub.pageSize,
                orderBy: 'id',
                desc: true,
                type: 3,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/doc/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableDataSub = res.data.forms;
                    // self.paramsSub.total = res.data.totalCount;
                    /** 
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
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
        editForm(row) {
            this.$emit('editForm', row.id);
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        currentChangeIncome(pageNum) {
            this.paramsIncome.pageNum = pageNum;
            this.getIncomeList();
        },
        sizeChangeIncome(pageSize) {
            this.paramsIncome.pageSize = pageSize;
            this.getIncomeList();
        },
        currentChangeSub(pageNum) {
            this.paramsSub.pageNum = pageNum;
            this.getSubList();
        },
        sizeChangeSub(pageSize) {
            this.paramsSub.pageSize = pageSize;
            this.getSubList();
        }
    }
};
</script>