<template>
    <div id="YuSuanShengDoFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="查询时间">
                <el-date-picker v-model="formInline.created" type="year"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
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
    name: 'YuSuanShengDoFilter',
    data() {
        return {
            formInline: {
                created: ''
            },
            searchOptions: {
                year: ''
            }
        };
    },
    methods: {
        onReset() {
            this.formInline.created = '';
            this.onSubmit();
        },
        onSubmit() {
            if (this.formInline.created != '') {
                this.searchOptions.year = this.formInline.created;
            }
            this.$emit('searchShengList', this.searchOptions);
        }
    }
};
</script>
