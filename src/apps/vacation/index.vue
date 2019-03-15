<template>
    <div id="vacation">
        <el-card class="box-card">
            <vacationFilter @searchList="getBoardSearchOptions"></vacationFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <vacationList ref="vacationlist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></vacationList>
        </el-card>
        <br>
        <el-card class="box-card">
            <vacationDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="vacationDetail"></vacationDetail>
        </el-card>
        <el-dialog title="请休假申请" :visible.sync="dialogFormVisiblevacation" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <vacationForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="vacationform" :formId="dialogBoardFormId" :operationType="operationBoardType"></vacationForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import vacationFilter from './vacationFilter';
import vacationForm from './vacationForm';
import vacationList from './vacationList';
import vacationDetail from './vacationDetail';
export default {
    name: 'vacation',
    mounted() {},
    data() {
        return {
            dialogFormVisiblevacation: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        vacationFilter,
        vacationForm,
        vacationList,
        vacationDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisiblevacation = true;
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
            this.dialogFormVisiblevacation = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.vacationDetail.getForm();
            this.$refs.vacationDetail.getActions();
            this.$refs.vacationDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.vacationlist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.vacationDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.vacationform.saveForm();
            this.$refs.vacationform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.vacationform.saveFormValidate('submit');
            // this.dialogFormVisiblevacation = false;
        },
        saveStatus(status) {
            this.dialogFormVisiblevacation = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>