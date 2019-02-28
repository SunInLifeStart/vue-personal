<template>
    <div id="InformationRelease" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName">
                <el-card class="box-card">
                    <InformationReleaseFilter @searchList="getSearchOptions"></InformationReleaseFilter>
                    <div class="toolbar">
                        <el-button type="primary" icon="el-icon-plus" @click="clearForm()">新建</el-button>
                    </div>
                    <InformationReleaseList ref="infomationreleaselist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></InformationReleaseList>
                </el-card>
                <br>
                <el-card class="box-card">
                    <SuperDetail :formId="formId" ref="superdetail"></SuperDetail>
                </el-card>
            </el-tabs>

        </div>
        <el-dialog title="信息发布" :visible.sync="dialogFormVisible" max-width="1280px" width="70%">
            <SuperForm @showCommit="showCommitt" ref="superForm" @saveStatus="saveStatus" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType"></SuperForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.status == ''" @click="saveForm">保存</el-button>
                <!--v-show="this.showCommit"-->
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import SuperForm from './SuperForm';
import InformationReleaseFilter from './InformationReleaseFilter';
import InformationReleaseList from './InformationReleaseList';
import SuperDetail from './SuperDetail';
export default {
    name: 'InformationRelease',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            showCommit: false,
            activeName: 'first',
            status: ''
        };
    },
    components: {
        SuperForm,
        InformationReleaseFilter,
        InformationReleaseList,
        SuperDetail
    },
    methods: {
        refreshDetail() {
            if (this.$refs.superdetail) {
                this.$refs.superdetail.getForm();
            }
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        showCommitt(type) {
            this.showCommit = type;
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
        refreshData() {
            this.$refs.infomationreleaselist.getList();
        },
        saveForm() {
            this.$refs.superForm.saveFormValidate();
        },
        submitForm() {
            this.$refs.superForm.submitCheck();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        clearForm() {
            this.showCommit = false;
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.superForm) {
                this.$refs.superForm.clearForm();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>