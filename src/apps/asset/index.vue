<template>
    <div id="Asset" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <AssetFilter @searchList="getSearchOptions"></AssetFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="newForm">新建</el-button>
                </div>
                <AssetList ref="Assetlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></AssetList>
                <br>
            </el-card>
            <br>
            <el-card class="box-card">
                <AssetDetail :formId="formId" ref="AssetDetail" @refreshData="refreshData"></AssetDetail>
            </el-card>
        </div>
        <el-dialog title="资产管理" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <AssetForm ref="Assetform" @refreshData="refreshData" @saveStatus="getSaveStatus" :formId="dialogFormId" :operationType="operationType"></AssetForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button type="primary" v-show="false" @click="repealForm">撤销</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import AssetForm from './AssetForm';
import AssetFilter from './AssetFilter';
import AssetList from './AssetList';
import AssetDetail from './AssetDetail';
export default {
    name: 'Asset',
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
        AssetForm,
        AssetFilter,
        AssetList,
        AssetDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getSaveStatus(saveStatus) {
            this.dialogFormVisible = saveStatus;
        },
        getFormId(id) {
            this.formId = id;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.Assetlist.getList();
            this.$refs.AssetDetail.getForm();
            // this.dialogFormVisible = false;
        },
        newForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.Assetform) {
                this.$refs.Assetform.clearForm();
            }
        },
        saveForm() {
            this.$refs.Assetform.saveForm();
        },
        submitForm() {
            this.$refs.Assetform.submitCheck();
        },
        repealForm() {
            this.$refs.Assetform.repealForm();
            this.dialogFormVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>