<template>
    <div id="ForeignAbroad" class="main-container" >
        <div class="content-container">
            <el-card class="box-card">
                <ForeignAbroadFilter @searchList="getSearchOptions"></ForeignAbroadFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <ForeignAbroadList ref="ForeignAbroadList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></ForeignAbroadList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ForeignDetail ref="ForeignAbroaddetail" @refreshData="refreshData" :formId="formId"></ForeignDetail>
            </el-card>
        </div>
        <el-dialog title="因公出国(境)任务申请" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%">
            <ForeignAbroadForm ref="ForeignAbroadform" @refreshData="refreshData" @saveStatus="saveStatus" :formId="dialogFormId" :operationType="operationType"></ForeignAbroadForm>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button> -->
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ForeignAbroadForm from './ForeignAbroadForm';
import ForeignAbroadFilter from './ForeignAbroadFilter';
import ForeignAbroadList from './ForeignAbroadList';
import ForeignDetail from './ForeignDetail';
export default {
    name: 'ForeignAbroad',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            activeName: 'first',
            // showStatus: ''
        };
    },
    components: {
        ForeignAbroadForm,
        ForeignAbroadFilter,
        ForeignAbroadList,
        ForeignDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        createForm() {
            // this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.ForeignAbroadform) {
                this.$refs.ForeignAbroadform.clearForm();
            }
        },
        editForm(id) {
            // this.showStatus = '已驳回';
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.ForeignAbroadList.getList();
            this.$refs.ForeignAbroaddetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            this.$refs.ForeignAbroadform.saveFormValidate();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.ForeignAbroadform.submitCheck();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>