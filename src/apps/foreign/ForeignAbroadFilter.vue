<template>
    <div id="ForeignFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="出境时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="组团名称">
                <el-input v-model="formInline.groupName"></el-input>
            </el-form-item>
            <el-form-item label="登录人">
                <el-input v-model="formInline.creatorName"></el-input>
            </el-form-item>
            <el-form-item label="单据状态：">
                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="请选择">
                    <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
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
import { CONFIG } from '../data.js';
export default {
    name: 'ForeignFilter',
    data() {
        return {
            formInline: {
                groupName: '',
                creatorName: '',
                created: [],
                status: ''
            },
            searchOptions: [],
            statusAll: CONFIG['status']
        };
    },
    methods: {
        onReset() {
            this.formInline.groupName = '';
            this.formInline.created = [];
            this.formInline.creatorName = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.groupName.trim() !== '') {
                this.searchOptions.push({
                    field: 'groupName',
                    filter: 'LIKE',
                    value: this.formInline.groupName
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
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
<style lang="scss" scoped>
</style>