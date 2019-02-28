<template>
    <div>
        <el-tabs @tab-click="handleClick">
            <el-card class="box-card">
                <MotionFilter @searchList="getSearchOptions"></MotionFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm()">新建</el-button>
                </div>
                <MotionList ref="motionlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></MotionList>
            </el-card>
            <br>
            <el-card class="box-card">
                <MotionDetail @refreshData="refreshData" :formId="formId" ref="motiondetail"></MotionDetail>
            </el-card>
            <el-dialog title="中关村发展集团子公司三会文件" :close-on-click-modal="false" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" @close='closeDialog'>
                <MotionForm ref="motionform" @refreshData="refreshData" @info="getInfo" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType"></MotionForm>
                <div slot="footer" class="dialog-footer">
                    <el-button type="default" @click="saveForm">保存</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <!-- <el-button type="default" @click="cancelForm">撤销</el-button> -->
                </div>
            </el-dialog>
            <!-- <el-tab-pane label="决议上传" name="second">
                <MotionResolution :formId="formId" @searchList="getSearchOptions"></MotionResolution>
            </el-tab-pane> -->
        </el-tabs>

    </div>
</template>
<script>
import axios from 'axios';
import MotionList from './MotionList';
import MotionForm from './MotionForm';
import MotionFilter from './MotionFilter';
import MotionDetail from './MotionDetail';
export default {
    name: 'motion',
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            sstatus: ''
        };
    },
    methods: {
        refreshDetail() {
            if (this.$refs.motiondetail) {
                this.$refs.motiondetail.getForm();
                this.$refs.motiondetail.getActions();
            }
        },
        createForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.motionform) {
                this.$refs.motionform.clearForm();
                this.$refs.motionform.getno();
            }
        },
        handleClick() {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        getInfo(info) {
            this.sstatus = info;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.motionlist.getList();
            this.$refs.motiondetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            // this.$refs.motionform.saveForm1();
            // this.dialogFormVisible = false;
            this.$refs.motionform.saveForm1();
            if (this.sstatus == 'saveRuleSucceed') {
                this.dialogFormVisible = false;
                this.sstatus = '';
            }
        },
        submitForm() {
            this.$refs.motionform.dialogVisiblea();
            // if(this.$refs.motionform.rows.title && this.$refs.motionform.rows.draftTime){
            //     this.$refs.motionform.submitCheck();
            //     this.$refs.motionform.dialogVisible = false;
            //     this.dialogFormVisible = false;
            // }else{
            //     this.dialogFormVisible = true;
            //     alert('请填写必填项')
            // }
        },
        cancelForm() {
            this.$refs.motionform.cancelForm();
            this.dialogFormVisible = false;
        },
        closeDialog() {
            this.$refs.motionform.clearTime();
        }
    },
    components: {
        MotionList,
        MotionForm,
        MotionFilter,
        MotionDetail
    }
};
</script>
<style lang="scss" scoped>
</style>


