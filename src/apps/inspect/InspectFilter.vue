<template>
    <div id="InspectFilter">
        <el-form :inline="true" class="demo-form-inline" :model="formInline">
            <el-form-item label="标题：" prop="title">
                <el-input v-model="formInline.title"></el-input>
            </el-form-item>
            <el-form-item label="立项人：" prop="definer">
                <el-input v-model="formInline.definer"></el-input>
            </el-form-item>
            <el-form-item label="被督办部门负责人：" prop="inspector">
                <el-input v-model="formInline.inspector"></el-input>
            </el-form-item>
            <el-form-item label="单据状态：" prop="status">
                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
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
/* eslint-disable */
import { CONFIG } from '../data.js';
export default {
    name: 'InspectFilter',
    data() {
        return {
            formInline: {
                title: '',
                definer: '',
                inspector: '',
                status: ''
            },
            searchOptions: [],
            statusAll: CONFIG['status']
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.definer = '';
            this.formInline.inspector = '';
            this.formInline.status = '';
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
            if (this.formInline.definer.trim() !== '') {
                this.searchOptions.push({
                    field: 'definer',
                    filter: 'LIKE',
                    value: this.formInline.definer
                });
            }
            if (this.formInline.inspector.trim() !== '') {
                this.searchOptions.push({
                    field: 'inspector',
                    filter: 'LIKE',
                    value: this.formInline.inspector
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