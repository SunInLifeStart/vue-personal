<template>
    <div id="Newsmaterials" class="main-container">
        <div class="content-container">
            <el-row>
                <el-col :span="4">
                    <el-card class="box-card">
                        <PublicityMaterialsTree @searchOrgans="searchOrgansMethod"></PublicityMaterialsTree>
                    </el-card>
                </el-col>
                <el-col :span="20">
                    <el-card class="box-card">
                        <PublicityMaterialsFilter ref="publicityMaterialsFilter" @searchList="getSearchOptions2"></PublicityMaterialsFilter>
                        <div class="toolbar" style="margin-top: 10px;">
                            <el-button type="primary" icon="el-icon-plus" @click="createForm2">新建</el-button>
                            <el-button type="primary" @click="moreDelete">批量删除</el-button>
                            <el-button type="primary" @click="moreUplode">批量下载</el-button>
                        </div>
                    </el-card>
                    <el-card class="box-card">
                        <PublicityMaterialsList ref="publicitymaterialslist" @clear="clear" @formId="getFormId2" @editForm="editForm2" :searchOptions="searchOptions2" :searchOgans="searchOrgans" @clearFilter="clearFilter" @clearSearchOptions="clearSearchOptions" @showStatus="showStatusMatricity"></PublicityMaterialsList>
                    </el-card>
                    <br>
                    <el-card class="box-card">
                        <PublicityMaterialsDetail ref="publicitymaterialsdetails" :formId="formId2"></PublicityMaterialsDetail>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="宣传物料" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" max-width="1280px" width="70%">
            <PublicityMaterialsForm ref="publicitymaterialsform" @refreshData="refreshData2" :formId="dialogFormId2" :operationType="operationType2"></PublicityMaterialsForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="this.statusMatericity == ''" @click="saveForm2">保存</el-button>
                <el-button type="primary" @click="submitForm2">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import PublicityMaterialsFilter from './PublicityMaterialsFilter';
import PublicityMaterialsForm from './PublicityMaterialsForm';
import PublicityMaterialsList from './PublicityMaterialsList';
import PublicityMaterialsTree from './PublicityMaterialsTree';
import PublicityMaterialsDetail from './PublicityMaterialsDetail';
import axios from 'axios';
export default {
    name: 'Newsmaterials',
    mounted() {},
    data() {
        return {
            dialogFormVisible2: false,
            searchOptions2: [],
            searchOrgans: [],
            formId2: '',
            dialogFormId2: '',
            operationType2: 'create',
            statusMatericity: ''
        };
    },
    components: {
        PublicityMaterialsFilter,
        PublicityMaterialsForm,
        PublicityMaterialsList,
        PublicityMaterialsDetail,
        PublicityMaterialsTree
    },
    methods: {
        searchOrgansMethod(searchOrgans) {
            this.searchOrgans = searchOrgans;
        },
        clear() {
            if (this.$refs.publicitymaterialsdetails) {
                this.$refs.publicitymaterialsdetails.clearForm();
            }
        },
        clearFilter() {
            if (this.$refs.publicityMaterialsFilter) {
                this.$refs.publicityMaterialsFilter.clearFilter();
            }
        },
        moreUplode() {
            if (this.$refs.publicitymaterialslist) {
                this.$refs.publicitymaterialslist.moreUplode();
            }
        },
        showStatusMatricity() {
            this.statusMatericity = '已驳回';
        },
        getSearchOptions2(searchOptions) {
            this.searchOptions2 = searchOptions;
        },
        clearSearchOptions() {
            this.searchOptions2 = [];
        },
        moreDelete() {
            if (this.$refs.publicitymaterialslist) {
                this.$refs.publicitymaterialslist.moreDelete();
            }
        },
        getFormId2(id) {
            this.formId2 = id;
        },
        createForm2() {
            this.dialogFormVisible2 = true;
            this.operationType2 = 'create';
            if (this.$refs.publicitymaterialsform) {
                this.$refs.publicitymaterialsform.clearForm();
            }
        },
        editForm2(id) {
            this.dialogFormId2 = id;
            this.dialogFormVisible2 = true;
            this.operationType2 = 'edit';
        },
        refreshData2() {
            this.$refs.publicitymaterialslist.getList();
            this.$refs.publicitymaterialsdetails.getForm();
        },
        saveForm2() {
            this.$refs.publicitymaterialsform.saveForm();
            this.dialogFormVisible2 = false;
        },
        submitForm2() {
            this.$refs.publicitymaterialsform.submitCheck();
            this.dialogFormVisible2 = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>