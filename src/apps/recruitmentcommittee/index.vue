<template>
    <div id="RecruitmentCommittee">
        <el-card class="box-card">
            <RecruitmentCommitteeFilter @searchList="getBoardSearchOptions"></RecruitmentCommitteeFilter>
        </el-card>
        <el-card class="box-card card_margin_10">
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <RecruitmentCommitteeList ref="RecruitmentCommitteelist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></RecruitmentCommitteeList>
        </el-card>
        <el-card class="box-card card_margin_10">
            <RecruitmentCommitteeDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="RecruitmentCommitteeDetail"></RecruitmentCommitteeDetail>
        </el-card>
        <el-dialog title="会议申请(招采委员会)" :visible.sync="dialogFormVisibleRecruitmentCommittee" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <RecruitmentCommitteeForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="RecruitmentCommitteeform" :formId="dialogBoardFormId" :operationType="operationBoardType"></RecruitmentCommitteeForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <!--<el-button type="primary" @click="submitBoardForm">提交</el-button>-->
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import RecruitmentCommitteeFilter from './RecruitmentCommitteeFilter';
import RecruitmentCommitteeForm from './RecruitmentCommitteeForm';
import RecruitmentCommitteeList from './RecruitmentCommitteeList';
import RecruitmentCommitteeDetail from './RecruitmentCommitteeDetail';
export default {
    name: 'RecruitmentCommittee',
    mounted() {},
    data() {
        return {
            dialogFormVisibleRecruitmentCommittee: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        RecruitmentCommitteeFilter,
        RecruitmentCommitteeForm,
        RecruitmentCommitteeList,
        RecruitmentCommitteeDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleRecruitmentCommittee = true;
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
            this.dialogFormVisibleRecruitmentCommittee = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.RecruitmentCommitteeDetail.getForm();
            this.$refs.RecruitmentCommitteeDetail.getActions();
            this.$refs.RecruitmentCommitteeDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.RecruitmentCommitteelist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.RecruitmentCommitteeDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.RecruitmentCommitteeform.saveForm();
            this.$refs.RecruitmentCommitteeform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.RecruitmentCommitteeform.saveFormValidate('submit');
            // this.dialogFormVisibleRecruitmentCommittee = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleRecruitmentCommittee = status;
        }
    }
};
</script>
<style lang="scss" scoped>
    #RecruitmentCommittee {
        .card_margin_10 {
            margin-top: 10px;
        }
    }
</style>