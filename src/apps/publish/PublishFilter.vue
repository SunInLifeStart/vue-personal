<template>
    <div id="PublishFilter">
        <el-form :inline="true" class="demo-form-inline" :model="formInline">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="标题:" prop="notice_person">
                        <el-input v-model="formInline.title" placeholder="标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="信息类型:" style="padding-right: 0px;">
                        <el-select v-model="formInline.type" placeholder="请选择信息类型">
                            <el-option label="领导讲话" value="领导讲话"></el-option>
                            <el-option label="规章制度" value="规章制度"></el-option>
                            <el-option label="通知公告" value="通知公告"></el-option>
                            <el-option label="工作简报" value="工作简报"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据状态:" style="padding-right: 0px;">
                        <el-select v-model="formInline.status" placeholder="请选择状态">
                            <el-option label="已保存" value="已保存"></el-option>
                            <el-option label="审核中" value="审核中"></el-option>
                            <el-option label="已驳回" value="已驳回"></el-option>
                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="时间:" prop="created">
                        <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>


<script>
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'PublishFilter',
    data() {
        return {
            formInline: {
                creatorName: this.$store.getters.LoginData.uname,
                type: '',
                title: '',
                status: '',
                created: []
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.type = '';
            this.formInline.title = '';
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
<style lang="scss" scoped>
    #PublishFilter {
        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
            width: 300px;
        }
    }
</style>