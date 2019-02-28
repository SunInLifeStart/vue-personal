<template>
    <div id="AssetList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow" :highlight-current-row='true'>
            <el-table-column prop="proposer" label="申请人">
            </el-table-column>
            <el-table-column prop="applyDept" label="申请部门" min-width='200px'>
            </el-table-column>
            <el-table-column prop="applyDate" label="申请日期" sortable min-width='120px'>
                <template slot-scope="scope">
                    {{scope.row.applyDate | dateformat('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="number" label="合计数量" min-width='120px'>
            </el-table-column>
            <el-table-column prop="money" label="合计金额" min-width='120px'>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width='120px'>
            </el-table-column> 
            <el-table-column prop="opinion" label="部门负责人意见" min-width='130px'>
            </el-table-column>-->
            <el-table-column prop="status" label="单据状态" min-width='100px'>
            </el-table-column>
            <el-table-column label="操作" min-width="100px" fixed='right'>
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-show="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-show="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'AssetList',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            tableData: []
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.getList();
    },
    watch: {
        searchOptions: function() {
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
                .post('/api/v1/asset_forms/query', JSON.stringify(params), {
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
        },
        deleteItem(row) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .delete('/api/v1/asset_forms/delete/' + row.id)
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
        }
    }
};
</script>