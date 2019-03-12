<template>
    <div id="AgentApply">
        <el-card class="box-card">
            <AgentApplyFilter @searchList="getBoardSearchOptions"></AgentApplyFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <AgentApplyList ref="AgentApplylist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></AgentApplyList>
        </el-card>
        <br>
        <el-card class="box-card">
            <AgentApplyDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="AgentApplyDetail"></AgentApplyDetail>
        </el-card>
        <el-dialog title="会议申请(总办会/党支委会)" :visible.sync="dialogFormVisibleAgentApply" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <AgentApplyForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="AgentApplyform" :formId="dialogBoardFormId" :operationType="operationBoardType"></AgentApplyForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import AgentApplyFilter from './AgentApplyFilter';
import AgentApplyForm from './AgentApplyForm';
import AgentApplyList from './AgentApplyList';
import AgentApplyDetail from './AgentApplyDetail';
export default {
    name: 'AgentApply',
    mounted() {},
    data() {
        return {
            dialogFormVisibleAgentApply: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        AgentApplyFilter,
        AgentApplyForm,
        AgentApplyList,
        AgentApplyDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleAgentApply = true;
        },
        showStatus(status) {
            if (status == '已保存') {
                this.statusNews = '';
            } else {
                this.statusNews = '已驳回';
            }
        },
        handleClick(tab, event) {},
        getBoardSearchOptions(searchOptions) {
            this.searchBoardOptions = searchOptions;
        },
        getBoardFormId(id) {
            this.formBoardId = '';
            this.formBoardId = id;
        },
        editBoardForm(id) {
            this.dialogBoardFormId = id;
            this.dialogFormVisibleAgentApply = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.AgentApplyDetail.getForm();
            this.$refs.AgentApplyDetail.getActions();
            this.$refs.AgentApplyDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.AgentApplylist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.AgentApplyDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.AgentApplyform.saveForm();
            this.$refs.AgentApplyform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.AgentApplyform.saveFormValidate('submit');
            // this.dialogFormVisibleAgentApply = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleAgentApply = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>