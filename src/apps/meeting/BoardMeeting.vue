<template>
    <div id="BoardMeeting">
        <el-card class="box-card">
            <BoardMeetingFilter @searchList="getBoardSearchOptions"></BoardMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisibleBoardMeeting=true; operationBoardType = 'create'">新建</el-button>
            </div>
            <BoardMeetingList ref="boardmeetinglist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions"></BoardMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <BoardMeetingDetail :formId="formBoardId"></BoardMeetingDetail>
        </el-card>
        <el-dialog title="中关村发展集团董事会办公室流程" :visible.sync="dialogFormVisibleBoardMeeting" max-width="1280px" width="70%" style="text-align: center;">
            <BoardMeetingForm @refreshData="refreshBoardData" ref="boardmeetingform" :formId="dialogBoardFormId" :operationType="operationBoardType"></BoardMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <el-button type="default">撤销</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import BoardMeetingFilter from './BoardMeetingFilter';
import BoardMeetingForm from './BoardMeetingForm';
import BoardMeetingList from './BoardMeetingList';
import BoardMeetingDetail from './BoardMeetingDetail';
export default {
    name: 'BoardMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleBoardMeeting: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create'
        };
    },
    components: {
        BoardMeetingFilter,
        BoardMeetingForm,
        BoardMeetingList,
        BoardMeetingDetail
    },
    methods: {
        handleClick(tab, event) {},
        getBoardSearchOptions(searchOptions) {
            // this.searchBoardOptions = searchOptions;
        },
        getBoardFormId(id) {
            //  this.formBoardId = id;
        },
        editBoardForm(id) {
            // this.dialogBoardFormId = id;
            //  this.dialogFormVisibleBoardMeeting = true;
            //  this.operationBoardType = 'edit';
        },
        refreshBoardData() {
            // this.$refs.boardmeetinglist.getList();
        },
        saveBoardForm() {
            // this.$refs.boardmeetingform.saveForm();
            // this.dialogFormVisible = false;
        },
        submitBoardForm() {
            // this.$refs.boardmeetingform.submitCheck();
            // this.dialogFormVisibleboardMeeting = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>