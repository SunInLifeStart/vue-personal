<template>
    <div id="MediumFilter">
        <el-form :inline="true" class="demo-form-inline" :model="formInline">
            <el-form-item label="新闻标题:" prop="notice_person">
                <el-input v-model="formInline.title" placeholder=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="信息类型:" style="padding-right: 0px;" prop="notice_status">
                <el-select v-model="formInline.type" placeholder="请选择信息类型">
                    <el-option label="领导讲话" value="领导讲话"></el-option>
                    <el-option label="规章制度" value="规章制度"></el-option>
                    <el-option label="通知公告" value="通知公告"></el-option>
                    <el-option label="工作简报" value="工作简报"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态:" style="padding-right: 0px;" prop="notice_status">
                <el-select v-model="formInline.status" placeholder="请选择状态">
                    <el-option label="草稿" value="1"></el-option>
                    <el-option label="审核中" value="2"></el-option>
                    <el-option label="已发布" value="3"></el-option>
                    <el-option label="已下架" value="4"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="时间:" prop="date">
                <el-date-picker v-model="formInline.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
    name: 'MediumFilter',
    data() {
        return {
            formInline: {
                type: '',
                title: '',
                status: '',
                date: []
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.date = [];
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
            /** 
            if (this.formInline.type.trim() !== '') {
                this.searchOptions.push({
                    field: 'columns',
                    filter: 'LIKE',
                    value: this.formInline.type
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            */
            if (this.formInline.date && this.formInline.date.length > 0) {
                this.searchOptions.push({
                    field: 'date',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.date[0]).format('YYYY-MM-DD'),
                    value2: moment(this.formInline.date[1]).format('YYYY-MM-DD')
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>