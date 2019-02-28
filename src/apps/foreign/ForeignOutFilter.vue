<template>
    <div id="ForeignOutFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标题：">
                <el-input v-model="formInline.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="集团部门/子公司名称：">
                <el-input v-model="formInline.organName" placeholder="集团部门/子公司名称"></el-input>
            </el-form-item>
            <el-form-item label="申请人：">
                <el-input v-model="formInline.creatorName" placeholder="申请人"></el-input>
            </el-form-item>
            <el-form-item label="申请日期：">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="目的地：">
                <el-input v-model="formInline.title" placeholder="目的地"></el-input>
            </el-form-item>
            <el-form-item label="负责人：">
                <el-input v-model="formInline.organName" placeholder="负责人"></el-input>
            </el-form-item>
            <el-form-item label="出境时间：">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" v-on:click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ForeignOutFilter',
    data() {
        return {
            formInline: {
                title: '',
                organName: '',
                created: [],
                creatorName: ''
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.organName = '';
            this.formInline.created = '';
            this.formInline.creatorName = '';
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
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
                });
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format('YYYY-MM-DD'),
                    value2: moment(this.formInline.created[1]).format('YYYY-MM-DD')
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>