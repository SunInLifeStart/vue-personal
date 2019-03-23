<template>
    <div id="Leave">
        <el-card class="box-card">
            <LeaveFilter @searchList="getSearchOptions"></LeaveFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
            </div>
            <LeaveList @searchList="getSearchOptions" ref="Leavelist" @formId="getFormId" @editForm="editForm" @showStatus="showStatusT" :searchOptions="searchOptions"></LeaveList>
        </el-card>
        <br>
        <el-card class="box-card">
            <LeaveDetail :formId="formId" ref="LeaveDetail"></LeaveDetail>
        </el-card>
        <el-dialog title="请休假申请" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1240px">
            <LeaveForm ref="Leaveform" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType" @saveStatus="saveStatus"></LeaveForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <!-- v-if="this.showStatus == ''"  -->
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- s<el-button type="default" @click="cancelForm">撤销</el-button> -->
            </div>
        </el-dialog>

    </div>
</template>
<script>
import LeaveList from './LeaveList';
import LeaveForm from './LeaveForm';
import LeaveFilter from './LeaveFilter';
import LeaveDetail from './LeaveDetail';
export default {
    name: 'Leave',
    data() {
        return {
            activeName: 'first',
            dialogFormVisible: false,
            searchOptions: [
                {
                    field: 'id',
                    filter: 'IS_NOT_NULL'
                }
            ],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            showStatus: ''
        };
    },
    methods: {
        handleClick() {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        refreshDetail() {
            if (this.$refs.LeaveDetail) {
                this.$refs.LeaveDetail.getForm();
                this.$refs.LeaveDetail.getActions();
            }
        },
        showStatusT(status) {
            if (status == '已保存') {
                this.showStatus = '';
            } else {
                this.showStatus = '已驳回';
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
            if (this.$refs.Leaveform) {
                this.$refs.Leaveform.getForm();
            }
        },
        refreshData() {
            this.$refs.Leavelist.getList();
        },
        saveForm() {
            this.$refs.Leaveform.saveFormValidate();
            // this.dialogFormVisible = false;
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.Leaveform.submitCheck();
            // this.dialogFormVisible = false;
        },
        createForm() {
            this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.Leaveform) {
                this.$refs.Leaveform.clearForm();
            }
        }
    },
    components: {
        LeaveList,
        LeaveForm,
        LeaveFilter,
        LeaveDetail
    }
};
</script>
<style lang="scss" scoped>
</style>


