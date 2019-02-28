<template>
    <div id="VehicleList">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="transportPpl" label="用车人"></el-table-column>
            <el-table-column prop="organName" label="用车人部门"></el-table-column>
            <el-table-column prop="transportPplPhone" label="用车人电话"></el-table-column>
            <el-table-column prop="vehicleType" label="车辆类型"></el-table-column>
            <el-table-column prop="origin" label="派车地" min-width="120px"></el-table-column>
            <el-table-column prop="destination" label="目的地" min-width="80px"></el-table-column>
            <el-table-column prop="status" label="单据状态" min-width="80px"></el-table-column>
            <el-table-column label="操作" width="270">
                <template slot-scope="scope">
                    <!-- <el-button size="small" type="primary" @click="editForm(scope.row)" v-if="scope.row.committed == null">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteItem(scope.row)" v-if="scope.row.committed == null">删除</el-button>
                    <el-button size="small" type="primary" @click="editForm1(scope.row)" v-if="scope.row.drivers !== null">填写回车单</el-button> -->
                    <!-- v-if="scope.row.drivers !== null" -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="填写回车单" placement="left" v-if="scope.row.status == '已完成' && scope.row.receipts == null && scope.row.czqx">
                        <el-button type="text" icon="el-icon-document" @click="editForm1(scope.row)"></el-button>
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
import cookies from 'js-cookie';
export default {
    name: 'ApplyList',
    data() {
        return {
            // txhcd:cookies.get('uname'),
            tableData: [],
            users: [],
            loading: true,
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    watch: {
        searchOptions: function() {
            this.params.pageNum = 1;
            this.getList();
        }
    },
    mounted() {
        const self = this;
        /** 
        self.searchOptions.push({
            field: 'creatorId',
            filter: 'EQUAL',
            value: cookies.get('uid')
        });
*/
        // this.txhcd = cookies.get('uname');
        this.getList();
    },
    methods: {
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
                .post('/api/v1/vehicle_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.loading = false;
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    } else {
                        self.$emit('formId', '');
                    }
                    for(let item of res.data.forms){
                        if(item.drivers != null && item.drivers.name == cookies.get('uname')){
                            item.czqx = true;
                        } else {
                            item.czqx = false;
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '获取表单信息失败',
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
        editForm1(row) {
            this.$emit('tianjinhuidan', row.id);
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/vehicle_forms/delete/' + row.id)
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
    }
};
</script>