<template>
    <div id="BoardMeeting">
        <el-card class="box-card">
            <BoardMeetingFilter @searchList="getBoardSearchOptions"></BoardMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <BoardMeetingList ref="boardmeetinglist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></BoardMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <BoardMeetingDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="BoardMeetingDetail"></BoardMeetingDetail>
        </el-card>
        <el-dialog title="中关村协同发展董事会办公室流程" :visible.sync="dialogFormVisibleBoardMeeting" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <BoardMeetingForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="boardmeetingform" :formId="dialogBoardFormId" :operationType="operationBoardType"></BoardMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import BoardMeetingFilter from './BoardmeetingFilter';
import BoardMeetingForm from './BoardmeetingForm';
import BoardMeetingList from './BoardmeetingList';
import BoardMeetingDetail from './BoardmeetingDetail';
export default {
    name: 'BoardMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleBoardMeeting: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        BoardMeetingFilter,
        BoardMeetingForm,
        BoardMeetingList,
        BoardMeetingDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleBoardMeeting = true;
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
            this.dialogFormVisibleBoardMeeting = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.BoardMeetingDetail.getForm();
            this.$refs.BoardMeetingDetail.getActions();
            this.$refs.BoardMeetingDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.boardmeetinglist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.BoardMeetingDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.boardmeetingform.saveForm();
            this.$refs.boardmeetingform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.boardmeetingform.saveFormValidate('submit');
            // this.dialogFormVisibleBoardMeeting = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleBoardMeeting = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>