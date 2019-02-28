<template>
    <div id="PublicityMaterialsFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="关键词">
                <el-input v-model="formInline.keywords" placeholder="关键词"></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="formInline.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="上报单位">
                <el-input v-model="formInline.reportingUnit" placeholder="上报单位"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上报时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onreset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'PublicityMaterialsFilter',
    data() {
        return {
            formInline: {
                keywords: '',
                title: '',
                reportingUnit: '',
                created: [],
                status: ''
            },
            searchOptions: []
        };
    },
    methods: {
        onreset() {
            this.formInline.keywords = '';
            this.formInline.title = '';
            this.formInline.reportingUnit = '';
            this.formInline.status = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        clearFilter() {
            this.formInline.keywords = '';
            this.formInline.title = '';
            this.formInline.reportingUnit = '';
            this.formInline.status = '';
            this.formInline.created = [];
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.keywords.trim() !== '') {
                this.searchOptions.push({
                    field: 'keywords',
                    filter: 'LIKE',
                    value: this.formInline.keywords
                });
            }
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            if (this.formInline.reportingUnit.trim() !== '') {
                this.searchOptions.push({
                    field: 'reportingUnit',
                    filter: 'LIKE',
                    value: this.formInline.reportingUnit
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
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>