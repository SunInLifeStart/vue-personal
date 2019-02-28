<template>
    <div id="MotionFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="文件标题">
                <el-input v-model="formInline.title" placeholder="文件标题"></el-input>
            </el-form-item>
            <el-form-item label="拟稿人">
                <el-input v-model="formInline.creatorName" placeholder="拟稿人"></el-input>
            </el-form-item>
            <el-form-item label="拟稿单位">
                <el-input v-model="formInline.organName" placeholder="拟稿单位"></el-input>
            </el-form-item>
            <el-form-item label="单据状态：">
                <el-select clearable  v-model="formInline.status" placeholder="请选择" prop="status">
                    <el-option v-for="item in status_options" :key="item.value_status" :label="item.label_status" :value="item.label_status" auto-complete="off"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拟稿时间">
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
    name: 'MotionFilter',
    data() {
        return {
            formInline: {
                title: '',
                creatorName: '',
                organName: '',
                created: [],
                status:'',
            },
            searchOptions: [],
            status_options: [
                {
                    value_status: '1',
                    label_status: '已保存'
                },
                {
                    value_status: '2',
                    label_status: '审核中'
                },
                {
                    value_status: '3',
                    label_status: '已完成'
                },
                {
                    value_status: '4',
                    label_status: '已驳回'
                }
            ]
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.creatorName = '';
            this.formInline.organName = '';
            this.formInline.status = '';
            this.formInline.created = '';
            this.onSubmit();
        },
        onSubmit () {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    'field': 'title',
                    'filter': 'LIKE',
                    'value': this.formInline.title
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    'field': 'creatorName',
                    'filter': 'LIKE',
                    'value': this.formInline.creatorName
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    'field': 'organName',
                    'filter': 'LIKE',
                    'value': this.formInline.organName
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
                    'field': 'created',
                    'filter': 'BETWEEN',
                    'value': moment(this.formInline.created[0]).format('YYYY-MM-DD'),
                    'value2': moment(this.formInline.created[1]).format('YYYY-MM-DD')
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>