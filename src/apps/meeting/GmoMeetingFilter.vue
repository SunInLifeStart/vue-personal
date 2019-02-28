<template>
    <div id="GmoMeetingFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标题">
                <el-input v-model="formInline.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="拟稿人">
                <el-input v-model="formInline.creatorName" placeholder="拟稿人"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="formInline.organName" placeholder="部门"></el-input>
            </el-form-item>
            <el-form-item label="登记日期">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'GmoMeetingFilter',
    data() {
        return {
            formInline: {
                title: '',
                creatorName: '',
                organName: '',
                created: []
            },
            searchOptions: []
        };
    },
    methods: {
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
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'EQUAL',
                    value: this.formInline.organName
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