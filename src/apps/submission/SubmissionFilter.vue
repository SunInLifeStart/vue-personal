<template>
    <div id="SubmissionFilter">
        <el-form :inline="true" :model="formInline" label-width="100px"  label-position="left"  class="demo-form-inline">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="呈报件编号：">
                        <el-input v-model="formInline.submissionNo" placeholder="呈报件编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件标题：">
                        <el-input v-model="formInline.title" placeholder="文件标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据状态：">
                        <el-select v-model="formInline.status" placeholder="请选择">
                            <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿时间：">
                        <el-date-picker v-model="formInline.draftTime" type="date" @change="formatTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button type="primary" @click="resetOptions">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="拟稿人：">
                <el-input v-model="formInline.draftUser" placeholder="拟稿人"></el-input>
            </el-form-item> -->
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'SubmissionFilter',
    data() {
        return {
            formInline: {
                submissionNo: '',
                title: '',
                // draftUser: this.cookie_oname,
                draftTime: '',
                status: '',
                options_status: ['已保存', '已驳回', '审核中', '已完成']
            },
            searchOptions: [],
            // cookie_oname: '',
            cookie_uname: ''
        };
    },
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(';');

        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.formInline.draftUser = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    methods: {
        resetOptions() {
            this.formInline = {
                submissionNo: '',
                title: '',
                draftTime: '',
                status: '',
                options_status: ['已保存', '已驳回', '审核中', '已完成']
            };
            this.onSubmit();
        },
        formatTime(date) {
            this.draftTime = date;
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.submissionNo.trim() !== '') {
                this.searchOptions.push({
                    field: 'submissionNo',
                    filter: 'LIKE',
                    value: this.formInline.submissionNo
                });
            }
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            // if (this.formInline.draftUser.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'draftUser',
            //         filter: 'LIKE',
            //         value: this.formInline.draftUser
            //     });
            // }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            if (this.formInline.draftTime) {
                this.searchOptions.push({
                    field: 'draftTime',
                    filter: 'BETWEEN',
                    value: this.formInline.draftTime,
                    value2: this.formInline.draftTime
                });
            }

            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>