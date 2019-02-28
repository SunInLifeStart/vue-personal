<template>
    <div id="AssetFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="申请人：">
                <el-input placeholder="申请人" v-model="formInline.proposer"></el-input>
            </el-form-item>
            <el-form-item label="申请部门：">
                <el-input placeholder="申请部门" v-model="formInline.applyDept "></el-input>
            </el-form-item>
            <el-form-item label="单据状态：" prop="status">
                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                    <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请时间：">
                <div class="block">
                    <el-date-picker v-model="formInline.applyDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="onSubmit">查询</el-button>
                <el-button type="primary" v-on:click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
/* eslint-disable */
import moment from 'moment';
import { CONFIG } from '../data.js';
export default {
    name: 'AssetFilter',
    data() {
        return {
            formInline: {
                proposer: '',
                applyDept: '',
                applyDate: [],
                status: ''
            },
            searchOptions: [],
            statusAll: CONFIG['status']
        };
    },
    methods: {
        onReset() {
            this.formInline.proposer = '';
            this.formInline.applyDept = '';
            this.formInline.applyDate = [];
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.proposer.trim() !== '') {
                this.searchOptions.push({
                    field: 'proposer',
                    filter: 'LIKE',
                    value: this.formInline.proposer
                });
            }
            if (this.formInline.applyDept.trim() !== '') {
                this.searchOptions.push({
                    field: 'applyDept',
                    filter: 'LIKE',
                    value: this.formInline.applyDept
                });
            }
            if (
                this.formInline.applyDate &&
                this.formInline.applyDate.length > 0
            ) {
                this.searchOptions.push({
                    field: 'applyDate',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.applyDate[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.applyDate[1]).format(
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