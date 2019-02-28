<template>
    <div id="LoanList">
        <el-table :data="tableData" stripe style="margin-bottom: 10px;" @row-click="clickTableRow">

            <el-table-column prop="borrower" label="借款人" align="center">
            </el-table-column>
            <el-table-column prop="borrowDept" label="费用承担部门" align="center">
            </el-table-column>
            <el-table-column prop="number" label="单据编号" align="center">
            </el-table-column>
            <!-- <el-table-column prop="organName" label="标题" align="center" min-width="150">
            </el-table-column> -->
            <el-table-column prop="status" label="单据状态" align="center">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center">
            </el-table-column>
            <el-table-column prop="borrowTime" label="借款时间" align="center" >
                <template slot-scope="scope">
                    {{scope.row.borrowTime | dateformat}}
                </template>
            </el-table-column>
            <el-table-column label="操作"  >
                <template slot-scope="scope">
                    <!-- <el-button size="small" @click="editForm(scope.row)" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'" type="primary">编辑</el-button>
                    <el-button size="small" type="danger" v-if="scope.row.status == '已保存'" @click="deleteItem(scope.row)">删除</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'LoanList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            resolution: {
                resultAttachments: []
            },
            resultAttachments: [],
            selectItem: []
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
                orderBy: "created",
                desc: true,
                options: this.searchOptions
            };
            console.log(params);
            axios
                .post('/api/v1/loan_forms/query', JSON.stringify(params), {
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
                const self = this;
                axios
                    .get('/api/v1/loan_forms/delete/' + row.id)
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
        },
        handleSuccess(response, file) {
            const self = this;
            // if (response.length > 0) {
            //     response.forEach(function(item) {
            //         self.selectItem.resultAttachments.push(item);
            //     });
            // }
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.push(item.id);
                    self.row.resultAttachments.push(item);
                });
            }
        },
        deleteAttachment(id) {
            const self = this;
            if (this.row.resultAttachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/loan_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.row.resultAttachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.row.resultAttachments.splice(
                                            index,
                                            1
                                        );
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#LoanList {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>