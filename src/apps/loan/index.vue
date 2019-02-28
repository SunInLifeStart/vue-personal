<template>
    <div id="Loan" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <LoanFilter @searchList="getSearchOptions"></LoanFilter>
                <div class="toolbar">
                    <el-button class="Newly build" type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <LoanList ref="loanList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></LoanList>
            </el-card>
            <br>
            <el-card class="box-card">
                <LoanDetail ref="loanDetail" :formId="formId"></LoanDetail>
            </el-card>
        </div>
        <el-dialog title="借款申请单" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="1240px">
            <LoanForm ref="loanForm" @refreshData="refreshData" @info="getInfo" @saveStatus="saveStatus" :formId="dialogFormId" :operationType="operationType"></LoanForm>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button> -->
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import LoanForm from './LoanForm';
import LoanFilter from './LoanFilter';
import LoanList from './LoanList';
import LoanDetail from './LoanDetail';
export default {
    name: 'Loan',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            showStatus: ''
        };
    },
    components: {
        LoanForm,
        LoanFilter,
        LoanList,
        LoanDetail
    },
    methods: {
        getInfo(info) {
            this.isinfo = info;
            if (this.isinfo == 'success') {
                this.dialogFormVisible = false;
                this.isinfo = '';
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        createForm() {
            this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.loanForm) {
                this.$refs.loanForm.clearForm();
                // this.$refs.loanForm.getNum();
            }
        },
        editForm(id) {
            this.showStatus = '已驳回';
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.loanList.getList();
            this.$refs.loanDetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            this.$refs.loanForm.checkType('saveform');
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.loanForm.checkType('submitform');
        }
    }
};
</script>

<style scoped>
</style>