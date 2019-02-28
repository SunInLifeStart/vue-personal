<template>
    <div>
        <el-form ref="EnterForm" :model="row" label-width="120px">
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="回车时间">
                        <!-- <el-input v-model="form.time"></el-input> -->
                        <el-date-picker v-model="row.receiptTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="当前车辆公里数">
                        <el-input v-model="row.currentMileage" @change="getmileage"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="本次公里数">
                        <el-input v-model="row.mileage" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="本次停车费">
                        <el-input v-model="row.parking"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="本次高速费">
                        <el-input v-model="row.tolls"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="本次油费">
                        <el-input v-model="row.fuel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'EnterForm',
    data() {
        return {
            row: {
                receiptTime: '',
                currentMileage: '',
                mileage: '',
                parking: '',
                tolls: '',
                fuel: '',
                id: ''
            },
            pickerOptions1: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
                ]
            }
        };
    },
    props: ['aaa'],
    mounted() {
        this.clearForm();
    },
    methods: {
        clearForm() {
            this.row = {
                receiptTime: '',
                currentMileage: '',
                mileage: '',
                parking: '',
                tolls: '',
                fuel: '',
                id: ''
            };
        },
        getmileage() {
            console.log(this.row);
            axios
                .get(
                    '/api/v1/vehicle_forms/receipt/' + this.aaa + '/getMileage',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.row.mileage = this.row.currentMileage - res.data;
                    this.$emit('refreshData');
                });
        },
        saveForm1(action = '') {
            const self = this;
            this.row.id = this.aaa;
            axios
                .post(
                    '/api/v1/vehicle_forms/receipt/' + this.aaa + '/save',
                    JSON.stringify(this.row),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    self.$message({
                        message: '保存回车单成功',
                        type: 'success'
                    });
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        saveForm() {
            this.saveForm1();
        }
    }
};
</script>

