<template>
    <div id="DiscussionFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="文件标题">
                <el-input v-model="formInline.filetitle" placeholder="请输入文件标题"></el-input>
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
    name: 'DiscussionFilter',
    data() {
        return {
            formInline: {
                filetitle: '',
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
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>