<template>
    <div id="Submission">
        <el-card class="box-card">
               <!-- 查询 -->
                <div id="SubmissionFilter">
                    <el-form :inline="true"  label-width="90px"  label-position="left" class="demo-form-inline">
                        <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="呈报件编号">
                                    <el-input placeholder="请输入呈报件编号" v-model="params.submissionNo"></el-input>
                                </el-form-item>
                            </el-col>
                           <el-col :span="8">
                                <el-form-item label="文件标题">
                                    <el-input placeholder="请输入文件标题" v-model="params.title"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="拟稿时间" >
                                        <el-date-picker placeholder="请输入拟稿时间" v-model="params.draftTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                </el-form-item>
                            </el-col>
                         </el-row>
                         <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="单据状态">
                                    <el-select v-model="params.status" placeholder="请选择单据状态">
                                        <el-option v-for="item in s_status" 
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-button type="primary" @click="searchList">查询</el-button>
                                    <el-button  @click="resetInput">重置</el-button>
                                </el-form-item>
                            </el-col>
                    </el-row>
                    </el-form>
                </div>

                  <!-- 新建 -->
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
                </div>
                <div id="SubmissionList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="submissionNo" label="呈报件编号">
                    </el-table-column>
                    <el-table-column prop="organName" label="公司部门">
                    </el-table-column>
                    <el-table-column prop="title" label="文件标题">
                    </el-table-column>
                    <el-table-column prop="draftUnit" label="拟稿单位">
                    </el-table-column>
                    <el-table-column prop="draftTime" label="拟稿时间">
                    </el-table-column>
                    <el-table-column prop="draftUser" width="250" label="拟稿人"></el-table-column>
                     <el-table-column  width="100" label="单据状态">
                         <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                     </el-table-column>
                     <el-table-column label="操作" width="100">
                             <template slot-scope="scope">
                             
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left"
                             v-if="scope.row.status == '00' || scope.row.status == '02'" >
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left"
                             v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                   <br />
                 <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.page" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
          </el-card>
        <br>
        <el-card class="box-card">
            <SubmissionDetail :formId="formId" ref="SubmissionDetail" @reloadList = "reloadList" @resetStatus = "resetStatus"></SubmissionDetail>
             <!-- :formId="formId" -->
        </el-card>
         <SubmissionForm  ref="SubmissionForm" @reloadList = "reloadList"></SubmissionForm>
         <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import SubmissionForm from "./SubmissionForm";
import SubmissionDetail from "./SubmissionDetail";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "Submission",
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            s_status: [
                    {
                        value: '00',
                        label: '已保存'
                    },
                    {
                        value: '01',
                        label: '审核中'
                    },
                    {
                        value: '02',
                        label: '已驳回'
                    },
                    {
                        value: '04',
                        label: '已完成'
                    }
                ],
            params: {
                page: 1,
                pageSize: 5,
                desc: true,
                options: [],
                orderBy: "created"
            },
            formName:"submission_forms"
        };
    },
    components: {
        SubmissionForm,
        SubmissionDetail
    },
    filters: {
        filterStatus: function(data) {
            let xmlJson = {
               "00":"已保存", 
               "01":"审核中",
               "02" :"已驳回",
               "03" :"已撤销",
               "04" :"已完成"
            };
            return xmlJson[data];
        }
    },
    methods: {
         time_change(time) {
            // 改变时间获取数据
            if (time === null) {
               this.params.startTime = "";
                this.params.endTime = "";
            } else {
                let time0 = time[0];
                let time1 = time[1];
                this.params.startTime = time0;
                this.params.endTime = time1;
            }
           
        },
        //获取列表
         async getList(page) {
            let $self = this;
             this.searchOptions = [];
             if (this.params.submissionNo && this.params.submissionNo.trim() !== "") {
                 this.searchOptions.push({
                     field: "submissionNo",
                     filter: "LIKE",
                     value: this.params.submissionNo
                 });
             }
             if (this.params.title && this.params.title.trim() !== "") {
                 this.searchOptions.push({
                     field: "title",
                     filter: "LIKE",
                     value: this.params.title
                 });
             }
             if (this.params.wordNo && this.params.wordNo.trim() !== "") {
                 this.searchOptions.push({
                     field: "wordNo",
                     filter: "LIKE",
                     value: this.params.wordNo
                 });
             }
             if (this.params.status && this.params.status.trim() !== "") {
                 this.searchOptions.push({
                     field: "status",
                     filter: "EQUAL",
                     value: this.params.status
                 });
             }
             if (this.params.draftTime) {
                 this.searchOptions.push({
                     field: 'draftTime',
                     filter: 'BETWEEN',
                     value: this.params.draftTime,
                     value2: this.params.draftTime
                 });
             }
             this.params.options = this.searchOptions
            $self.url = "/api/v1/submission_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                   let formId = response.data.forms[0].id;
                   $self.$refs.SubmissionDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.SubmissionDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.SubmissionForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.SubmissionForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.SubmissionDetail.getFormDetails(params.id);
            }
        },
        resetStatus(data){
              let $self = this;
            for(let item of $self.tableData){
                if(data.id == item.id){
                  item.status = data.status;
                }
            }
        },

        //分页
        currentChange(page) {
            this.params.page = page;
            this.getList(page);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.getList();
        },
        resetInput() {
            this.params = {
                page: 1,
                pageSize: 5,
                desc: true,
                options: [],
                orderBy: "created"
            }
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
      #SubmissionFilter  .el-form-item--small.el-form-item{
            width: 100%;
        }
</style>
<style scoped>

#SubmissionFilter .filterForm >>> .el-form-item__content{
        width: calc(100% - 100px);
    }
    #SubmissionFilter .filterForm >>> .el-select {
        width: 100%;
    }
    #SubmissionFilter .filterForm >>> .el-date-editor{
        width: 100%;
    }
</style>

