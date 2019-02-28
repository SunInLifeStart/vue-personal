<template>
    <div id="Material" class="main-container">
        <div class="content-container">
            <span class="tree">
                <el-card class="box-card">
                    <MaterialTree @searchOrgans="searchOrgansMethod"></MaterialTree>
                </el-card>
            </span>
            <span style="display: inline-block;  width: 73%; ">
                <el-card class="box-card">
                    <MaterialFilter ref="publicityMaterialsFilter" @searchList="getSearchOptions2"></MaterialFilter>
                    <div class="toolbar" style="margin-top: 10px;">
                        <el-button type="primary" icon="el-icon-plus" @click="createForm2">新建</el-button>
                        <el-button type="primary" @click="moreDelete">批量删除</el-button>
                        <el-button type="primary" @click="moreUplode">批量下载</el-button>
                    </div>
                </el-card>
                <el-card class="box-card">
                    <MaterialList ref="publicitymaterialslist" @clear="clear" @formId="getFormId2" @editForm="editForm2" :searchOptions="searchOptions2" :searchOgans="searchOrgans" @clearFilter="clearFilter" @clearSearchOptions="clearSearchOptions" @showStatus="showStatusMatricity"></MaterialList>
                </el-card>
                <br>
                <el-card class="box-card">
                    <MaterialDetail ref="publicitymaterialsdetails" :formId="formId2"></MaterialDetail>
                </el-card>
            </span>
        </div>
        <el-dialog title="宣传物料" :visible.sync="dialogFormVisible2" :close-on-click-modal="false" max-width="1280px" width="70%">
            <MaterialForm ref="publicitymaterialsform" @refreshData="refreshData2" :formId="dialogFormId2" :operationType="operationType2" @refreshDetail="refreshDetail"></MaterialForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="this.statusMatericity == ''" @click="saveForm2">保存</el-button>
                <el-button type="primary" @click="submitForm2">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import MaterialFilter from './MaterialFilter';
import MaterialForm from './MaterialForm';
import MaterialList from './MaterialList';
import MaterialTree from './MaterialTree';
import MaterialDetail from './MaterialDetail';
import axios from 'axios';
export default {
    name: 'Material',
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
        MaterialFilter,
        MaterialForm,
        MaterialList,
        MaterialDetail,
        MaterialTree
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
        showStatusMatricity(status) {
            if (status == '已保存') {
                this.statusMatericity = '';
            } else {
                this.statusMatericity = '已驳回';
            }
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
            this.statusMatericity = '';
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
        refreshDetail() {
            if (this.$refs.publicitymaterialsdetails) {
                this.$refs.publicitymaterialsdetails.getForm();
                this.$refs.publicitymaterialsdetails.getActions();
            }
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
<style>
#Material .tree {
    display: inline-block;
    width: 27%;
    float: left;
}
#Material .tree > div:first-child {
    height: 634px;
    overflow: auto;
}
#Material .tree > div > .el-card__body {
    padding: 0px 0 0 5px;
}
</style>