<template>
    <div id="Government" class="main-container">
        <div class="content-container">

            <el-card class="box-card">
                <GovernmentFilter @searchList="getSearchOptions"></GovernmentFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="clearForm()">新建</el-button>
                </div>
                <GovernmentList ref="governmentList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></GovernmentList>
            </el-card>
            <br>
            <el-card class="box-card">
                <GovernmentDatil :formId="formId" ref="governmentdeyail"></GovernmentDatil>
            </el-card>

        </div>
        <el-dialog title="政务采用" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <GovernmentForm ref="governmentForm" @saveStatus="saveStatus" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType"></GovernmentForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <!-- <el-button type="primary" @click="submitForm">提交</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import GovernmentForm from './GovernmentForm';
import GovernmentFilter from './GovernmentFilter';
import GovernmentList from './GovernmentList';
import GovernmentDatil from './GovernmentDatil';
export default {
    name: 'Government',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            activeName: 'first'
        };
    },
    components: {
        GovernmentForm,
        GovernmentFilter,
        GovernmentList,
        GovernmentDatil
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        refreshDetail() {
            if (this.$refs.governmentdeyail) {
                this.$refs.governmentdeyail.getForm();
            }
        },
        getFormId(id) {
            this.formId = id;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.governmentList.getList();
        },
        saveForm() {
            this.$refs.governmentForm.saveFormValidate();
        },
        submitForm() {
            this.$refs.governmentForm.submitCheck();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        clearForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.governmentForm) {
                this.$refs.governmentForm.clearForm();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>