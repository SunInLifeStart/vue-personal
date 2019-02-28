<template>
    <div id="IncomingFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="年度">
                <el-select v-model="formInline.yearStatus" placeholder="">
                    <el-option v-for="item in formInline.options_status1" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="月度">
                <el-select v-model="formInline.quarterStatus" placeholder="">
                    <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import moment from "moment";
export default {
    name: "fundplanplanpFilter",
    data() {
        return {
            formInline: {
                options_status1:[
                    "请选择年份",
                    "2020年",
                    "2019年",
                    "2018年",
                    "2017年",
                    "2016年",
                    "2015年",
                    "2014年",
                    "2013年",
                    "2012年",
                    "2011年",
                    "2010年",
                ],
                options_status:[
                    "全部",
                    "01月",
                    "02月",
                    "03月",
                    "04月",
                    "05月",
                    "06月",
                    "07月",
                    "08月",
                    "09月",
                    "10月",
                    "11月",
                    "12月",
                ]
            },
            searchOptions: []
        };
    },
    methods: {
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.yearStatus != '' && this.formInline.yearStatus != undefined) {
                this.searchOptions.push(this.formInline.yearStatus)
            }
            if (this.formInline.quarterStatus != '' && this.formInline.yearStatus != undefined) {
                this.searchOptions.push(this.formInline.quarterStatus)
            }
            // if (this.formInline.title.trim() !== "") {
            //     this.searchOptions.push({
            //         field: "title",
            //         filter: "LIKE",
            //         value: this.formInline.title
            //     });
            // }
            // if (this.formInline.organ.trim() !== "") {
            //     this.searchOptions.push({
            //         field: "organ",
            //         filter: "EQUAL",
            //         value: this.formInline.organ
            //     });
            // }
            // if (this.formInline.wordNo.trim() !== "") {
            //     this.searchOptions.push({
            //         field: "wordNo",
            //         filter: "EQUAL",
            //         value: this.formInline.wordNo
            //     });
            // }
            // if (this.formInline.status.trim() !== "") {
            //     this.searchOptions.push({
            //         field: "status",
            //         filter: "EQUAL",
            //         value: this.formInline.status
            //     });
            // }
            // if (this.formInline.created) {
            //     this.searchOptions.push({
            //         field: 'created',
            //         filter: 'BETWEEN',
            //         value:formInline.created
            //     });
            // }
            this.$emit("searchList", this.searchOptions);
        }
    }
};
</script>