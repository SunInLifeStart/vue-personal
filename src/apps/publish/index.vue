<template>
    <div id="Publish" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName">
                <el-tab-pane label="综合事务信息发布" name="first">
                    <el-card class="box-card">
                        <PublishFilter @searchList="getSearchOptions"></PublishFilter>
                        <div class="toolbar">
                            <el-button type="primary" icon="el-icon-plus" @click="clearForm()">新建</el-button>
                        </div>
                        <PublishList ref="publishlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions" @showStatus="showStatus"></PublishList>
                    </el-card>
                    <br>
                    <el-card class="box-card">
                        <PublishDetail :formId="formId" ref="publishdetail"></PublishDetail>
                    </el-card>
                </el-tab-pane>
            </el-tabs>

        </div>
        <el-dialog title="信息发布" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <PublishForm ref="publishform" @saveStatus="saveStatus" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType"></PublishForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.status == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import PublishForm from './PublishForm';
import PublishFilter from './PublishFilter';
import PublishList from './PublishList';
import PublishDetail from './PublishDetail';
import PublishStatistics from './PublishStatistics';
export default {
    name: 'Publish',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            activeName: 'first',
            status: ''
        };
    },
    components: {
        PublishForm,
        PublishFilter,
        PublishList,
        PublishDetail,
        PublishStatistics
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        refreshDetail() {
            if (this.$refs.publishdetail) {
                this.$refs.publishdetail.getForm();
                this.$refs.publishdetail.getActions();
            }
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.publishlist.getList();
        },
        saveForm() {
            this.$refs.publishform.saveFormValidate();
        },
        submitForm() {
            this.$refs.publishform.submitCheck();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        clearForm() {
            this.status = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.publishform) {
                this.$refs.publishform.clearForm();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>