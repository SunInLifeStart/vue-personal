<template>
    <div id="SpecMeeting">
        <el-card class="box-card">
            <SpecMeetingFilter @searchList="getSpecSearchOptions"></SpecMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <SpecMeetingList ref="specmeetinglist" @showStatus="showStatus" @formId="getSpecFormId" @editForm="editSpecForm" :searchOptions="searchSpecOptions"></SpecMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <SpecMeetingDetail :formId="formSpecId" @refreshData="refreshSpecDataList" ref="SpecMeetingDetail"></SpecMeetingDetail>
        </el-card>
        <el-dialog title="中关村协同发展专题会" :visible.sync="dialogFormVisibleSpecMeeting" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <SpecMeetingForm @refreshData="refreshSpecData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="specmeetingform" :formId="dialogSpecFormId" :operationType="operationSpecType"></SpecMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveSpecForm">保存</el-button>
                <el-button type="primary" @click="submitSpecForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import SpecMeetingFilter from './SpecmeetingFilter';
import SpecMeetingForm from './SpecmeetingForm';
import SpecMeetingList from './SpecmeetingList';
import SpecMeetingDetail from './SpecmeetingDetail';
export default {
    name: 'SpecMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleSpecMeeting: false,
            searchSpecOptions: [],
            formSpecId: '',
            dialogSpecFormId: '',
            operationSpecType: 'create',
            statusNews: ''
        };
    },
    components: {
        SpecMeetingFilter,
        SpecMeetingForm,
        SpecMeetingList,
        SpecMeetingDetail
    },
    methods: {
        handleClick(tab, event) {},
        getSpecSearchOptions(searchOptions) {
            this.searchSpecOptions = searchOptions;
        },
        showStatus(status) {
            if (status == '已保存') {
                this.statusNews = '';
            } else {
                this.statusNews = '已驳回';
            }
        },
        cleanform() {
            this.operationSpecType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleSpecMeeting = true;
        },
        refreshDetail() {
            this.$refs.SpecMeetingDetail.getForm();
            this.$refs.SpecMeetingDetail.getActions();
            this.$refs.SpecMeetingDetail.getCrumbs();
        },
        getSpecFormId(id) {
            this.formSpecId = id;
        },
        editSpecForm(id) {
            this.dialogSpecFormId = id;
            this.dialogFormVisibleSpecMeeting = true;
            this.operationSpecType = 'edit';
        },
        refreshSpecData() {
            this.$refs.specmeetinglist.getList();
            if (this.operationSpecType == 'edit') {
                this.$refs.SpecMeetingDetail.getForm();
            }
        },
        refreshSpecDataList() {
            this.$refs.specmeetinglist.getList();
        },
        saveSpecForm() {
            this.$refs.specmeetingform.saveFormValidate();
        },
        submitSpecForm() {
            this.$refs.specmeetingform.saveFormValidate('submit');
            this.dialogFormVisibleSpecMeeting = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleSpecMeeting = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>