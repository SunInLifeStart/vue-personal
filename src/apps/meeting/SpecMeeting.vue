<template>
    <div id="SpecMeeting">
        <el-card class="box-card">
            <SpecMeetingFilter @searchList="getSpecSearchOptions"></SpecMeetingFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisibleSpecMeeting=true; operationSpecType = 'create'">新建</el-button>
            </div>
            <SpecMeetingList ref="specmeetinglist" @formId="getSpecFormId" @editForm="editSpecForm" :searchOptions="searchSpecOptions"></SpecMeetingList>
        </el-card>
        <br>
        <el-card class="box-card">
            <SpecMeetingDetail :formId="formSpecId"></SpecMeetingDetail>
        </el-card>
        <el-dialog title="中关村发展集团专题会" :visible.sync="dialogFormVisibleSpecMeeting" max-width="1280px" width="70%" style="text-align: center;">
            <SpecMeetingForm @refreshData="refreshSpecData" ref="specmeetingform" :formId="dialogSpecFormId" :operationType="operationSpecType"></SpecMeetingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveSpecForm">保存</el-button>
                <el-button type="primary" @click="submitSpecForm">提交</el-button>
                <el-button type="default">撤销</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import SpecMeetingFilter from './SpecMeetingFilter';
import SpecMeetingForm from './SpecMeetingForm';
import SpecMeetingList from './SpecMeetingList';
import SpecMeetingDetail from './SpecMeetingDetail';
export default {
    name: 'SpecMeeting',
    mounted() {},
    data() {
        return {
            dialogFormVisibleSpecMeeting: false,
            searchSpecOptions: [],
            formSpecId: '',
            dialogSpecFormId: '',
            operationSpecType: 'create'
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
            // this.searchSpecOptions = searchOptions;
        },
        getSpecFormId(id) {
            //  this.formSpecId = id;
        },
        editSpecForm(id) {
            // this.dialogSpecFormId = id;
            //  this.dialogFormVisibleSpecMeeting = true;
            //  this.operationSpecType = 'edit';
        },
        refreshSpecData() {
            // this.$refs.Specmeetinglist.getList();
        },
        saveSpecForm() {
            // this.$refs.Specmeetingform.saveForm();
            // this.dialogFormVisible = false;
        },
        submitSpecForm() {
            // this.$refs.Specmeetingform.submitCheck();
            // this.dialogFormVisibleSpecMeeting = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>