<template>
    <div id="TrainFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="申请人">
                <el-input v-model="formInline.submitter" placeholder="请输入申请人"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
                <el-input v-model="formInline.department" placeholder="请输入所属部门"></el-input>
            </el-form-item>
            <!-- <el-form-item label="提单时间">
                <el-input v-model="formInline.committed" placeholder="请输入提单时间"></el-input>
            </el-form-item>
            <el-form-item label="拟稿单位">
                <el-input v-model="formInline.draftUnit" placeholder="请输入拟稿单位"></el-input>
            </el-form-item>
            <el-form-item label="单据状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item> -->
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
    name: 'TrainFilter',
    data() {
        return {
            formInline: {
                submitter: '',
                department: '',
                committed: '',
                draftUnit: '',
                status: '',
                options_status: ['已保存', '已驳回', '审核中', '已完成']
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.submitter = '';
            this.formInline.department = '';
            // this.formInline.committed = '';
            // this.formInline.draftUnit = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.department.trim() !== '') {
                this.searchOptions.push({
                    field: 'department',
                    filter: 'LIKE',
                    value: this.formInline.department
                });
                //  this.searchOptions.push(this.formInline.department);
            }
            if (this.formInline.submitter.trim() !== '') {
                 this.searchOptions.push({
                    field: 'submitter',
                    filter: 'LIKE',
                    value: this.formInline.submitter
                });
                // this.searchOptions.push( this.formInline.submitter);
            }
           
            // if (this.formInline.status.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'status',
            //         filter: 'EQUAL',
            //         value: this.formInline.status
            //     });
            // }
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