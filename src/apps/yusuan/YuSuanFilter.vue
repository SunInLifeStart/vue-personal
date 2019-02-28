<template>
    <div id="YuSuanFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="申请时间 ：">
                <el-date-picker v-model="formInline.applicationtime" type="year"></el-date-picker>
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
export default {
    name: 'YuSuanFilter',
    data() {
        return {
            searchOptions: '',
            formInline: {
                applicationtime: ''
            }
        };
    },
    methods: {
        onReset() {
            this.formInline.applicationtime = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = '';
            if (this.formInline.applicationtime != '') {
                this.searchOptions = moment(
                    this.formInline.applicationtime
                ).format('YYYY');
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>