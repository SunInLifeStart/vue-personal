<template>
    <div id="ExpenseFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="类型">
                <el-input v-model="formInline.type" placeholder="类型"></el-input>
            </el-form-item>
            <el-form-item label="提单人">
                <el-input v-model="formInline.creatorName" placeholder="提单人"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="formInline.organName" placeholder="部门"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期">
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
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'ExpenseFilter',
    data() {
        return {
            formInline: {
                type: '',
                creatorName: '',
                organName: '',
                created: [],
                status: ''
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.type = '';
            this.formInline.creatorName = '';
            this.formInline.organName = '';
            this.formInline.created = [];
            this.formInline.status = '';
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
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
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
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.created[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>