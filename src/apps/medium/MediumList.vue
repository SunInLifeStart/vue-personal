<template>
    <div id="MediumList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="name" label="媒体名称" min-width="300px">
            </el-table-column>
            <el-table-column prop="href" label="新闻链接" min-width="300px">
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="300px">
            </el-table-column>
            <el-table-column prop="date" label="报道日期" min-width="150px">
            </el-table-column>
            <el-table-column label="操作"  min-width="100px">
                <template slot-scope="scope">
                    <!-- <el-button size="small" type="primary" @click="editForm(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"  @click="deleteItem(scope.row)">删除</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.committed == null">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.committed == null">
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
    name: 'MediumList',
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
                orderBy: 'id',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post(
                    '/api/v1/activity_forms/media/query',
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
        deleteItem(row) {
            const self = this;
            const param = [row.id];

            axios
                .get('/api/v1/activity_forms/media/delete/' + param, {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
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