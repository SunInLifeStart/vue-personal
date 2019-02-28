<template>
    <div id="SubmissionFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="文件名">
                <el-input v-model="formInline.fileName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="下发人">
                <el-input v-model="formInline.issueName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="下发部门">
                <el-input v-model="formInline.organName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="下发时间：">
                <el-date-picker v-model="formInline.issueDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
    name: 'SubmissionFilter',
    data() {
        return {
            formInline: {
                fileName: '',
                issueName: '',
                organName: '',
                issueDate: []
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.fileName = '';
            this.formInline.issueName = '';
            this.formInline.organName = '';
            this.formInline.issueDate = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.fileName.trim() !== '') {
                this.searchOptions.push({
                    field: 'fileName',
                    filter: 'LIKE',
                    value: this.formInline.fileName
                });
            }
            if (this.formInline.issueName.trim() !== '') {
                this.searchOptions.push({
                    field: 'issueName',
                    filter: 'LIKE',
                    value: this.formInline.issueName
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
                });
            }
            if (
                this.formInline.issueDate &&
                this.formInline.issueDate.length > 0
            ) {
                this.searchOptions.push({
                    field: 'issueDate',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.issueDate[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.issueDate[1]).format(
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