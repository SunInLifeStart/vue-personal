<template>
    <div id="VehicleFilter">
        <el-form :inline="true" :model="formInline">
            <el-form-item label="单据状态：">
                <el-select v-model="formInline.status" placeholder="请选择状态">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="用车人：">
                <el-input placeholder="用车人" v-model="formInline.transportPpl"></el-input>
            </el-form-item> -->
            <el-form-item label="申请日期：">
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
import cookies from 'js-cookie';
import moment from 'moment';
export default {
    name: 'ApplyFilter',
    data() {
        return {
            formInline: {
                status: '',
                created: []
            },
            searchOptions: []
        };
    },
    mounted() {},
    methods: {
        onReset() {
            this.formInline.status = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            /** 
            this.searchOptions.push({
                field: 'creatorId',
                filter: 'EQUAL',
                value: cookies.get('uid')
            });
            */
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