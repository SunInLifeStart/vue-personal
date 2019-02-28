<template>
    <div id="Medium" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <MediumFilter @searchList="getSearchOptions"></MediumFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="clearForm()">新建</el-button>
                </div>
                <MediumList ref="mediumList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></MediumList>
            </el-card>
            <br>
            <el-card class="box-card">
                <MediumDetail :formId="formId" ref="governmentdeyail"></MediumDetail>
            </el-card>

        </div>
        <el-dialog title="媒体报道" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <MediumForm ref="mediumForm" @saveStatus="saveStatus" @refreshDetail="refreshDetail" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></MediumForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import MediumForm from './MediumForm';
import MediumFilter from './MediumFilter';
import MediumList from './MediumList';
import MediumDetail from './MediumDetail';
export default {
    name: 'Medium',
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
        MediumForm,
        MediumFilter,
        MediumList,
        MediumDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshDetail() {
            if (this.$refs.governmentdeyail) {
                this.$refs.governmentdeyail.getForm();
            }
        },
        refreshData() {
            this.$refs.mediumList.getList();
        },
        saveForm() {
            this.$refs.mediumForm.saveFormValidate();
        },
        submitForm() {
            this.$refs.mediumForm.submitCheck();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        clearForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.mediumForm) {
                this.$refs.mediumForm.clearForm();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>