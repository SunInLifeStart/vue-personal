<template>
    <div id="ForeignPlan" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ForeignPlanFilter @searchList="getSearchOptions"></ForeignPlanFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="cleanForm">新建</el-button>
                </div>
                <ForeignPlanList ref="foreignplanlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></ForeignPlanList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ForeignPlanDetail ref="foreignplandetail" :formId="formId"></ForeignPlanDetail>
            </el-card>
        </div>
        <el-dialog title="出国计划申报" :visible.sync="dialogFormVisible" max-width="1280px" width="80%" :close-on-click-modal="false">
            <ForeignPlanForm ref="foreignplanform" @saveStatus="saveStatus" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></ForeignPlanForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ForeignPlanForm from './ForeignPlanForm';
import ForeignPlanFilter from './ForeignPlanFilter';
import ForeignPlanList from './ForeignPlanList';
import ForeignPlanDetail from './ForeignPlanDetail';
export default {
    name: 'ForeignPlan',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create'
        };
    },
    components: {
        ForeignPlanForm,
        ForeignPlanFilter,
        ForeignPlanList,
        ForeignPlanDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
            if (this.$refs.foreignplanform) {
                this.$refs.foreignplanform.getForm();
            }
        },
        refreshData() {
            this.$refs.foreignplanlist.getList();
            this.$refs.foreignplandetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            // this.$refs.foreignplanform.saveFormValidate();
            this.$refs.foreignplanform.saveForm();
        },
        submitForm() {
            this.$refs.foreignplanform.submitCheck();
        },
        cleanForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.foreignplanform) {
                this.$refs.foreignplanform.cleanForm();
            }
        }
    }
};
</script>
<style lang="scss">
</style>