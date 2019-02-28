<template>
    <div id="NewsFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标题">
                <el-input v-model="formInline.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="formInline.creatorName" placeholder="作者"></el-input>
            </el-form-item>
            <el-form-item label="报送单位">
                <el-input v-model="formInline.reportingOrg" placeholder="报送单位"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
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
    name: 'NewsFilter',
    data() {
        return {
            formInline: {
                title: '',
                creatorName: '',
                reportingOrg: '',
                status: '',
                created: []
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.creatorName = '';
            this.formInline.reportingOrg = '';
            this.formInline.status = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'EQUAL',
                    value: this.formInline.creatorName
                });
            }
            if (this.formInline.reportingOrg.trim() !== '') {
                this.searchOptions.push({
                    field: 'reportingOrg',
                    filter: 'LIKE',
                    value: this.formInline.reportingOrg
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