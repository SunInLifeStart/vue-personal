<template>
    <div id="Train">
        <el-card class="box-card">
            <TrainFilter @searchList="getBoardSearchOptions"></TrainFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <TrainList ref="Trainlist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></TrainList>
        </el-card>
        <br>
        <el-card class="box-card">
            <TrainDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="TrainDetail"></TrainDetail>
        </el-card>
        <el-dialog title="外部培训申请表" :visible.sync="dialogFormVisibleTrain" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <TrainForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="Trainform" :formId="dialogBoardFormId" :operationType="operationBoardType"></TrainForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.statusNews == ''" @click="saveBoardForm">保存</el-button>
                <el-button type="primary" @click="submitBoardForm">提交</el-button>
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import TrainFilter from './TrainFilter';
import TrainForm from './TrainForm';
import TrainList from './TrainList';
import TrainDetail from './TrainDetail';
export default {
    name: 'Train',
    mounted() {},
    data() {
        return {
            dialogFormVisibleTrain: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        TrainFilter,
        TrainForm,
        TrainList,
        TrainDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleTrain = true;
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
            this.dialogFormVisibleTrain = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.TrainDetail.getForm();
            this.$refs.TrainDetail.getActions();
            this.$refs.TrainDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.Trainlist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.TrainDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.Trainform.saveForm();
            this.$refs.Trainform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.Trainform.saveFormValidate('submit');
            // this.dialogFormVisibleTrain = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleTrain = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>