<template>
    <div id="DriverList">
        <el-table :data="tableData" stripe @row-click="clickTableRow">

            <el-table-column prop="name" label="司机姓名">
            </el-table-column>
            <el-table-column prop="phone" label="手机号码">
            </el-table-column>
            <!-- <el-table-column prop="qq" label="QQ号码">
            </el-table-column> -->
            <el-table-column prop="mailbox" label="司机邮箱">
            </el-table-column>
            <!-- <el-table-column prop="sex" label="性别" min-width="100">
            </el-table-column> -->
            <!-- <el-table-column prop="birthday" label="出生年月">
            </el-table-column> -->
            <el-table-column prop="permitType" label="准驾车型">
            </el-table-column>
            <el-table-column prop="status" label="司机状态">
            </el-table-column>
            <!-- <el-table-column prop="firstLicenseTime " label="初次领证" min-width="120">
            </el-table-column> -->
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="editForm(scope.row)">编辑</el-button> -->
                    <!-- <el-button @click="deleteItems(scope.row)" type="danger">删除</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.committed == null">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <!--
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.committed == null">
                        <el-button type="text" icon="el-icon-delete"  @click="deleteItems(scope.row)"></el-button>
                    </el-tooltip>
                    -->
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
    name: 'DriverList',
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
        this.getUser();
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
        getUser() {
            const self = this;
            axios
                .get('/api/v1/users/role/driver')
                .then(res => {
                    let conarray = [];
                    for (let data of res.data) {
                        conarray.push({
                            id: data.id,
                            name: data.name
                        });
                    }
                    axios
                        .post(
                            '/api/v1/vehicle_forms/driver/saveList',
                            JSON.stringify(conarray),
                            {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }
                        )
                        .then(res => {
                            this.getList();
                        })
                        .catch(function() {
                            self.$message({
                                message: '保存司机信息失败',
                                type: 'error'
                            });
                        });
                })
                .catch(function() {
                    self.$message({
                        message: '获取司机信息失败',
                        type: 'error'
                    });
                });
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
                    '/api/v1/vehicle_forms/driver/query',
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
        deleteItems(row) {
            const self = this;
            axios
                .get('/api/v1/vehicle_forms/driver/delete/' + row.id)
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