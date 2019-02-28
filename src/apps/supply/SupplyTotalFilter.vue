<template>
    <div id="SupplyTotalFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="创建时间">
                <el-date-picker v-model="formInline.created" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']"></el-date-picker>
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
    name: 'SupplyTotalFilter',
    data() {
        return {
            formInline: {
                created: []
            },
            searchOptions: []
        };
    },
    methods: {
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions[0] = moment(
                    this.formInline.created[0]
                ).format('YYYY-MM-DD hh:mm:ss');
                this.searchOptions[1] = moment(
                    this.formInline.created[1]
                ).format('YYYY-MM-DD hh:mm:ss');
            }
            console.log(this.searchOptions);
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>