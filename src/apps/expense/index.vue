<template>
    <div id="Expense" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ExpenseFilter @searchList="getSearchOptions"></ExpenseFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <ExpenseList ref="expenselist" @showStatus="showStatusMethod" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></ExpenseList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ExpenseDetail ref="expensedetail" @refreshExpenseList="refreshData" :formId="formId"></ExpenseDetail>
            </el-card>
        </div>
        <el-dialog title="报销单" :visible.sync="dialogFormVisible" width="1240px" :close-on-click-modal="false">
            <ExpenseForm @deleteItem="deleteItem" @refreshDetail="refreshDetail" @refreshData="refreshData" @bottomShow="bottomShow" @saveStatus="saveStatus" ref="expenseform" :formId="dialogFormId" :operationType="operationType"></ExpenseForm>
            <div slot="footer" class="dialog-footer" v-show="this.showBootm">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ExpenseForm from './ExpenseForm';
import ExpenseFilter from './ExpenseFilter';
import ExpenseList from './ExpenseList';
import ExpenseDetail from './ExpenseDetail';
export default {
    name: 'Expense',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            showBootm: false,
            showStatus: ''
        };
    },
    components: {
        ExpenseForm,
        ExpenseFilter,
        ExpenseList,
        ExpenseDetail
    },
    methods: {
        bottomShow(type) {
            this.showBootm = type;
        },
        deleteItem() {
            if (this.$refs.expensedetail) {
                this.$refs.expensedetail.getForm();
            }
        },
        refreshDetail() {
            if (this.$refs.expensedetail) {
                this.$refs.expensedetail.getForm();
                this.$refs.expensedetail.getActions();
            }
        },
        showStatusMethod(status) {
            if (status == '已保存') {
                this.showStatus = '';
            } else {
                this.showStatus = '已驳回';
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
            this.showBootm = false;
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.expenseform) {
                this.$refs.expenseform.clearForm();
            }
        },
        editForm(id) {
            this.showStatus = '已驳回';
            this.showBootm = true;
            this.operationType = 'edit';
            /** 
            if (this.$refs.expenseform) {
                this.$refs.expenseform.clearForm();
            }
            */
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            if (this.$refs.expenseform) {
                this.$refs.expenseform.getForm();
            }
        },
        refreshData() {
            this.$refs.expenselist.getList();
        },
        saveForm() {
            this.$refs.expenseform.rulesChecktwo('saveform');
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.expenseform.rulesChecktwo('submitform');
        }
    }
};
</script>
<style lang="scss" scoped>
</style>