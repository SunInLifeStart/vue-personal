<template>
    <div id="Outgoing" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <OutgoingFilter @searchList="getSearchOptions"></OutgoingFilter>
            </el-card>
            <el-card class="box-card card_margin_10">
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                </div>
                <OutgoingList ref="outgoinglist" @showStatus="showStatus" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></OutgoingList>
            </el-card>
            <el-card class="box-card card_margin_10">
                <OutgoingDetail ref="outgoingdetail" @refreshData="refreshData" :formId="formId"></OutgoingDetail>
                <!-- <index :formId="formId"></index> -->
            </el-card>
        </div>
        <el-dialog title="发文拟稿" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" @close='closeDialog'>
            <OutgoingForm ref="outgoingform" @refreshData="refreshData" @saveStatus="saveStatus" :formId="dialogFormId" :operationType="operationType"></OutgoingForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm" v-if="this.status == '' || this.status == '已驳回' ">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import OutgoingForm from './OutgoingForm';
import OutgoingFilter from './OutgoingFilter';
import OutgoingList from './OutgoingList';
import OutgoingDetail from './OutgoingDetail';
// import index from './index.vue';
export default {
    name: 'Outgoing',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            status: ''
        };
    },
    components: {
        OutgoingForm,
        OutgoingFilter,
        OutgoingList,
        OutgoingDetail
        // index
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        showStatus(status) {
            if (status == '已保存') {
                this.status = '';
            } else {
                this.status = '已驳回';
            }
        },
        createForm() {
            this.status = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.outgoingform) {
                this.$refs.outgoingform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.outgoinglist.getList();
            this.$refs.outgoingdetail.getForm();
        },
        saveForm() {
            this.$refs.outgoingform.saveFormValidate();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.outgoingform.saveFormValidate('save');
        },
        closeDialog() {
            this.$refs.outgoingform.clearTime();
        }
    }
};
</script>
<style lang="scss" scoped>
    #Outgoing {
        .card_margin_10 {
            margin-top: 10px;
        }
    }
</style>