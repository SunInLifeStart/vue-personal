<template>
    <div id="StatisticsFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="提单人">
                <el-input v-model="formInline.creatorName" placeholder="提单人"></el-input>
            </el-form-item>
            <el-form-item label="单据类别">
                <el-select v-model="formInline.dtype" clearable placeholder="请选择" @change="pushoptions2">
                    <el-option v-for="item in options1" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="formInline.stype" clearable placeholder="请选择">
                    <el-option v-for="item in options2[0]" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="费用承担部门">
                <el-input v-model="formInline.organName" placeholder="费用承担部门"></el-input>
            </el-form-item>
            <el-form-item label="审核状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value2" :label="item.label" :value="item.value2">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" v-on:click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { PAYMENT, CURRENCY } from '../data.js';
export default {
    name: 'StatisticsFilter',
    data() {
        return {
            options: [
                {
                    value2: '',
                    label: '全部'
                },
                {
                    value2: '已保存',
                    label: '已保存'
                },
                {
                    value2: '审核中',
                    label: '审核中'
                },
                {
                    value2: '已驳回',
                    label: '已驳回'
                },
                {
                    value2: '已完成',
                    label: '已完成'
                }
            ],
            options1: [],
            options2: [],
            options3: PAYMENT['payType'],
            options4: [
                {
                    value: '',
                    name: '全部'
                },
                {
                    value: '国内差旅报销',
                    name: '国内差旅报销'
                },
                {
                    value: '国际差旅报销',
                    name: '国际差旅报销'
                },
                {
                    value: '日常支出(对私)',
                    name: '日常支出(对私)'
                },
                {
                    value: '捐赠',
                    name: '捐赠'
                },
                {
                    value: '招待费',
                    name: '招待费'
                },
                {
                    value: '董事会费',
                    name: '董事会费'
                },
                {
                    value: '年度绩效及特别奖励',
                    name: '年度绩效及特别奖励'
                }
            ],
            formInline: {
                creatorName: '',
                dtype: '',
                stype: '',
                organName: '',
                status: '',
                created: []
            },
            value: '',
            value1: '',
            searchOptions: []
        };
    },
    mounted() {
        this.application();
    },
    methods: {
        onReset() {
            this.formInline.creatorName = '';
            this.formInline.dtype = '';
            this.formInline.stype = '';
            this.formInline.organName = '';
            this.formInline.status = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        application() {
            axios.get('/api/v1/reim/selectCode/application').then(res => {
                this.options1 = res.data;
            });
        },
        pushoptions2(val) {
            if (val == '付款申请单(对公)') {
                this.options2 = [];
                this.options2.push(this.options3);
            } else if (val == '报销申请单(对私)') {
                this.options2 = [];
                this.options2.push(this.options4);
            } else if (val == '借款申请单') {
                this.options2 = [];
            } else if (val == '出差申请') {
                this.options2 = [];
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
                });
            }
            // if (this.formInline.dtype.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'dtype',
            //         filter: 'LIKE',
            //         value: this.formInline.dtype
            //     });
            // }
            if (this.formInline.stype.trim() !== '') {
                this.searchOptions.push({
                    field: 'stype',
                    filter: 'LIKE',
                    value: this.formInline.stype
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            if (
                this.formInline.created &&
                this.formInline.created.length > 0
            ) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format(
                        'YYYY-MM-DD 00:00:00'
                    ),
                    value2: moment(this.formInline.created[1]).format(
                        'YYYY-MM-DD 23:59:59'
                    )
                });
            }
            this.$emit('searchList', this.searchOptions);
            this.$emit('dtypes', this.formInline.dtype);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>