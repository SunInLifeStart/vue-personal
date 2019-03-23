<template>
    <div id="Incoming" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <IncomingFilter @searchList="getSearchOptions"></IncomingFilter>
            </el-card>
            <el-card class="box-card card_margin_10">
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <IncomingList ref="incominglist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></IncomingList>
            </el-card>
            <el-card class="box-card card_margin_10">
                <IncomingDetail :formId="formId" ref="incomingdetail"></IncomingDetail>
            </el-card>
        </div>
        <el-dialog title="收文" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <IncomingForm @refreshDetail="refreshDetail" @refreshData="refreshData" @saveStatus="saveStatus" ref="incomingform" :formId="dialogFormId" :operationType="operationType"></IncomingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm" v-if="this.status == ''">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import IncomingForm from './IncomingForm';
import IncomingFilter from './IncomingFilter';
import IncomingList from './IncomingList';
import IncomingDetail from './IncomingDetail';
export default {
    name: 'Incoming',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            status: ''
        };
    },
    components: {
        IncomingForm,
        IncomingFilter,
        IncomingList,
        IncomingDetail
    },
    methods: {
        refreshDetail() {
            if (this.$refs.incomingdetail) {
                this.$refs.incomingdetail.getForm();
                this.$refs.incomingdetail.getActions();
                this.$refs.incomingdetail.getCrumbs();
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        getFormId(id) {
            this.formId = id;
        },
        createForm() {
            this.status = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.incomingform) {
                this.$refs.incomingform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.incominglist.getList();
        },
        saveForm() {
            this.$refs.incomingform.saveFormValidate();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.incomingform.submitCheck();
        }
    }
};
</script>
<style lang="scss" scoped>
    #Incoming {
        .card_margin_10 {
            margin-top: 10px;
        }
    }
</style>