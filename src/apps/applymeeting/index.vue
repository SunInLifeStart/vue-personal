<template>
    <div id="ApplyMeeting">
        <el-card class="box-card">
            <ApplyMeetingFilter @searchList="getBoardSearchOptions"></ApplyMeetingFilter>
        </el-card>
        <el-card class="box-card card_margin_10">
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <ApplyMeetingList ref="ApplyMeetinglist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></ApplyMeetingList>
        </el-card>
        <el-card class="box-card card_margin_10">
            <ApplyMeetingDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="ApplyMeetingDetail"></ApplyMeetingDetail>
        </el-card>
        <el-dialog title="会议申请" :visible.sync="dialogFormVisibleApplyMeeting" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <ApplyMeetingForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="ApplyMeetingform" :formId="dialogBoardFormId" :operationType="operationBoardType"></ApplyMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <!--<el-button type="primary" @click="submitBoardForm">提交</el-button>-->
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ApplyMeetingFilter from './ApplyMeetingFilter';
import ApplyMeetingForm from './ApplyMeetingForm';
import ApplyMeetingList from './ApplyMeetingList';
import ApplyMeetingDetail from './ApplyMeetingDetail';
export default {
    name: 'ApplyMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleApplyMeeting: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        ApplyMeetingFilter,
        ApplyMeetingForm,
        ApplyMeetingList,
        ApplyMeetingDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleApplyMeeting = true;
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
            this.dialogFormVisibleApplyMeeting = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.ApplyMeetingDetail.getForm();
            this.$refs.ApplyMeetingDetail.getActions();
            this.$refs.ApplyMeetingDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.ApplyMeetinglist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.ApplyMeetingDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.ApplyMeetingform.saveForm();
            this.$refs.ApplyMeetingform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.ApplyMeetingform.saveFormValidate('submit');
            // this.dialogFormVisibleApplyMeeting = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleApplyMeeting = status;
        }
    }
};
</script>
<style lang="scss" scoped>
    #ApplyMeeting {
        .card_margin_10 {
            margin-top: 10px;
        }
    }
</style>