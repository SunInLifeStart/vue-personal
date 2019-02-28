<template>
    <div>
        <el-card class="box-card">
            <TravelFilter @searchList="getSearchOptions"></TravelFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
            </div>
            <TravelList @searchList="getSearchOptions" ref="travellist" @formId="getFormId" @editForm="editForm" @showStatus="showStatusT" :searchOptions="searchOptions"></TravelList>
        </el-card>
        <br>
        <el-card class="box-card">
            <TravelDetail :formId="formId" ref="TravelDetail"></TravelDetail>
        </el-card>
        <el-dialog title="出差审批单" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1240px">
            <TravelForm ref="travelform" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType" @saveStatus="saveStatus"></TravelForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <!-- v-if="this.showStatus == ''"  -->
                <el-button type="primary" @click="submitForm">提交</el-button>
                <!-- s<el-button type="default" @click="cancelForm">撤销</el-button> -->
            </div>
        </el-dialog>

    </div>
</template>
<script>
import TravelList from './TravelList';
import TravelForm from './TravelForm';
import TravelFilter from './TravelFilter';
import TravelDetail from './TravelDetail';
export default {
    name: 'travel',
    data() {
        return {
            activeName: 'first',
            dialogFormVisible: false,
            searchOptions: [
                {
                    field: 'id',
                    filter: 'IS_NOT_NULL'
                }
            ],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            showStatus: ''
        };
    },
    methods: {
        handleClick() {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        refreshDetail() {
            if (this.$refs.TravelDetail) {
                this.$refs.TravelDetail.getForm();
                this.$refs.TravelDetail.getActions();
            }
        },
        showStatusT(status) {
            if (status == '已保存') {
                this.showStatus = '';
            } else {
                this.showStatus = '已驳回';
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
            if (this.$refs.travelform) {
                this.$refs.travelform.getForm();
            }
        },
        refreshData() {
            this.$refs.travellist.getList();
        },
        saveForm() {
            this.$refs.travelform.saveFormValidate();
            // this.dialogFormVisible = false;
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.travelform.submitCheck();
            // this.dialogFormVisible = false;
        },
        createForm() {
            this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.travelform) {
                this.$refs.travelform.clearForm();
            }
        }
    },
    components: {
        TravelList,
        TravelForm,
        TravelFilter,
        TravelDetail
    }
};
</script>
<style lang="scss" scoped>
</style>


