<template>
    <div id="ExpenseList">
        <el-table :data="tableData" stripe @row-click="clickTableRow">
            <el-table-column prop="creatorName" label="提单人">
            </el-table-column>
            <el-table-column prop="organName" label="部门">
            </el-table-column>
            <el-table-column prop="no" label="单据编号">
            </el-table-column>
            <el-table-column prop="status" label="状态">
            </el-table-column>
            <el-table-column prop="type" label="类型">
            </el-table-column>
            <el-table-column prop="created" label="提单时间">
                <!--
                <template slot-scope="scope">
                    {{scope.row.created}}
                </template>
                -->
            </el-table-column>
            <el-table-column label="操作">
                <!--v-if="scope.row.committed == null"-->
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'ExpenseList',
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
            this.params.pageNum = 1;
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/expense_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    } else {
                        self.$emit('formId', '');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            this.$emit('editForm', row.id);
            this.$emit('showStatus', row.status);
            console.log(row.id);
        },
        deleteItem(row) {
            const self = this;
            axios
                .delete('/api/v1/expense_forms/deleteForm/' + row.id)
                .then(res => {
                    self.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    self.getList();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
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
        this.getList();
    }
};
</script>