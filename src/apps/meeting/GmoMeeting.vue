<template>
    <div id="GmoMeeting">
        <el-card class="box-card">
            <GmoMeetingFilter @searchList="getSearchOptions"></GmoMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisibleGmoMeeting=true; operationType = 'create'">新建</el-button>
            </div>
            <GmoMeetingList ref="gmomeetinglist" @formId="getFormId" :operationType ="operationType"  @editForm="editForm" :searchOptions="searchOptions"></GmoMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <GmoMeetingDetail :formId="formId"></GmoMeetingDetail>
        </el-card>
        <el-dialog title="总办会会议纪要" :visible.sync="dialogFormVisibleGmoMeeting" max-width="1280px" width="70%">
            <GmoMeetingForm @refreshData="refreshData" ref="gmomeetingform" :formId="dialogFormId" :operationType="operationType"></GmoMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import GmoMeetingFilter from './GmoMeetingFilter';
import GmoMeetingForm from './GmoMeetingForm';
import GmoMeetingList from './GmoMeetingList';
import GmoMeetingDetail from './GmoMeetingDetail';
export default {
    name: 'GmoMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleGmoMeeting: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create'
        };
    },
    components: {
        GmoMeetingFilter,
        GmoMeetingForm,
        GmoMeetingList,
        GmoMeetingDetail
    },
    methods: {
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
        },
        saveForm() {
            this.$refs.gmomeetingform.saveForm();
            this.dialogFormVisibleGmoMeeting = false;
        },
        submitForm() {
            this.$refs.gmomeetingform.submitCheck();
            this.dialogFormVisibleGmoMeeting = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>