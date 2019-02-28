<template>
    <div id="InspectList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="title" label="标题" min-width="150px">
            </el-table-column>
            <el-table-column prop="definer" label="立项人" min-width="150px">
            </el-table-column>
            <el-table-column prop="inspector" label="被督办部门负责人" min-width="150px">
            </el-table-column>
            <el-table-column prop="created" label="创建时间" min-width="150px">
            </el-table-column>
            <el-table-column prop="deadline" label="截至日期" min-width="150px" to="/index">
            </el-table-column>
            <el-table-column prop="status" label="单据状态" min-width='100px'>
            </el-table-column>
            <el-table-column label="操作" min-width="160px" fixed='right'>
                <!-- <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="editForm(scope.row)" v-show="scope.row.status != '审核中' && scope.row.status != '已审结'">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteItem(scope.row)" v-show="scope.row.status != '审核中' && scope.row.status != '已审结'">删除</el-button>
                </template> -->
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
import cookies from 'js-cookie';
export default {
    name: 'InspectList',
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
                options: this.searchOptions,
                uid: parseInt(cookies.get('uid'))
            };
            axios
                .post('/api/v1/inspect_forms/query', JSON.stringify(params), {
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
        },
        deleteItem(row) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .delete('/api/v1/inspect_forms/delete/' + row.id)
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