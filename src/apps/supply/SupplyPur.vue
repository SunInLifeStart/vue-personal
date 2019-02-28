<template>
    <div id="SupplyPur">
        <el-card class="box-card">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="创建时间">
                    <el-date-picker v-model="formInline.created" type="date" :disabled="true"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="formInline.endTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitType">统计</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="exportType">种类导出</el-button>
            <el-button type="primary" @click="exportOgan">部门导出</el-button>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
            <p>采购表</p>
            <el-table :data="tableDataType" stripe style="width: 100%">
                <el-table-column prop="classify" label="用品分类">
                </el-table-column>
                <el-table-column prop="name" label="用品名称">
                </el-table-column>
                <el-table-column prop="specification" label="规格">
                </el-table-column>
                <el-table-column prop="sq_quantity" label="数量">
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="sum" label="金额">
                </el-table-column>
                <!--
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="viewDetail(scope.row,'type')">详情</el-button>
                    </template>
                </el-table-column>
                -->
            </el-table>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
            <el-form :inline="true" :model="formInlineOgan" class="demo-form-inline">
                <el-form-item label="开始日期">
                    <el-date-picker v-model="formInlineOgan.created" type="date" :disabled="true"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker v-model="formInlineOgan.endTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitOgan">统计</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 10px;">
            <p>部门表</p>
            <el-table :data="tableDataOgan" stripe style="width: 100%">
                <el-table-column prop="organName" label="申请部门">
                </el-table-column>
                <el-table-column prop="classify" label="用品分类">
                </el-table-column>
                <el-table-column prop="name" label="用品名称">
                </el-table-column>
                <el-table-column prop="specification" label="规格">
                </el-table-column>
                <el-table-column prop="sq_quantity" label="数量">
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="sum" label="金额">
                </el-table-column>
                <!--
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="viewDetail(scope.row,'ogan')">详情</el-button>
                    </template>
                </el-table-column>
                -->
            </el-table>
        </el-card>
        <el-dialog title="种类详情" :visible.sync="dialogFormVisibleType" max-width="1280px" width="70%">
            <el-table :data="detailTypeData" stripe style="width: 100%">
                <el-table-column prop="organName" label="部门">
                </el-table-column>
                <el-table-column prop="sq_quantity" label="数量">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="dialogFormVisibleType = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="部门详情" :visible.sync="dialogFormVisibleOgan" max-width="1280px" width="70%">
            <el-table :data="detailOganData" stripe style="width: 100%">
                <el-table-column prop="name" label="种类">
                </el-table-column>
                <el-table-column prop="sq_quantity" label="数量">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="dialogFormVisibleOgan = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'SupplyPur',
    data() {
        return {
            tableDataType: [],
            tableDataOgan: [],
            detailTypeData: [],
            detailOganData: [],
            selectOganTime: [],
            dialogFormVisibleType: false,
            dialogFormVisibleOgan: false,
            formInlineOgan: {
                created: '',
                endTime: ''
            },
            formInline: {
                created: '',
                endTime: ''
            }
        };
    },
    methods: {
        onSubmitOgan() {
            this.getOganList();
            // console.log(this.selectOganTime);
        },
        onSubmitType() {
            this.getList();
        },
        getTypeTime() {
            const self = this;
            axios
                .get('/api/v1/supply_forms/getType')
                .then(res => {
                    if (res.data.starTime) {
                        self.formInline.created = res.data.starTime;
                        // console.log(self.formInline.created);
                    } else {
                        self.formInline.created = '';
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getOganTime() {
            const self = this;
            axios
                .get('/api/v1/supply_forms/getdepart')
                .then(res => {
                    if (res.data.starTime) {
                        self.formInlineOgan.created = res.data.starTime;
                    } else {
                        self.formInlineOgan.created = '';
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getList() {
            const self = this;
            const params = {
                endTime: this.formInline.endTime
                    ? moment(this.formInline.endTime).format(
                          'YYYY-MM-DD hh:mm:ss'
                      )
                    : ''
            };
            axios
                .post('/api/v1/supply_forms/statType', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableDataType = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getOganList() {
            const self = this;
            const params = {
                endTime: this.formInlineOgan.endTime
                    ? moment(this.formInlineOgan.endTime).format(
                          'YYYY-MM-DD hh:mm:ss'
                      )
                    : ''
            };
            axios
                .post(
                    '/api/v1/supply_forms/statDepart',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableDataOgan = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getTypeListDetail(row) {
            const self = this;
            const params = {
                name: row.name,
                starTime: this.formInline.created
                    ? this.formInline.created
                    : '',
                endTime: this.formInline.endTime
                    ? moment(this.formInline.endTime).format(
                          'YYYY-MM-DD hh:mm:ss'
                      )
                    : ''
            };
            axios
                .post(
                    '/api/v1/supply_forms/typeDetails',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.detailTypeData = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getOganListDetail(row) {
            const self = this;
            const params = {
                organName: row.organName,
                starTime: this.formInlineOgan.created
                    ? this.formInlineOgan.created
                    : '',
                endTime: this.formInlineOgan.endTime
                    ? moment(this.formInlineOgan.endTime).format(
                          'YYYY-MM-DD hh:mm:ss'
                      )
                    : ''
            };
            axios
                .post(
                    '/api/v1/supply_forms/depatDetails',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.detailOganData = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        viewDetail(row, msg) {
            if (msg == 'type') {
                this.dialogFormVisibleType = true;
                this.getTypeListDetail(row);
                //调接口
            } else if (msg == 'ogan') {
                this.dialogFormVisibleOgan = true;
                this.getOganListDetail(row);
                //调接口
            }
        },
        exportType() {
            const starTime = this.formInline.created
                ? this.formInline.created
                : '';
            const endTime = this.formInline.endTime
                ? moment(this.formInline.endTime).format('YYYY-MM-DD hh:mm:ss')
                : '';
            this.common.downloadExport(
                '/api/v1/supply_forms/typeExcel?starTime=' +
                    starTime +
                    '&endTime=' +
                    endTime
            );
        },
        exportOgan() {
            const starTime = this.formInlineOgan.created
                ? this.formInlineOgan.created
                : '';
            const endTime = this.formInlineOgan.endTime
                ? moment(this.formInlineOgan.endTime).format(
                      'YYYY-MM-DD hh:mm:ss'
                  )
                : '';
            console.log(starTime);
            console.log(endTime);
            this.common.downloadExport(
                '/api/v1/supply_forms/depatExcel?starTime=' +
                    starTime +
                    '&endTime=' +
                    endTime
            );
        }
    },
    mounted() {
        this.getTypeTime();
        this.getOganTime();
        this.getList();
        this.getOganList();
    }
};
</script>