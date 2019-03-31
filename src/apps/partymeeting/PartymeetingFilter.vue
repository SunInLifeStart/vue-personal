<template>
    <div id="PartMeetingFilter">
        <el-form :inline="true" label-width="100px" :model="formInline" class="demo-form-inline">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="党委号编号">
                        <el-input v-model="formInline.numbers" placeholder="编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿单位">
                        <el-input v-model="formInline.draftUnit" placeholder="拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿时间">
                        <el-date-picker v-model="formInline.draftTime" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="formInline.drafter" placeholder="拟稿人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据状态">
                        <el-select v-model="formInline.status" placeholder="请选择">
                            <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="searchBtn">
                    <el-form-item class="positionBtn">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="登记日期">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'PartMeetingFilter',
    data() {
        return {
            formInline: {
                draftUnit: '',
                draftTime: '',
                drafter: '',
                status: '',
                numbers: '',
                options_status: ['已保存', '已驳回', '审核中', '已完成']
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.draftUnit = '';
            this.formInline.draftTime = '';
            this.formInline.drafter = '';
            this.formInline.status = '';
            this.formInline.numbers = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.numbers.trim() !== '') {
                this.searchOptions.push({
                    field: 'numbers',
                    filter: 'EQUAL',
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
            if (this.formInline.draftTime !== '') {
                this.searchOptions.push({
                    field: 'draftTime',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.draftTime).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.draftTime).format(
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
    #PartMeetingFilter {
        .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 100%;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
    }
</style>
<style scoped>
    #PartMeetingFilter >>> .el-form-item__content{
        width: calc(100% - 100px);
    }
</style>