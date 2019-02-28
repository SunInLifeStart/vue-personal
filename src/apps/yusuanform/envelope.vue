<template>
    <div id="envelope" style="width: 100%">
        <h1 style="text-align:center;margin-top:20px">中关村发展集团{{this.oname}}部门</h1>
        <h2 style="text-align:center; font-size:50px; margin-top:200px">
            <!--
            <el-select v-model="tableDate.year" placeholder="请选择" style="width:130px;">
                <el-option v-for="item in years" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            -->
            <el-date-picker v-model="tableDate.year" type="year" @change="changeYear"></el-date-picker>
            年度预算报表
        </h2>
        <h3 style="text-align:center; margin-top:450px">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</h3>
        <el-row style="margin-top:100px">
            <el-col :span="8">主管领导：</el-col>
            <el-col :span="8">部门负责人：</el-col>
            <el-col :span="8">制表人：</el-col>
        </el-row>
    </div>
</template>

<script>
import cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'envelope',
    data() {
        return {
            oname: cookies.get('uid'),
            value5: '',
            tableDate: {
                year: '2019'
            },
            years: [
                moment(new Date()).format('YYYY'),
                moment(new Date()).format('YYYY') - 1,
                moment(new Date()).format('YYYY') - 2,
                moment(new Date()).format('YYYY') - 3,
                moment(new Date()).format('YYYY') - 4
                // moment(new Date()).format("YYYY")-5,
                // moment(new Date()).format("YYYY")-6,
                // moment(new Date()).format("YYYY")-7,
            ]
        };
    },
    mounted() {
        this.oname = cookies.get('oname');
        // this.getUsers();
    },
    methods: {
        changeYear() {
            this.$emit(
                'getYear',
                moment(this.tableDate.year).format('YYYY'),
                'envelope'
            );
        },
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                console.log(res);
            });
        },
        getTableDate() {
            this.$emit('getTableDate', {
                data: this.tableDate,
                type: 'envelope'
            });
        }
    }
};
</script>
<style>
</style>