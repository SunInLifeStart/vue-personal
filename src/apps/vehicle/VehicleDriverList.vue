<template>
    <div id="VehicleDriverList">
        <el-collapse v-model="dispatch" class="vehiclegrid">
            <el-collapse-item title="选择车辆" name="selectVehicle">
                <el-table :data="tableData" @row-click="gainID" :highlight-current-row='true'>
                    <el-table-column prop="plateNum" label="车牌号"></el-table-column>
                    <el-table-column prop="brand" label="车辆品牌"></el-table-column>
                    <el-table-column prop="type" label="车辆类型"></el-table-column>
                    <el-table-column prop="loadNum" label="核载人数"></el-table-column>
                    <el-table-column prop="color" label="车辆颜色"></el-table-column>
                    <el-table-column prop="distance" label="行驶里程"></el-table-column>
                    <el-table-column prop="status" label="车辆状态"></el-table-column>
                </el-table>
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </el-collapse-item>
            <el-collapse-item title="" name="selectDriver">
                <!-- <el-table :data='tableData1' highlight-current-row  stripe @row-click="gainID1">
                    <el-table-column prop="name" label="司机姓名"></el-table-column>
                    <el-table-column prop="phone" label="手机号"></el-table-column>
                    <el-table-column prop="sex" label="性别"></el-table-column>
                    <el-table-column prop="address" label="司机住址"></el-table-column>
                    <el-table-column prop="permitType" label="准驾车型"></el-table-column>
                    <el-table-column prop="status" label="司机状态"></el-table-column>
                </el-table> -->
                <el-form>
                    <el-form-item label="请选择司机">
                        <el-select v-model="deice" value-key="id" @change="changeUser" filterable placeholder="">
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination> -->
            </el-collapse-item>
        </el-collapse>
        <div style="text-align: center; margin-top: 15px;">
            <el-button type="primary" @click="confirm()">确定</el-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'VehicleDriverList',
    data() {
        return {
            dispatch: ['selectVehicle', 'selectDriver'],
            search_dispatch_form: {},
            tableData: [],
            tableData1: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            carid: '',
            driveid: '',
            deice: {},
            users: [],
            arryy: []
        };
    },
    props: ['searchOptions', 'formId'],
    watch: {
        searchOptions: function() {
            // this.params.pageNum = 1;
            // this.getList();
        },
        formId: function() {
            // this.params.pageNum = 1;
            // this.getList();
        }
    },
    mounted() {
        this.getList();
        this.getList1();
    },
    methods: {
        changeUser() {
            // for (let data of this.users) {
            //     if (this.rows.bname1.id == data.id) {
            //         if (data.organ) {
            //             this.rows.transportDept = data.organ.name;
            //             this.rows.transportPpl = this.rows.bname1.name;
            //         } else {
            //             this.rows.transportDept = '';
            //         }
            //     }
            // }
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: []
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
                    // self.$emit('formId', res.data.forms[0].id);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getList1() {
            axios
                .get('/api/v1/users/role/driver')
                .then(res => {
                    this.users = res.data;
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
        gainID(row) {
            this.carid = row.id;
        },
        gainID1(row) {
            this.driveid = row.id;
        },
        confirm() {
            if (this.carid != null && this.deice != null) {
                axios
                    .get(
                        '/api/v1/vehicle_forms/' +
                            this.formId +
                            '/addVehicle/' +
                            this.carid
                    )
                    .then(res => {
                        // /api/v1/vehicle_forms/{formId}/addDriver/{driverId}
                        const param = {
                            id: this.deice.id,
                            name: this.deice.name
                        };
                        axios
                            .post(
                                '/api/v1/vehicle_forms/' +
                                    this.formId +
                                    '/addDriver',
                                JSON.stringify(param),
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                this.$emit('saveStatus', 'ARRANGE', this.deice);
                            });
                    });
            }
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

