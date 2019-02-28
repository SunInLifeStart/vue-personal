<template>
    <div id="travelFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="提单人">
                <el-input v-model="formInline.submitter" placeholder="提单人"></el-input>
            </el-form-item>
            <el-form-item label="费用承担部门">
                <el-input v-model="formInline.subOrganName" placeholder="费用承担部门"></el-input>
            </el-form-item>
            <!--  <el-form-item label="拟稿单位">
                <el-input v-model="formInline.draftUnit" placeholder="拟稿单位"></el-input>
            </el-form-item> -->
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提单时间">
                <el-date-picker v-model="formInline.submitted" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
import cookies from 'js-cookie';
export default {
    name: 'travelFilter',
    data() {
        return {
            formInline: {
                // creatorName:cookies.get('uname'),
                submitter: '',
                subOrganName: '',
                submitted: '',
                status: ''
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.submitter = '';
            this.formInline.subOrganName = '';
            this.formInline.submitted = [];
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.submitter.trim() !== '') {
                this.searchOptions.push({
                    field: 'submitter',
                    filter: 'LIKE',
                    value: this.formInline.submitter
                });
            }
            if (this.formInline.subOrganName.trim() !== '') {
                this.searchOptions.push({
                    field: 'subOrganName',
                    filter: 'LIKE',
                    value: this.formInline.subOrganName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            // if (this.formInline.organName.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'organName',
            //         filter: 'LIKE',
            //         value: this.formInline.organName
            //     });
            // }
            if (
                this.formInline.submitted &&
                this.formInline.submitted.length > 0
            ) {
                this.searchOptions.push({
                    field: 'submitted',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.submitted[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.submitted[1]).format(
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