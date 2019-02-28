<template>
    <div id="Inspect" class="main-container">
        <div class="content-container">

            <el-card class="box-card">
                <InspectFilter @searchList="getSearchOptions"></InspectFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="creatForm">新建</el-button>
                </div>
                <InspectList ref="InspectList" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></InspectList>
            </el-card>
            <br>
            <el-card class="box-card">
                <InspectDetail ref="InspectDetail" @refreshData="refreshData" :formId="formId"></InspectDetail>
                <!-- <index :formId="formId"></index> -->
            </el-card>
            <!-- <el-tabs v-model="activeName">
                <el-tab-pane label="督办管理" name="first">
                    <el-card class="box-card">
                        <InspectFilter @searchList="getSearchOptions"></InspectFilter>
                        <div class="toolbar">
                            <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true; operationType = 'create'">新建</el-button>
                        </div>
                        <InspectList ref="InspectList" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></InspectList>
                    </el-card>
                    <br>
                    <el-card class="box-card">
                        <InspectDetail ref='InspectDetail' :formId="formId"></InspectDetail>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="统计查询" name="second">
                    <InspectStatistics :formId="formId"></InspectStatistics>
                </el-tab-pane>
            </el-tabs> -->

        </div>
        <el-dialog title="督办管理" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <InspectForm ref="InspectForm" @refreshDetail="refreshDetail" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></InspectForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.status == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import InspectForm from './InspectForm';
import InspectFilter from './InspectFilter';
import InspectList from './InspectList';
import InspectDetail from './InspectDetail';
import InspectStatistics from './InspectStatistics';
export default {
    name: 'Inspect',
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
        InspectForm,
        InspectFilter,
        InspectList,
        InspectDetail,
        InspectStatistics
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        refreshDetail() {
            this.$refs.InspectDetail.getForm();
            this.$refs.InspectDetail.getActions();
            this.$refs.InspectDetail.getCrumbs();
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
            this.$refs.InspectList.getList();
            this.$refs.InspectDetail.getForm();
            this.dialogFormVisible = false;
        },
        creatForm() {
            this.status = '';
            this.operationType = 'create';
            this.dialogFormVisible = true;
            if (this.$refs.InspectForm) {
                this.$refs.InspectForm.clearForm();
            }
        },
        saveForm() {
            this.$refs.InspectForm.saveForm();
        },
        submitForm() {
            this.$refs.InspectForm.submitCheck();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>