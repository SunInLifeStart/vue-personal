<template>
    <div id="InformList">
        <el-table :data='vehicletable' style="width: 100%;">
            <!-- <el-table-column prop="djbh" label="序号" align="center" fixed>
                <template slot-scope="scope">
                    {{(params.pageNum - 1) * params.pageSize + scope.$index + 1}}
                </template>
            </el-table-column> -->
            <el-table-column prop="reportSummary" label="举报简介" align="center">
            </el-table-column>
            <el-table-column prop="personBeReported" label="被举报人" align="center">
            </el-table-column>
            <el-table-column prop="reportedUnit" label="被举报人单位" align="center">
            </el-table-column>
            <el-table-column prop="informer" label="举报人" align="center">
            </el-table-column>
            <el-table-column prop="reportUnit" label="举报人单位" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="250px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openPage('edit', scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteItem(scope.row.draftingId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 20px;text-align: center">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'InformList',
    data() {
        return {
            vehicletable: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    methods: {
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: "created",
                desc: true,
                options: this.searchOptions
            };
            axios
                .post(
                    '/api/v1/super_form/monitoringReport/query',
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
        }
    }
};
</script>

