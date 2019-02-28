<template>
    <div id="PaymentList">
        <el-table :data="tableData" stripe @row-click="clickTableRow" :highlight-current-row='true'>
            <el-table-column prop="applicantName" label="提单人"></el-table-column>
            <el-table-column prop="organ" label="所属部门"></el-table-column>
            <el-table-column prop="numericalOrder" label="单据编号"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="applicantTime" label="提单时间" sortable>
                <!-- <template slot-scope="scope">
                    {{scope.row.draftTime | dateformat}}
                </template> -->
            </el-table-column>
            <el-table-column label="操作">
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
    name: 'PaymentList',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            tableData: [],
            cookie_uid: ''
        };
    },
    props: ['searchOptions'],
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uid') > -1) {
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getList();
    },
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
                .post('/api/v1/payment_forms/query', JSON.stringify(params), {
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
        deleteItem(row) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .get('/api/v1/payment_forms/delete/' + row.id)
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
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            this.$emit('editForm', row.id);
        },
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