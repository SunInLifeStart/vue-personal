<template>
    <div id="SubmissionList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow" :highlight-current-row='true'>
            <el-table-column prop="submissionNo" min-width="220px" label="呈报件编号"></el-table-column>
            <el-table-column prop="title" min-width="250px" label="文件标题"></el-table-column>
            <el-table-column prop="draftUnit" min-width="200px" label="拟稿单位"></el-table-column>
            <el-table-column prop="draftUser" min-width="150px" label="拟稿人"></el-table-column>
            <el-table-column prop="status" label="单据状态" width="100">
                <template slot-scope="scope">
                    {{scope.row.status | filterStatus }}
                </template>
            </el-table-column>
            <el-table-column prop="draftTime" label="拟稿时间" width="120" sortable>
                <template slot-scope="scope">
                    {{scope.row.draftTime | dateformat('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteForm(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <br />
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SubmissionList',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            tableData: [],
            cookie_uname: ''
        };
    },
    props: ['searchOptions'],
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
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
    filters: {
        filterStatus: function(data) {
            if (data == null) {
                return '已保存';
            } else {
                return data;
            }
        }
    },
    methods: {
        deleteForm(row) {
            this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios
                    .get('/api/v1/submission_forms/delete/' + row.id)
                    .then(res => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
            });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
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
                .post(
                    '/api/v1/submission_forms/query',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
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
                .get('/api/v1/submission_forms/delete/' + row.id)
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
            this.$emit('showStatus', row.status);
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