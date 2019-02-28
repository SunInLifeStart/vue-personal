<template>
  <div id="fundplandepartment" class="main-container">
    <div class="content-container">
      <el-card class="box-card">
        <fundplandepartmentFilter @searchList="getSearchOptions"></fundplandepartmentFilter>
        <div class="toolbar">
          <el-button type="primary" icon="el-icon-plus" @click="createForm">新建计划</el-button>
          <!-- <router-link to="/apps/fundplan/fundplandepartmentForm">
                        <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
          </router-link>-->
        </div>
        <fundplandepartmentList
          ref="fundplandepartmentList"
          @showStatus="showStatus"
          @getFormId="getFormId"
          @checkItem="checkItem"
          @editItem="editItem"
          @viewsForm="viewsForm"
          @editForm="editForm"
          :searchOptions="searchOptions"
          :operationType="operationType"
        ></fundplandepartmentList>
      </el-card>
      <br>
      <!-- <el-card class="box-card">
                <fundplandepartmentDetail :formId="formId" ref="fundplandepartmentdetail"></fundplandepartmentDetail>
      </el-card>-->
    </div>
    <el-dialog title :visible.sync="dialogFormVisible" width="100%" :close-on-click-modal="false">
      <fundplandepartmentForm
        @refreshDetail="refreshDetail"
        @refreshData="refreshData"
        @saveStatus="saveStatus"
        @saveSuccess="saveSuccess"
        ref="fundplandepartmentform"
        :formId="formId"
        :operationType="operationType"
      ></fundplandepartmentForm>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="saveForm" v-if="this.status == ''">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title :visible.sync="dialogForm" width="100%">
      <executiveArm></executiveArm>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import fundplandepartmentFilter from "./fundplandepartmentFilter";
import fundplandepartmentList from "./fundplandepartmentList";
import fundplandepartmentDetail from "./fundplandepartmentDetail";
import fundplandepartmentForm from "./fundplandepartmentForm";
import fundplanplanExecute from "./fundplanplanExecute";
import executiveArm from "./executiveArm";
export default {
  name: "fundplanpdepartment",
  mounted() {},
  data() {
    return {
      dialogFormVisible: false,
      dialogForm: false,
      searchOptions: [],
      formId: null,
      dialogFormId: null,
      operationType: "create",
      status: ""
    };
  },
  components: {
    fundplandepartmentFilter,
    fundplandepartmentList,
    fundplandepartmentDetail,
    fundplandepartmentForm,
    fundplanplanExecute,
    executiveArm
  },
  watch: {
    formId: function() {
      this.$nextTick(function() {
        this.$refs.fundplandepartmentform.getFormById();
      });

    }
  },
  methods: {
    
    
    refreshDetail() {
      if (this.$refs.fundplandepartmentdetail) {
        // this.$refs.fundplandepartmentdetail.getForm();
        this.$refs.fundplandepartmentdetail.getActions();
        this.$refs.fundplandepartmentdetail.getCrumbs();
      }
    },
    getSearchOptions(searchOptions) {
      this.searchOptions = searchOptions;
    },
    showStatus(status) {
      if (status == "已保存") {
        this.status = "";
      } else {
        this.status = "已驳回";
      }
    },
    getFormId(id) {
      this.formId = id;
    },
    createForm() {
      this.status = "";
      this.dialogFormVisible = true;
      this.operationType = "create";
      this.$nextTick(function() {
        this.$refs.fundplandepartmentform.getYear();
      });

      if (this.$refs.fundplandepartmentform) {
        this.$refs.fundplandepartmentform.clearForm();
      }
    },
    editForm(id) {
      this.dialogFormId = id;
      this.dialogForm = true;
      this.operationType = 'edit';
    },
    viewsForm(id) {
      this.dialogFormId = id;
      // this.dialogFormVisible = true;
      this.operationType = "viewsForm";
    },
    checkItem(id) {
      this.formId = id;
      this.dialogFormVisible = true;
      this.operationType = "checkItem";
      console.log(1111111, id);
    },
    editItem(id) {
      this.formId = id;
      this.dialogFormVisible = true;
      this.operationType = "editItem";
    },
    refreshData() {
      this.$refs.fundplandepartmentList.getList();
    },
    //保存
    saveForm() {
      this.$refs.fundplandepartmentform.saveFormValidate();
    },
    saveStatus(status) {
      this.dialogFormVisible = status;
    },
    saveSuccess(status) {
      if (status == 200) {
        this.$nextTick(function() {
          this.$refs.fundplandepartmentList.getList();
        });
      }
    },
    //提交
    submitForm() {
      this.$refs.fundplandepartmentform.submitCheck();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>