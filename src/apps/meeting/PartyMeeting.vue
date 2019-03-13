<template>
    <div id="PartyMeeting" >
        <el-card class="box-card">
            <PartyMeetingFilter @searchList="getPartySearchOptions"></PartyMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisiblePartyMeeting=true; operationTypeParty = 'create'">新建</el-button>
            </div>
            <PartyMeetingList ref="partymeetinglist" @formId="getPartyFormId" @editForm="editPartyForm" :searchOptions="searchPartyOptions"></PartyMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <PartyMeetingDetail :formId="formPartyId"></PartyMeetingDetail>
        </el-card>
        <el-dialog title="中关村协同发展党委会会议纪要" :visible.sync="dialogFormVisiblePartyMeeting" max-width="1280px" width="70%" style="text-align: center">
            <PartyMeetingForm @refreshData="refreshPartyData" ref="partymeetingform" :formId="dialogPartyFormId" :operationType="operationPartyType"></PartyMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="savePartyForm">保存</el-button>
                <el-button type="primary" @click="submitPartyForm">提交</el-button>
                <el-button type="default">撤销</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import PartyMeetingFilter from './PartyMeetingFilter';
import PartyMeetingForm from './PartyMeetingForm';
import PartyMeetingList from './PartyMeetingList';
import PartyMeetingDetail from './PartyMeetingDetail';
export default {
    name: 'PartyMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisiblePartyMeeting: false,
            searchPartyOptions: [],
            formPartyId: '',
            dialogPartyFormId: '',
            operationPartyType: 'create'
        };
    },
    components: {
        PartyMeetingFilter,
        PartyMeetingForm,
        PartyMeetingList,
        PartyMeetingDetail
    },
    methods: {
        handleClick(tab, event) {},
        getPartySearchOptions(searchOptions) {
            // this.searchPartyOptions = searchOptions;
        },
        getPartyFormId(id) {
            //  this.formPartyId = id;
        },
        editPartyForm(id) {
            // this.dialogPartyFormId = id;
            //  this.dialogFormVisiblePartyMeeting = true;
            //  this.operationPartyType = 'edit';
        },
        refreshPartyData() {
            // this.$refs.partymeetinglist.getList();
        },
        savePartyForm() {
            // this.$refs.partymeetingform.saveForm();
            // this.dialogFormVisible = false;
        },
        submitPartyForm() {
            // this.$refs.partymeetingform.submitCheck();
            // this.dialogFormVisiblePartyMeeting = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>