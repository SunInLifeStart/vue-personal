<template>
    <div id="PortalApp" class="main-container">
        <div class="content-container" style="width:100%">
            <el-card class="box-card">
                <PortalAppFilter @searchList="getSearchOptions"></PortalAppFilter>
                 <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="cleanForm">新建</el-button>
                 </div>
                <PortalAppList ref="PortalAppList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"  :type="type" ></PortalAppList>
            </el-card>
            <br>
            <!-- <el-card class="box-card">
                <PortalAppDetail ref="PortalAppDetail" :formId="formId"></PortalAppDetail>
            </el-card> -->
        </div>
        <el-dialog :title="type" :visible.sync="dialogFormVisible" max-width="1280px" width="80%" :close-on-click-modal="false">
            <PortalAppForm ref="PortalAppForm" @saveStatus="saveStatus" @refreshData="refreshData" :formId="dialogFormId" :type="type" :operationType="operationType"></PortalAppForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import PortalAppForm from './PortalAppForm';
import PortalAppFilter from './PortalAppFilter';
import PortalAppList from './PortalAppList';
// import PortalAppDetail from './PortalAppDetail';
export default {
    name: 'PortalApp',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'edit'
        };
    },
    props: ['type'],
    components: {
        PortalAppForm,
        PortalAppFilter,
        PortalAppList,
        // PortalAppDetail
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
            // this.$refs.PortalAppDetail.getForm(); 
            this.$refs.PortalAppList.getList(); 
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
            // if (this.$refs.foreignoutform) {
            //     this.$refs.foreignoutform.getForm();
            // }
        },
        refreshData() {
            this.$refs.PortalAppList.getList();
            // this.$refs.foreignoutdetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            this.$refs.PortalAppForm.saveForm();
        },
        cleanForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.PortalAppForm) {
                this.$refs.PortalAppForm.cleanForm();
            }
        }
    }
};
</script>
<style lang="scss">
</style>