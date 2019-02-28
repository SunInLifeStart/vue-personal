<template>
    <div id="ForeignOutFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标题：" width="200px">
                <el-input v-model="formInline.title" placeholder="请输入标题" ></el-input>
            </el-form-item>
            <el-form-item label="时间：">
                <el-date-picker v-model="formInline.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ForeignOutFilter',
    data() {
        return {
            formInline: {
                title: '',
                time: []
            },
            searchOptions: {}
        };
    },
    methods: {
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                 this.searchOptions.title =  this.formInline.title;
            }
            if (this.formInline.time && this.formInline.time.length > 0) {
                this.searchOptions.startTime = moment(this.formInline.time[0]).format('YYYY-MM-DD');
                this.searchOptions.endTime = moment(this.formInline.time[1]).format('YYYY-MM-DD')
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>