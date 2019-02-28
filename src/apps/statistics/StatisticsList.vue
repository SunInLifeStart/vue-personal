<template>
    <div id="StatisticsList">
        <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow">

            <el-table-column prop="uname" label="提单人" align="center" min-width="120" >
            </el-table-column>
            <el-table-column prop="oname" label="费用承担部门" align="center" min-width="200">
            </el-table-column>
            <el-table-column prop="numbers" label="流水单号" align="center" min-width="200">
            </el-table-column>
            <el-table-column prop="dtype" label="单据类别" align="center" min-width="150">
            </el-table-column>
            <el-table-column prop="stype" label="类型" align="center" min-width="120">
            </el-table-column>
            <el-table-column prop="type" label="审核状态" align="center">
            </el-table-column>
            <el-table-column prop="created" label="提单时间" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.created | dateformat('YYYY-MM-DD HH:mm:ss')}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>

    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'StatisticsList',
    data() {
        return {
            tableData: [],
            tableDataAll: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            row: {},
            resolution: {
                resultAttachments: []
            },
            resultAttachments: [],
            selectItem: []
        };
    },
    props: ['searchOptions' , 'dtypes'],
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
        //导出
        excel(){
            const self = this;
            axios
                .post(
                    '/api/v1/reim/excel',
                    JSON.stringify(this.tableDataAll),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                   this.common.downloadExport(res.data)
                })
                .catch(function() {
                    self.$message({
                        message: '导出操作失败',
                        type: 'error'
                    });
                });
        },
        clickDialog(row) {
            this.dialogVisible = true;
            this.row = row;
            this.selectItem = [];
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: this.searchOptions,
                bigType: this.dtypes == '' ? '全部' : this.dtypes,
            };
            axios
                .post('/api/v1/reim/stat', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.tableDataAll = res.data.form;
                    self.params.total = res.data.pageCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id , res.data.forms[0].dtype);
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
            this.$emit('formId', row.id, row.dtype);
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
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.push(item.id);
                    self.row.resultAttachments.push(item);
                });
            }
        },
        /** 
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
                                '/api/v1/motion_forms/deleteAttachment/' + id,
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
        */
    }
};
</script>
<style lang="scss" scoped>
</style>