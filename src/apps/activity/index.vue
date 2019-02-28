<template>
    <div id="Activity" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ActivityFilter @searchList="getSearchOptions"></ActivityFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                     <el-button type="primary" @click="moreDelete">批量删除</el-button>
                      <el-button type="primary" @click="moreUplode">批量下载</el-button>
                </div>
                <ActivityList ref="activitylist" @formId="getFormId" @editForm="editForm" @reportForm="reportForm" :searchOptions="searchOptions"></ActivityList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ActivityDetail :formId="formId" v-show="true" ref="activitydetail"></ActivityDetail>
                <!-- <PublicityActivitiesDetail ref="publicityactivitiesdetail" :formId="formId2" v-show="detailShow2 == true"></PublicityActivitiesDetail> -->
            </el-card>
        </div>
        <el-dialog title="活动报告" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%">
            <ActivityForm ref="activityform" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></ActivityForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">暂存</el-button>
                <el-button type="primary" @click="submitForm">立即提交</el-button>
                <!-- <el-button type="default" @click="cancelForm">撤销</el-button> -->
            </div>
        </el-dialog>
        <el-dialog title="宣传活动" :visible.sync="dialogFormVisible2" max-width="1280px" width="70%" :close-on-click-modal="false">
            <PublicityActivitiesForm ref="publicityactivitiesform" @saveStatus="saveStatus" @refreshData="refreshData" :formId="dialogFormId2" :operationType="operationType2"></PublicityActivitiesForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm2">备案</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ActivityForm from "./ActivityForm";
import ActivityFilter from "./ActivityFilter";
import ActivityList from "./ActivityList";
import ActivityDetail from "./ActivityDetail";
// import PublicityActivitiesDetail from "./PublicityActivitiesDetail";
import PublicityActivitiesForm from "./PublicityActivitiesForm";
export default {
    name: "Activity",
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisible2: false,
            searchOptions: [
                {
                    field: "canceled",
                    filter: "IS_NULL"
                }
            ],
            formId: "",
            formId2: "",
            dialogFormId: "",
            dialogFormId2: "",
            operationType: "create",
            operationType2: "create",
            detailShow: false,
            detailShow2: false
        };
    },
    components: {
        ActivityForm,
        ActivityFilter,
        ActivityList,
        ActivityDetail,
        // PublicityActivitiesDetail,
        PublicityActivitiesForm
    },
    methods: {
        role(){
            if(cookies.get('uname') == '伍孟然' || cookies.get('uname') == '赵倩影'){
                this.roleaa =true
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id, status) {
            this.formId = id;
        },
        createForm() {
            this.dialogFormId2 = "";
            this.dialogFormVisible2 = true;
            this.operationType2 = "create";
        },
        editForm(id) {
            this.dialogFormId2 = id;
            this.dialogFormVisible2 = true;
            this.operationType2 = "edit";
        },
        reportForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
        },
        refreshData() {
            this.$refs.activitylist.getList();
            this.$refs.activitydetail.getForm();
            // this.$refs.publicityactivitiesdetail.getForm();
            //this.$refs.publicityactivitiesdetail.clearForm();
        },
        saveForm() {
            this.storage = true;
            this.$refs.activityform.saveForm("storage");
            this.dialogFormVisible = false;
        },
        saveForm2() {
            this.$refs.publicityactivitiesform.saveForm1();
            // this.dialogFormVisible2 = false;
        },
        submitForm() {
            this.$refs.activityform.submitCheck("submit");
            this.dialogFormVisible = false;
        },
        cancelForm() {
            this.$refs.activityform.cancelForm();
            this.dialogFormVisible = false;
        },
        moreDelete() {
            // if (this.$refs.ActivityList) {
                this.$refs.activitylist.moreDelete();
            // }
        },
        saveStatus (status) {
            this.dialogFormVisible2 = status;
        },
        moreUplode() {
            if (this.$refs.activitylist) {
                this.$refs.activitylist.moreUplode();
            }
        },
    }
};
</script>
<style lang="scss" scoped>
</style>