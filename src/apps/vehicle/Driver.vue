<template>
    <div id="Driver" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <DriverFilter @searchList="getSearchOptions"></DriverFilter>
                <!--
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                -->
                <DriverList ref="Driverlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></DriverList>
            </el-card>
            <br>
            <el-card class="box-card">
                <DriverDetail :formId="formId" ref="DriverDetail"></DriverDetail>
            </el-card>
        </div>
        <el-dialog title="司机信息" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <DriverForm ref="Driverform" @childByValue="childByValue" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></DriverForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="cancelForm">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import DriverForm from './DriverForm';
import DriverFilter from './DriverFilter';
import DriverList from './DriverList';
import DriverDetail from './DriverDetail';
export default {
    name: 'Driver',
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
        DriverForm,
        DriverFilter,
        DriverList,
        DriverDetail
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
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        createForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.Driverform) {
                this.$refs.Driverform.clearForm();
            }
        },
        refreshData() {
            this.$refs.Driverlist.getList();
            this.$refs.DriverDetail.getForm();
        },
        saveForm() {
            this.$refs.Driverform.saveForm();
            if (this.status == '成功') {
                this.dialogFormVisible = false;
                this.status = '';
                this.$refs.DriverDetail.getForm();
            }
        },
        cancelForm() {
            this.dialogFormVisible = false;
        }
    }
};
</script>
<style lang="scss">
</style>