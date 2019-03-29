<template>
    <div id="Train">
        <el-card class="box-card">
               <!-- 查询 -->
                <div id="TrainFilter">
                    <el-form :inline="true" label-width="70px" label-position="left" class="demo-form-inline">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="申请人">
                                    <el-input placeholder="请输入申请人" v-model="params.submitter"></el-input>
                                </el-form-item>
                            </el-col>
                           <el-col :span="8">
                                <el-form-item label="所属部门">
                                    <el-input placeholder="请输入所属部门" v-model="params.department"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" >
                                <el-form-item class="">
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
                <div id="TrainList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="submitter" label="申请人">
                    </el-table-column>
                    <el-table-column prop="department" label="所属部门">
                    </el-table-column>
                    <el-table-column prop="committed" label="提单时间">
                    </el-table-column>
                    <el-table-column prop="participant" label="培训/学习(参加人员)">
                    </el-table-column>
                    <el-table-column prop="schedule" width="250" label="日程安排">
                    </el-table-column>
                     <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" >
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                   <br />
                 <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
          </el-card>
        <br>
        <el-card class="box-card">
            <TrainDetail :formId="formId" ref="TrainDetail" @reloadList = "reloadList"></TrainDetail>
             <!-- :formId="formId" -->
        </el-card>
         <TrainForm  ref="TrainForm" @reloadList = "reloadList"></TrainForm>
         <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import TrainForm from "./TrainForm";
import TrainDetail from "./TrainDetail";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "Train",
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                pageNum: 1,
                pageSize: 5,
                department: "",
                submitter: "",
                total: 0
            },
            formName:"trainingApplication"
        };
    },
    components: {
        TrainForm,
        TrainDetail
    },
    methods: {
        //获取列表
         async getList(pageNum) {
            let $self = this;
            $self.url = "/api/v1/trainingApplication/queryList";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                   let formId = response.data.content.list[0].id;
                   $self.$refs.TrainDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.TrainDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.TrainForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.TrainForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.TrainDetail.getFormDetails(params.id);
            }
        },

        //分页
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList(pageNum);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.getList();
        },
        resetInput() {
            this.params.submitter = this.params.department = "";
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
      #TrainFilter  .el-form-item--small.el-form-item{
            width: 100%;
        }
</style>
