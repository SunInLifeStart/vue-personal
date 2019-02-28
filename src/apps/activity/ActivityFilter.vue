<template>
    <div id="ActivityFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="活动名称">
                <el-input v-model="formInline.title" placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item label="活动时间">
                <el-date-picker v-model="formInline.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="活动地点">
                <el-input v-model="formInline.place" placeholder="活动地点"></el-input>
            </el-form-item>
            <el-form-item label="上报单位">
                <el-input v-model="formInline.organName" placeholder="上报单位"></el-input>
            </el-form-item>
            <el-form-item label="联合上报单位">
                <el-input v-model="formInline.combinedUnit" placeholder="联合上报单位"></el-input>
            </el-form-item>
            <el-form-item label="单据状态：">
                <el-select v-model="formInline.status" placeholder="请选择" prop="status">
                    <el-option v-for="item in status_options" :key="item.value_status" :label="item.label_status" :value="item.label_status" auto-complete="off"></el-option>
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
export default {
    name: 'ActivityFilter',
    data() {
        return {
            formInline: {
                title: '',
                place: '',
                organName: '',
                combinedUnit: '',
                time: [],
                status:""
            },
             status_options: [
                {
                    value_status: '1',
                    label_status: '已备案'
                },
                {
                    value_status: '2',
                    label_status: '已报告'
                },
                // {
                //     value_status: '3',
                //     label_status: '已完成'
                // },
                // {
                //     value_status: '4',
                //     label_status: '已驳回'
                // }
            ],
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.time = [];
            this.formInline.title = '';
            this.formInline.place = '';
            this.formInline.organName = '';
            this.formInline.combinedUnit = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit () {
            // this.searchOptions = [{
            //     'field': 'canceled',
            //     'filter': 'IS_NULL'
            // }];
            this.searchOptions =[];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    'field': 'title',
                    'filter': 'LIKE',
                    'value': this.formInline.title
                });
            }
            if (this.formInline.place.trim() !== '') {
                this.searchOptions.push({
                    'field': 'place',
                    'filter': 'LIKE',
                    'value': this.formInline.place
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    'field': 'organName',
                    'filter': 'LIKE',
                    'value': this.formInline.organName
                });
            }
            if (this.formInline.combinedUnit.trim() !== '') {
                this.searchOptions.push({
                    'field': 'combinedUnit',
                    'filter': 'LIKE',
                    'value': this.formInline.combinedUnit
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            if (this.formInline.time && this.formInline.time.length > 0) {
                this.searchOptions.push({
                    'field': 'time',
                    'filter': 'BETWEEN',
                    'value': moment(this.formInline.time[0]).format('YYYY-MM-DD'),
                    'value2': moment(this.formInline.time[1]).format('YYYY-MM-DD')
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>