<template>
    <div id="PortalAppList">
        <el-table :data="tableData" stripe @row-click="clickTableRow" :highlight-current-row='true'>
            <el-table-column prop="title" label="标题" min-width="160px"></el-table-column>
            <el-table-column prop="time" label="时间" min-width="160px"></el-table-column>
            <el-table-column prop="publisher" label="发布人" min-width="160px"></el-table-column>
            <el-table-column prop="source" label="发布部门" min-width="160px"></el-table-column>
            <el-table-column label="操作" min-width="90px" fixed='right'>
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="right">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
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
    name: 'PortalAppList',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            page:1,
            tableData: []
        };
    },
    props: ['searchOptions','type'],
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
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        getList() {
            const self = this;
            const params = {
                title: self.searchOptions.title || "",
                type: self.type,
                startTime:self.searchOptions.startTime || "",
                endTime:self.searchOptions.endTime || "",
                page:self.params.pageNum,
                size:self.params.pageSize,
            };
            axios
                .get(
                    '/api/v1/portal/article',
                    {params:params}
                )
                .then(res => {
                    self.tableData = res.data.data;
                    self.params.total = res.data.totalNumber;
                    if (res.data.data.length > 0) {
                        self.$emit('formId', res.data.data[0].articleId);
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
                console.log(row);
               this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .post('/api/v1/portal/article/del', {
                   id:row.articleId
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
            this.$emit('formId', row.articleId);
        },
        editForm(row) {
            this.$emit('editForm', row.articleId);
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