<template>
    <div id="Special" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <SpecialFilter @searchList="getSearchOptions"></SpecialFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="clearForm">新建</el-button>
                </div>
                <SpecialList ref="Speciallist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></SpecialList>
            </el-card>
            <br>
            <el-card class="box-card">
                <SpecialDetail ref="SpecialDetail" :formId="formId"></SpecialDetail>
            </el-card>
        </div>
        <el-dialog title="下发文件" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <SpecialForm ref="specialform" @refreshDetail="refreshDetail" @saveStatus="saveStatus" @info="getInfo" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></SpecialForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <!--
                <el-button type="primary" @click="submitForm">提交</el-button>
                -->
                <!-- <el-button type="default" @click="cancelForm" v-show="operationType!== 'create'">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import SpecialForm from './SpecialForm';
import SpecialFilter from './SpecialFilter';
import SpecialList from './SpecialList';
import SpecialDetail from './SpecialDetail';
export default {
    name: 'Special',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            isinfo: ''
        };
    },
    components: {
        SpecialForm,
        SpecialFilter,
        SpecialList,
        SpecialDetail
    },
    methods: {
        refreshDetail() {
            if (this.$refs.SpecialDetail) {
                this.$refs.SpecialDetail.getForm();
                //this.$refs.SpecialDetail.getActions();
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        clearForm() {
            this.operationType = 'create';
            this.dialogFormVisible = true;
            if (this.$refs.specialform) {
                this.$refs.specialform.cleanForm();
            }
        },
        getFormId(id) {
            this.formId = id;
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
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
            this.$refs.Speciallist.getList();
            this.$refs.SpecialDetail.getForm();
        },
        saveForm() {
            this.$refs.specialform.saveFormValidate();
        },
        submitForm() {
            this.$refs.specialform.submitCheck();
            // this.dialogFormVisible = false;
        },
        cancelForm() {
            this.$refs.specialform.cancelForm();
        }
    }
};
</script>
<style lang="scss">
</style>