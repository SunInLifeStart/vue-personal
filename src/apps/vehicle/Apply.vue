<template>
    <div class="content-container">
        <el-card class="box-card">
            <VehicleFilter @searchList="getSearchOptions"></VehicleFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createForm()">新建</el-button>
            </div>
            <VehicleList ref="ApplyList" @showStatus="showStatus" @tianjinhuidan="gettianjinhuidan" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></VehicleList>
        </el-card>
        <br>
        <el-card class="box-card">
            <VehicleDetail ref="applydetail" :formId="formId"></VehicleDetail>
        </el-card>
        <el-dialog title="用车申请" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <VehicleForm @saveStatuss="saveStatuss" @refreshDetail="refreshDetail" @refreshData="refreshData" ref="ApplyForm" :formId="dialogFormId" :operationType="operationType"></VehicleForm>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="default" v-if="this.status == ''" @click="saveForm">保存</el-button> -->
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
        <el-dialog title="回车单信息" :visible.sync="dialogFormVisible2" max-width="1280px" width="70%" :close-on-click-modal="false">
            <EnterForm @refreshData="refreshData" @saveStatus="saveStatus" ref="EnterForm" :formId="dialogFormId" :aaa="aaa"></EnterForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveEnterForm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import VehicleForm from './VehicleForm';
import VehicleFilter from './VehicleFilter';
import VehicleList from './VehicleList';
import VehicleDetail from './VehicleDetail';
import EnterForm from './EnterForm';
export default {
    name: 'Apply',
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisible2: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            aaa: '',
            status: ''
        };
    },
    components: {
        VehicleForm,
        VehicleFilter,
        VehicleList,
        VehicleDetail,
        EnterForm
    },
    methods: {
        refreshDetail() {
            if (this.$refs.applydetail) {
                this.$refs.applydetail.getForm();
                this.$refs.applydetail.getActions();
            }
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        saveStatuss(status) {
            this.dialogFormVisible = status;
        },
        saveStatus(status) {
            this.dialogFormVisible2 = status;
        },
        createForm() {
            this.status = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.ApplyForm) {
                this.$refs.ApplyForm.clearForm();
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        gettianjinhuidan(id) {
            this.aaa = id;
            this.dialogFormVisible2 = true;
            if (this.$refs.EnterForm) {
                this.$refs.EnterForm.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },

        refreshData() {
            this.$refs.ApplyList.getList();
            this.$refs.applydetail.getForm();
        },
        saveForm() {
            this.$refs.ApplyForm.saveForm();
            // this.dialogFormVisible = false;
        },
        saveEnterForm() {
            this.$refs.EnterForm.saveForm();
            this.dialogFormVisible2 = false;
        },
        submitForm() {
            this.$refs.ApplyForm.submitCheck();
        }
    }
};
</script>