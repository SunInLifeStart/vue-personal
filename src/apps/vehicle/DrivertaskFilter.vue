<template>
    <div id="DrivertaskFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="formInline.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'DrivertaskFilter',
    data() {
        return {
            formInline: {
                name: '',
                created: []
            },
            searchOptions: '',
            searchCreated: []
        };
    },
    methods: {
        onReset() {
            this.formInline.name = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = '';
            this.searchCreated = [];
            if (this.formInline.name.trim() !== '') {
                this.searchOptions = this.formInline.name;
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchCreated = this.formInline.created;
            }
            this.$emit('searchList', this.searchOptions, this.searchCreated);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>