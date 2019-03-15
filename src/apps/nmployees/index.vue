<template>
    <div id="nmployees">
        <el-card class="box-card">
            <nmployeesFilter @searchList="getBoardSearchOptions"></nmployeesFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <nmployeesList ref="nmployeeslist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></nmployeesList>
        </el-card>
        <br>
        <el-card class="box-card">
            <nmployeesDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="nmployeesDetail"></nmployeesDetail>
        </el-card>
        <el-dialog title="新员工转正申请表" :visible.sync="dialogFormVisiblenmployees" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <nmployeesForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="nmployeesform" :formId="dialogBoardFormId" :operationType="operationBoardType"></nmployeesForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import nmployeesFilter from './nmployeesFilter';
import nmployeesForm from './nmployeesForm';
import nmployeesList from './nmployeesList';
import nmployeesDetail from './nmployeesDetail';
export default {
    name: 'nmployees',
    mounted() {},
    data() {
        return {
            dialogFormVisiblenmployees: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        nmployeesFilter,
        nmployeesForm,
        nmployeesList,
        nmployeesDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisiblenmployees = true;
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
            this.dialogFormVisiblenmployees = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.nmployeesDetail.getForm();
            this.$refs.nmployeesDetail.getActions();
            this.$refs.nmployeesDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.nmployeeslist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.nmployeesDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.nmployeesform.saveForm();
            this.$refs.nmployeesform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.nmployeesform.saveFormValidate('submit');
            // this.dialogFormVisiblenmployees = false;
        },
        saveStatus(status) {
            this.dialogFormVisiblenmployees = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>