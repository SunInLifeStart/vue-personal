<template>
    <div id="PaymentFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
            <el-form-item label="类型：">
                <el-input v-model="formInline.type"></el-input>
            </el-form-item>
            <el-form-item label="部门：">
                <el-input v-model="formInline.organ"></el-input>
            </el-form-item>
            <el-form-item label="提单人：">
                <el-input v-model="formInline.applicantName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期：">
                <el-date-picker v-model="formInline.applicantTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
    name: 'PaymentFilter',
    data() {
        return {
            formInline: {
                type: '',
                applicantName: '',
                organ: '',
                status: '',
                applicantTime: []
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.type = '';
            this.formInline.applicantName = '';
            this.formInline.organ = '';
            this.formInline.status = '';
            this.formInline.applicantTime = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.type.trim() !== '') {
                this.searchOptions.push({
                    field: 'type',
                    filter: 'LIKE',
                    value: this.formInline.type
                });
            }
            if (this.formInline.applicantName.trim() !== '') {
                this.searchOptions.push({
                    field: 'applicantName',
                    filter: 'LIKE',
                    value: this.formInline.applicantName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            if (this.formInline.organ.trim() !== '') {
                this.searchOptions.push({
                    field: 'organ',
                    filter: 'LIKE',
                    value: this.formInline.organ
                });
            }
            if (
                this.formInline.applicantTime &&
                this.formInline.applicantTime.length > 0
            ) {
                this.searchOptions.push({
                    field: 'applicantTime',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.applicantTime[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.applicantTime[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>