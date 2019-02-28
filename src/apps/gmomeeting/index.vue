<template>
    <div id="GmoMeeting">
        <el-card class="box-card">
            <GmoMeetingFilter @searchList="getSearchOptions"></GmoMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <GmoMeetingList ref="gmomeetinglist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></GmoMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <GmoMeetingDetail :formId="formId" @refreshData="refreshData" ref="GmoMeetingDetail"></GmoMeetingDetail>
        </el-card>
        <el-dialog title="总办会会议纪要" :visible.sync="dialogFormVisibleGmoMeeting" max-width="1280px" width="70%" :close-on-click-modal="false">
            <GmoMeetingForm @refreshData="refreshData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="gmomeetingform" :formId="dialogFormId" :operationType="operationType"></GmoMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import GmoMeetingFilter from './GmomeetingFilter';
import GmoMeetingForm from './GmomeetingForm';
import GmoMeetingList from './GmomeetingList';
import GmoMeetingDetail from './GmomeetingDetail';
export default {
    name: 'GmoMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleGmoMeeting: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            statusNews: ''
        };
    },
    components: {
        GmoMeetingFilter,
        GmoMeetingForm,
        GmoMeetingList,
        GmoMeetingDetail
    },
    methods: {
        showStatus(status) {
            if (status == '已保存') {
                this.statusNews = '';
            } else {
                this.statusNews = '已驳回';
            }
        },
        cleanform() {
            this.operationType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleGmoMeeting = true;
        },
        refreshDetail() {
            this.$refs.GmoMeetingDetail.getForm();
            this.$refs.GmoMeetingDetail.getActions();
            this.$refs.GmoMeetingDetail.getCrumbs();
        },
        handleClick(tab, event) {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },

        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisibleGmoMeeting = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.gmomeetinglist.getList();
            //  if (this.operationType == "edit") {
            //     this.$refs.GmoMeetingDetail.getForm();
            // }
        },
        saveForm() {
            this.$refs.gmomeetingform.saveFormValidate();
        },
        submitForm() {
            this.$refs.gmomeetingform.saveFormValidate('submit');
        },
        saveStatus(status) {
            this.dialogFormVisibleGmoMeeting = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>