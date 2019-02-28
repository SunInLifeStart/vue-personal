<template>
    <div id="VehicleInfomanagementForm">
        <el-form ref="vehicleForm" :model="rows" label-width="100px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="车牌号码" prop="plateNum">
                        <el-input v-model="rows.plateNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆型号" prop="model">
                        <el-input v-model="rows.model"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆品牌" prop="brand">
                        <el-input v-model="rows.brand"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="车辆类型" prop="type">
                        <el-select v-model="rows.type" placeholder="请选择">
                            <el-option v-for="item in options_type" :key="item.value_type" :label="item.label_xwfx" :value="item.value_type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核载人数" prop="loadNum">
                        <el-input v-model="rows.loadNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="购买日期" prop="purchase">
                        <el-date-picker v-model="rows.purchase" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="行驶里程">
                        <el-input v-model="rows.distance">
                            <template slot="append">/km</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆颜色">
                        <el-input v-model="rows.color"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车架号">
                        <el-input v-model="rows.frameNum"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发动机编号">
                        <el-input v-model="rows.engineNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="登记日期">
                        <el-date-picker v-model="rows.registration" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发证日期">
                        <el-date-picker v-model="rows.certificate" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保险开始时间">
                        <el-date-picker v-model="rows.insuranceStart" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保险结束时间">
                        <el-date-picker v-model="rows.insuranceEnd" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆状态">
                        <el-select v-model="rows.status" placeholder="请选择">
                            <el-option v-for="item in options_harry" :key="item.value_harryy" :label="item.label_xwfx" :value="item.value_harryy">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="公用车编码号">
                        <el-input v-model="rows.code"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="rows.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'VehicleInfomanagementForm',
    data() {
        return {
            childValue: '',
            tabledata: [],
            rows: {
                attachments: []
            },
            uploadId: 0,
            options_type: [
                {
                    value_type: '大型客车',
                    label_xwfx: '大型客车'
                },
                {
                    value_type: '小型客车',
                    label_xwfx: '小型客车'
                },
                {
                    value_type: '小型自动挡汽车',
                    label_xwfx: '小型自动挡汽车'
                },
                {
                    value_type: '其它',
                    label_xwfx: '其它'
                }
            ],
            options_harry: [
                {
                    value_harryy: '正常',
                    label_xwfx: '正常'
                },
                {
                    value_harryy: '维修',
                    label_xwfx: '维修'
                }
            ],
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                plateNum: [
                    {
                        required: true,
                        message: '请输入车牌号',
                        trigger: 'blur'
                    }
                ],
                brand: [
                    {
                        required: true,
                        message: '请输入车辆品牌',
                        trigger: 'blur'
                    }
                ],
                model: [
                    {
                        required: true,
                        message: '请车辆型号',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请输入车辆类型',
                        trigger: 'blur'
                    }
                ],
                loadNum: [
                    {
                        required: true,
                        message: '请输入核载人数',
                        trigger: 'blur'
                    }
                ],
                purchase: [
                    {
                        required: true,
                        message: '请选择购买日期',
                        trigger: 'blur'
                    }
                ]
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    props: ['formId', 'operationType'],
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                this.rows = {
                    brand: '',
                    model: '',
                    type: '',
                    loadNum: '',
                    purchase: '',
                    distance: '',
                    distance: '',
                    color: '',
                    frameNum: '',
                    engineNum: '',
                    registration: '',
                    certificate: '',
                    insuranceStart: '',
                    insuranceEnd: '',
                    status: '',
                    code: '',
                    remark: ''
                };
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.rows = {
                    brand: '',
                    model: '',
                    type: '',
                    loadNum: '',
                    purchase: '',
                    distance: '',
                    distance: '',
                    color: '',
                    frameNum: '',
                    engineNum: '',
                    registration: '',
                    certificate: '',
                    insuranceStart: '',
                    insuranceEnd: '',
                    status: '',
                    code: '',
                    remark: ''
                };
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    mounted() {
        if (this.operationType == 'edit') {
            this.getForm();
        } else if (this.operationType == 'create') {
            this.rows = {
                brand: '',
                model: '',
                type: '',
                loadNum: '',
                purchase: '',
                distance: '',
                distance: '',
                color: '',
                frameNum: '',
                engineNum: '',
                registration: '',
                certificate: '',
                insuranceStart: '',
                insuranceEnd: '',
                status: '',
                code: '',
                remark: ''
            };
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/vehicle/' + this.formId)
                    .then(res => {
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveForm1(action = '') {
            const self = this;
            axios
                .post(
                    '/api/v1/vehicle_forms/vehicle/save',
                    JSON.stringify(this.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck() {
            if (this.operationType == 'create') {
                this.saveForm('save');
            } else {
                this.submitForm();
                this.startProcess();
            }
        },
        saveForm() {
            this.$refs['vehicleForm'].validate(valid => {
                if (valid) {
                    this.saveForm1();
                    this.childValue = '成功';
                    this.$emit('childByValue', this.childValue);
                } else {
                    return false;
                }
            });
        },
        // submitForm() {
        //     const self = this;
        //     axios
        //         .post(
        //             '/api/v1/incomings/' + this.currentFormId + '/create',
        //             '',
        //             {
        //                 headers: {
        //                     'Content-type': 'application/json'
        //                 }
        //             }
        //         )
        //         .then(res => {
        //             if (res.data.id != '') {
        //                 self.commitForm(res.data.id);
        //             }
        //         })
        //         .catch(function() {
        //             self.$message({
        //                 message: '操作失败',
        //                 type: 'error'
        //             });
        //         });
        // },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/incoming_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMENT'
            };
            axios
                .put(
                    '/api/v1/incomings/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        },
        clearForm() {
            this.rows = {
                brand: '',
                model: '',
                type: '',
                loadNum: '',
                purchase: '',
                distance: '',
                distance: '',
                color: '',
                frameNum: '',
                engineNum: '',
                registration: '',
                certificate: '',
                insuranceStart: '',
                insuranceEnd: '',
                status: '',
                code: '',
                remark: ''
            };
        }
    }
};
</script>
<style lang="scss" scoped>
#VehicleInfomanagementForm {
    .uploadBtn {
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
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>