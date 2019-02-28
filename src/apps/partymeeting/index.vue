<template>
    <div id="PartyMeeting">
        <el-card class="box-card">
            <PartyMeetingFilter @searchList="getSearchOptions"></PartyMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
            </div>
            <PartyMeetingList ref="partymeetinglist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></PartyMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <PartyMeetingDetail :formId="formId" @refreshData="refreshDataList" ref="PartyMeetingDetail"></PartyMeetingDetail>
        </el-card>
        <el-dialog title="中关村发展集团党委会会议纪要" :visible.sync="dialogFormVisiblePartyMeeting" max-width="1280px" width="70%" :close-on-click-modal="false">
            <PartyMeetingForm @refreshData="refreshData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="partymeetingform" :formId="dialogFormId" :operationType="operationType"></PartyMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.status == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import PartyMeetingFilter from './PartymeetingFilter';
import PartyMeetingForm from './PartymeetingForm';
import PartyMeetingList from './PartymeetingList';
import PartyMeetingDetail from './PartymeetingDetail';
export default {
    name: 'PartyMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisiblePartyMeeting: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            status: ''
        };
    },
    components: {
        PartyMeetingFilter,
        PartyMeetingForm,
        PartyMeetingList,
        PartyMeetingDetail
    },
    methods: {
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        createForm() {
            this.operationType = 'create';
            this.status = '';
            this.dialogFormVisiblePartyMeeting = true;
            if (this.$refs.partymeetingform) {
                this.$refs.partymeetingform.clearForm();
            }
        },
        handleClick(tab, event) {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        refreshDetail() {
            this.$refs.PartyMeetingDetail.getForm();
            this.$refs.PartyMeetingDetail.getActions();
            this.$refs.PartyMeetingDetail.getCrumbs();
        },
        getFormId(id) {
            // this.formId = "";
            this.formId = id;
        },

        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisiblePartyMeeting = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.partymeetinglist.getList();
            if (this.operationType == 'edit') {
                this.$refs.PartyMeetingDetail.getForm();
            }
        },
        refreshDataList() {
            this.$refs.partymeetinglist.getList();
        },
        saveForm() {
            this.$refs.partymeetingform.saveFormValidate();
            // this.$refs.partymeetingform.saveForm();
            // this.dialogFormVisiblePartyMeeting = false;
        },
        submitForm() {
            this.$refs.partymeetingform.saveFormValidate('submit');
            // this.dialogFormVisiblePartyMeeting = false;
        },
        saveStatus(status) {
            this.dialogFormVisiblePartyMeeting = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>