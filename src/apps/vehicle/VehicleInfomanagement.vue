<template>
    <div id="VehicleInfomanagement" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <VehicleInfomanagementFilter @searchList="getSearchOptions"></VehicleInfomanagementFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <VehicleInfomanagementList :searchOptions="searchOptions" ref="vehicleinfomanagementlist" @formId="getFormId" @editForm="editForm"></VehicleInfomanagementList>
            </el-card>
            <br>
            <el-card class="box-card">
                <VehicleInfomanagementDetail @refreshData="refreshData" ref="VehicleInfomanagementDetail" :formId="formId"></VehicleInfomanagementDetail>
            </el-card>
        </div>
        <el-dialog title="车辆信息" :visible.sync="dialogFormVisible" max-width="1280px" width="70%">
            <VehicleInfomanagementForm @childByValue="childByValue" @refreshData="refreshData" ref="vehicleinfomanagementform" :formId="dialogFormId" :operationType="operationType"></VehicleInfomanagementForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
             <el-button type="default"  @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import VehicleInfomanagementFilter from './VehicleInfomanagementFilter';
import VehicleInfomanagementForm from './VehicleInfomanagementForm';
import VehicleInfomanagementList from './VehicleInfomanagementList';
import VehicleInfomanagementDetail from './VehicleInfomanagementDetail';
export default {
    name: 'VehicleInfomanagement',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            status: '',
            searchOptions:[]
        };
    },
    components: {
        VehicleInfomanagementForm,
        VehicleInfomanagementList,
        VehicleInfomanagementDetail,
        VehicleInfomanagementFilter
    },
    methods: {
        childByValue: function(childValue) {
            this.status = childValue;
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        createForm() {
            this.dialogFormVisible=true;
            this.operationType = 'create'
            if (this.$refs.vehicleinfomanagementform) {
                this.$refs.vehicleinfomanagementform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.vehicleinfomanagementlist.getList();
            this.$refs.VehicleInfomanagementDetail.getForm();
        },
        saveForm(vehicleinfomanagementform) {
            this.$refs.vehicleinfomanagementform.saveForm();
            if (this.status == '成功') {
                this.dialogFormVisible = false;
                this.status = '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>