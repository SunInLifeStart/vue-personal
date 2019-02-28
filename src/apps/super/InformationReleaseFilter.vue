<template>
    <div id="PublishFilter">
        <el-form :inline="true" class="demo-form-inline" :model="formInline">
            <el-form-item label="标题:" prop="notice_person">
                <el-input v-model="formInline.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="类型:" style="padding-right: 0px;" prop="notice_status">
                <el-select v-model="formInline.type" placeholder="请选择信息类型">
                    <!-- <el-option label="通知公告" value="通知公告"></el-option> -->
                    <el-option label="政策要闻" value="政策要闻"></el-option>
                    <el-option label="法规制度" value="法规制度"></el-option>
                    <el-option label="宣传教育" value="宣传教育"></el-option>
                    <el-option label="工作动态" value="工作动态"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="单据状态：">
                <el-select v-model="formInline.status" placeholder="请选择" prop="status">
                    <el-option v-for="item in status_options" :key="item.value_status" :label="item.label_status" :value="item.label_status" auto-complete="off"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间:" prop="created">
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
    name: 'PublishFilter',
    data() {
        return {
            formInline: {
                type: '',
                title: '',
                created: '',
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
            this.formInline.type = '';
            // this.formInline.organName = '';
            this.formInline.status = '';
            this.formInline.created = '';
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
                    field: 'type',
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