<template>
    <div id="Anno" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <AnnoFilter @searchList="getSearchOptions"></AnnoFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                    <!-- <el-button type="primary" @click="printForm">打印</el-button>-->
                </div>
                <AnnoList ref="annolist" @formId="getFormId" @showStatus="showStatusAnno" @editForm="editForm" :searchOptions="searchOptions"></AnnoList>
            </el-card>
            <br>
            <el-card class="box-card">
                <AnnoDetail :formId="formId" ref="annodetail"></AnnoDetail>
            </el-card>
        </div>
        <el-dialog title="信息披露" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <AnnoForm @refreshData="refreshData" @saveStatus="saveStatus" @refreshDetail="refreshDetail" ref="annoform" :formId="dialogFormId" :operationType="operationType"></AnnoForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable 
this.$printContent(id);
*/
import AnnoForm from './AnnoForm';
import AnnoFilter from './AnnoFilter';
import AnnoList from './AnnoList';
import AnnoDetail from './AnnoDetail';
export default {
    name: 'Anno',
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
        AnnoForm,
        AnnoFilter,
        AnnoList,
        AnnoDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        refreshDetail(type) {
            if (this.$refs.annodetail) {
                this.$refs.annodetail.getForm();
                this.$refs.annodetail.getActions();
            }
        },
        showStatusAnno(status) {
            if (status == '已保存') {
                this.showStatus = '';
            } else {
                this.showStatus = '已驳回';
            }
        },
        createForm() {
            this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.annoform) {
                this.$refs.annoform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.annolist.getList();
        },
        saveForm() {
            this.$refs.annoform.saveFormValidate();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.annoform.submitCheck();
        },
        printForm() {
            this.$refs.annodetail.printForm();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>