<template>
    <div id="Discussion">
        <el-card class="box-card">
            <DiscussionFilter @searchList="getBoardSearchOptions"></DiscussionFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>
            <DiscussionList ref="Discussionlist" @formId="getBoardFormId" @editForm="editBoardForm" :searchOptions="searchBoardOptions" @showStatus="showStatus"></DiscussionList>
        </el-card>
        <br>
        <el-card class="box-card">
            <DiscussionDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="DiscussionDetail"></DiscussionDetail>
        </el-card>
        <el-dialog title="议题呈报" :visible.sync="dialogFormVisibleDiscussion" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
            <DiscussionForm @refreshData="refreshBoardData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" ref="Discussionform" :formId="dialogBoardFormId" :operationType="operationBoardType"></DiscussionForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveBoardForm">保存</el-button>
                <!--<el-button type="primary" @click="submitBoardForm">提交</el-button>-->
                <!-- <el-button type="default">撤销</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import DiscussionFilter from './DiscussionFilter';
import DiscussionForm from './DiscussionForm';
import DiscussionList from './DiscussionList';
import DiscussionDetail from './DiscussionDetail';
export default {
    name: 'Discussion',
    mounted() {},
    data() {
        return {
            dialogFormVisibleDiscussion: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            statusNews: ''
        };
    },
    components: {
        DiscussionFilter,
        DiscussionForm,
        DiscussionList,
        DiscussionDetail
    },
    methods: {
        cleanform() {
            this.operationBoardType = 'create';
            this.statusNews = '';
            this.dialogFormVisibleDiscussion = true;
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
            this.dialogFormVisibleDiscussion = true;
            this.operationBoardType = 'edit';
        },
        refreshDetail() {
            this.$refs.DiscussionDetail.getForm();
            this.$refs.DiscussionDetail.getActions();
            this.$refs.DiscussionDetail.getCrumbs();
        },
        refreshBoardData() {
            this.$refs.Discussionlist.getList();
            // if (this.operationBoardType == "edit") {
            //     this.$refs.DiscussionDetail.getForm();
            // }
        },
        saveBoardForm() {
            // this.$refs.Discussionform.saveForm();
            this.$refs.Discussionform.saveFormValidate();
        },
        submitBoardForm() {
            this.$refs.Discussionform.saveFormValidate('submit');
            // this.dialogFormVisibleDiscussion = false;
        },
        saveStatus(status) {
            this.dialogFormVisibleDiscussion = status;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>