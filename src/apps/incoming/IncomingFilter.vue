<template>
    <div id="IncomingFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="公文标题">
                <el-input v-model="formInline.title" placeholder="公文标题"></el-input>
            </el-form-item>
            <el-form-item label="来文机关">
                <el-input v-model="formInline.organ" placeholder="来文机关"></el-input>
            </el-form-item>
            <el-form-item label="来文字号">
                <el-input v-model="formInline.wordNo" placeholder="来文字号"></el-input>
            </el-form-item>
            <el-form-item label="单据状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收文日期">
                <el-date-picker v-model="formInline.created" placeholder="收文日期"></el-date-picker>
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
import moment from "moment";
export default {
    name: "IncomingFilter",
    data() {
        return {
            formInline: {
                title: "",
                creatorName: "",
                organName: "",
                status: "",
                created: '',
                organ: "",
                wordNo: "",
                options_status:[
                    "已保存",
                    "已驳回",
                    "审核中",
                    "已完成",
                ]
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.title = '';
            this.formInline.organ = '';
            this.formInline.wordNo = '';
            this.formInline.status = '';
            this.formInline.created = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== "") {
                this.searchOptions.push({
                    field: "title",
                    filter: "LIKE",
                    value: this.formInline.title
                });
            }
            if (this.formInline.organ.trim() !== "") {
                this.searchOptions.push({
                    field: "organ",
                    filter: "LIKE",
                    value: this.formInline.organ
                });
            }
            if (this.formInline.wordNo.trim() !== "") {
                this.searchOptions.push({
                    field: "wordNo",
                    filter: "LIKE",
                    value: this.formInline.wordNo
                });
            }
            if (this.formInline.status.trim() !== "") {
                this.searchOptions.push({
                    field: "status",
                    filter: "EQUAL",
                    value: this.formInline.status
                });
            }
            if (this.formInline.created) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created).format('YYYY-MM-DD'),
                    value2: moment(this.formInline.created).format('YYYY-MM-DD')
                });
            }
            this.$emit("searchList", this.searchOptions);
        }
    }
};
</script>