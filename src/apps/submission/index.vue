<template>
    <div id="Submission" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <SubmissionFilter @searchList="getSearchOptions"></SubmissionFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <SubmissionList ref="submissionlist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></SubmissionList>
            </el-card>
            <br>
            <el-card class="box-card">
                <SubmissionDetail ref="submissionDetail" :formId="formId"></SubmissionDetail>
            </el-card>
        </div>
        <el-dialog title="部门呈报" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false" @close='closeDialog'>
            <SubmissionForm ref="submissionform" @info="getInfo" @refreshData="refreshData" @saveStatus="saveStatus" :formId="dialogFormId" :operationType="operationType"></SubmissionForm>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="default" @click="saveForm" v-if="this.status == ''">保存</el-button> -->
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import SubmissionForm from './SubmissionForm';
import SubmissionFilter from './SubmissionFilter';
import SubmissionList from './SubmissionList';
import SubmissionDetail from './SubmissionDetail';
export default {
    name: 'Submission',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            isinfo: '',
            status: ''
        };
    },
    components: {
        SubmissionForm,
        SubmissionFilter,
        SubmissionList,
        SubmissionDetail
    },
    methods: {
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        createForm() {
            this.status = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.submissionform) {
                this.$refs.submissionform.clearForm();
            }
        },
        getFormId(id) {
            this.formId = id;
        },
        getInfo(info) {
            this.isinfo = info;
            if (this.isinfo == 'success') {
                this.dialogFormVisible = false;
                this.isinfo = '';
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.submissionlist.getList();
            this.$refs.submissionDetail.getForm();
            this.$refs.submissionDetail.getActions();
            this.$refs.submissionDetail.getCrumbs();
        },
        saveForm() {
            this.$refs.submissionform.saveFormValidate();
        },
        submitForm() {
            this.$refs.submissionform.saveFormValidate('save');
        },
        cancelForm() {
            this.$refs.submissionform.cancelForm();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        closeDialog() {
            this.$refs.submissionform.clearTime();
        }
    }
};
</script>
<style lang="scss">
</style>