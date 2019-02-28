<template>
    <div id="envelope" style="width: 100%">
        <h1 style="text-align:center;margin-top:20px">中关村发展集团{{this.oname}}部门</h1>
        <h2 style="text-align:center; font-size:50px; margin-top:200px">

            <el-select v-model="tableDate.year" placeholder="请选择" @change="changeYear" style="width:130px;">
                <el-option v-for="item in years" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
            </el-select>

            <!-- <el-date-picker v-model="tableDate.year" type="year" @change="changeYear"></el-date-picker> -->
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
            tableDate: {
                year: this.year,
            },
            years: []
        };
    },
    props: ['year'],
    mounted() {
        this.oname = cookies.get('oname');
        this.getYears();
    },
    methods: {
        changeYear() {
            this.$emit('getYear', this.tableDate.year);
            // this.$emit('getYear', moment(this.tableDate.year).format('YYYY'));
        },
        //获得年份码表
        getYears() {
            axios.get('/budget/code/getCode/1').then(res => {
                console.log('res.data');
                this.years = res.data.content;
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