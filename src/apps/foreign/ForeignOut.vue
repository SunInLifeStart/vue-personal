<template>
    <div id="ForeignOut" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ForeignOutFilter @searchList="getSearchOptions"></ForeignOutFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="cleanForm">新建</el-button>
                </div>
                <ForeignOutList ref="foreignoutlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></ForeignOutList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ForeignOutDetail ref="foreignoutdetail" :formId="formId"></ForeignOutDetail>
            </el-card>
        </div>
        <el-dialog title="出境计划申报" :visible.sync="dialogFormVisible" max-width="1280px" width="80%" :close-on-click-modal="false">
            <ForeignOutForm ref="foreignoutform" @saveStatus="saveStatus" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></ForeignOutForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ForeignOutForm from './ForeignOutForm';
import ForeignOutFilter from './ForeignOutFilter';
import ForeignOutList from './ForeignOutList';
import ForeignOutDetail from './ForeignOutDetail';
export default {
    name: 'ForeignOut',
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
        ForeignOutForm,
        ForeignOutFilter,
        ForeignOutList,
        ForeignOutDetail
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
            if (this.$refs.foreignoutform) {
                this.$refs.foreignoutform.getForm();
            }
        },
        refreshData() {
            this.$refs.foreignoutlist.getList();
            this.$refs.foreignoutdetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            this.$refs.foreignoutform.saveForm();
        },
        submitForm() {
            this.$refs.foreignoutform.submitCheck();
        },
        cleanForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.foreignoutform) {
                this.$refs.foreignoutform.cleanForm();
            }
        }
    }
};
</script>
<style lang="scss">
</style>