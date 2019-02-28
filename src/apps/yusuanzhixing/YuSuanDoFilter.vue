<template>
    <div id="YuSuanDoFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="查询时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="集团/部门">
                <el-select v-model="formInline.organName" placeholder="请选择">
                    <el-option v-for="item in combinedUnit" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';
import axios from 'axios';
export default {
    name: 'YuSuanDoFilter',
    data() {
        return {
            formInline: {
                organName: '',
                created: []
            },
            searchOptions: {
                startYear: '',
                endYear: '',
                groupName: ''
            },
            combinedUnit: []
        };
    },
    mounted() {
        this.getOgans();
    },
    methods: {
        getOgans() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.combinedUnit = res.data;
                this.combinedUnit.push({
                    id: '3232323223',
                    name: '中发展集团'
                });
            });
        },
        onReset() {
            this.formInline.organName = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        onSubmit() {
            console.log('打印的时间');
            console.log(this.formInline.organName);
            console.log(this.formInline.created);
            this.searchOptions = [];
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.groupName = this.formInline.organName;
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.startYear = moment(
                    this.formInline.created[0]
                ).format('YYYY-MM-DD');
                this.searchOptions.endYear = moment(
                    this.formInline.created[1]
                ).format('YYYY-MM-DD');
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
