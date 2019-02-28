<template>
    <div id="ForeignUplodeList">
        <el-table :data="tableData" stripe @row-click="clickTableRow" :highlight-current-row='true'>
            <el-table-column prop="fileName" label="文档名称"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="created" label="创建时间" sortable>
                <template slot-scope="scope">
                    {{scope.row.created | dateformat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)" v-if="foreignManager"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="right">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)" v-if="foreignManager"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下载" placement="right">
                        <el-button type="text" icon="el-icon-download" @click="uplodeFile(scope.row)"></el-button>
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
    name: 'ForeignUplodeList',
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
    props: ['searchOptions','foreignManager'],
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
        uplodeFile(row) {
            if (row.uploadAtts && row.uploadAtts.length > 0) {
                for (let data of row.uploadAtts) {
                    // window.open(data.url);
                    this.common.download(data.url);
                }
            }
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
                    '/api/v1/foreign_forms/upload/query',
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
                .delete(
                    '/api/v1/foreign_forms/upload/deleteUpload?id=' + row.id
                )
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