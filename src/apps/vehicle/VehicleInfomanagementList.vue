<template>
    <div id="VehicleInfomanagementList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="plateNum" label="车牌号">
            </el-table-column>
            <el-table-column prop="brand" label="车辆品牌">
            </el-table-column>
            <el-table-column prop="purchase" label="车辆型号">
                <template slot-scope="scope">
                    {{scope.row.model}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="车辆类型">
            </el-table-column>
            <el-table-column prop="loadNum" label="核载人数">
            </el-table-column>
            
            <el-table-column prop="color" label="车辆颜色">
            </el-table-column>
            <el-table-column prop="status" label="车辆状态">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <!-- <el-button size="small" type="primary" @click="editForm(scope.row)" v-if="scope.row.committed == null">编辑</el-button>
                    <el-button size="small" type="danger" v-if="scope.row.committed == null" @click="deleteItem(scope.row)">删除</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.committed == null">
                        <el-button type="text" icon="el-icon-edit-outline"  @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.committed == null">
                        <el-button type="text" icon="el-icon-delete"  @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'VehicleInfomanagementList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
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
            axios
                .post(
                    '/api/v1/vehicle_forms/vehicle/query',
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
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            this.$emit('editForm', row.id);
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/vehicle_forms/vehicle/delete/' + row.id)
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
        },
        handleSizeChange() {},
        handlez(val) {
            this.currentPage = val;
        },
        handleNodeClick() {},
        handleClick() {}
    },
    mounted() {
        this.getList();
    }
};
</script>