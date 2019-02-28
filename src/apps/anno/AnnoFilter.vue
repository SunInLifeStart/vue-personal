<template>
    <div id="AnnoFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="经办部门/子公司">
                <el-select style="width:100%;" v-model="formInline.organName" placeholder="请选择">
                    <el-option v-for="item in combinedUnit" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="信息披露主要内容">
                <el-input v-model="formInline.title" placeholder="内容"></el-input>
            </el-form-item>
            <el-form-item label="单据状态:" style="padding-right: 0px;">
                <el-select v-model="formInline.status" placeholder="请选择状态">
                    <el-option label="已保存" value="已保存"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="已驳回" value="已驳回"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
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
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'AnnoFilter',
    data() {
        return {
            formInline: {
                creatorName: this.$store.getters.LoginData.uname,
                title: '',
                organName: '',
                created: [],
                status: ''
            },
            searchOptions: [],
            combinedUnit: [
                '党委办公室集团办公室',
                '董事会办公室',
                '党群工作部',
                '资本运营部',
                '风险管理部',
                '科技金融事业部/中科金',
                '组织部人力资源部',
                '宣传部品牌管理部',
                '纪检监察部',
                '战略管理部',
                '资金财务部',
                '科技园区事业部',
                '产业投资部',
                '海外业务部',
                '区域合作部'
            ]
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.created = [];
            this.formInline.organName = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            /** 
            if (this.formInline.creatorName.trim !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'EQUAL',
                    value: this.$store.getters.LoginData.uname
                });
            }
            */
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organ',
                    filter: 'LIKE',
                    value: this.formInline.organName
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