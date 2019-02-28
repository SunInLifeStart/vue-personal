<template>
    <div id="SpecMeetingFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="专题会编号">
                <el-input v-model="formInline.numbers" placeholder="请输入专题会编号"></el-input>
            </el-form-item>
            <el-form-item label="文件标题">
                <el-input v-model="formInline.filetitle" placeholder="请输入文件标题"></el-input>
            </el-form-item>
            <el-form-item label="拟稿人">
                <el-input v-model="formInline.drafter" placeholder="请输入拟稿人"></el-input>
            </el-form-item>
            <el-form-item label="拟稿单位">
                <el-input v-model="formInline.draftUnit" placeholder="请输入拟稿单位"></el-input>
            </el-form-item>
            <el-form-item label="单据状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
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
import moment from 'moment';
export default {
    name: 'SpecMeetingFilter',
    data() {
        return {
            formInline: {
                numbers: '',
                filetitle: '',
                drafter: '',
                draftUnit: '',
                status: '',
                options_status: ['已保存', '已驳回', '审核中', '已完成']
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.numbers = '';
            this.formInline.filetitle = '';
            this.formInline.drafter = '';
            this.formInline.draftUnit = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.filetitle.trim() !== '') {
                this.searchOptions.push({
                    field: 'filetitle',
                    filter: 'LIKE',
                    value: this.formInline.filetitle
                });
            }
            if (this.formInline.numbers.trim() !== '') {
                this.searchOptions.push({
                    field: 'numbers',
                    filter: 'LIKE',
                    value: this.formInline.numbers
                });
            }
            if (this.formInline.draftUnit.trim() !== '') {
                this.searchOptions.push({
                    field: 'draftUnit',
                    filter: 'LIKE',
                    value: this.formInline.draftUnit
                });
            }
            if (this.formInline.drafter.trim() !== '') {
                this.searchOptions.push({
                    field: 'drafter',
                    filter: 'LIKE',
                    value: this.formInline.drafter
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            // if (this.formInline.created && this.formInline.created.length > 0) {
            //     this.searchOptions.push({
            //         field: 'created',
            //         filter: 'BETWEEN',
            //         value: moment(this.formInline.created[0]).format(
            //             'YYYY-MM-DD'
            //         ),
            //         value2: moment(this.formInline.created[1]).format(
            //             'YYYY-MM-DD'
            //         )
            //     });
            // }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>