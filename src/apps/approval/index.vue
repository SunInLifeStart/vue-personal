<template>
    <div id="Approval">
        <el-card class="box-card">
               <!-- 查询 -->
                <div id="ApprovalFilter">
                    <el-form :inline="true" label-position="left" class="demo-form-inline">
                        <el-row class="filterForm">
                            <!-- 印章种类、申请日期、申请人、申请部门 -->
                            <el-col :span="8">
                                <el-form-item label="印章种类">
                                    <el-input placeholder="请输入印章种类" v-model="params.useItems"></el-input>
                                </el-form-item>
                            </el-col>
                           <el-col :span="8">
                                <el-form-item label="申请人">
                                    <el-input placeholder="请输入申请人" v-model="params.creatorName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="申请时间">
                                    <!-- <el-input placeholder="请输入申请时间" v-model="params.created"></el-input> -->
                                    <el-date-picker v-model="params.created" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                  </el-date-picker>
                                </el-form-item>
                            </el-col>
                         </el-row>
                          <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="申请部门">
                                    <el-input placeholder="请输入申请部门" v-model="params.organName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                               
                            </el-col>
                            <el-col :span="8" class="searchBtn">
                                <el-form-item class="positionBtn">
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
                <div id="ApprovalList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="useItems" label="印章种类">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="申请人">
                    </el-table-column>
                    <el-table-column prop="recipientsTime" label="领用时间">
                    </el-table-column>
                    <el-table-column prop="fileName" label="用印文件名称">
                    </el-table-column>
                    <el-table-column prop="fileNum" width="250" label="用印份数"></el-table-column>
                     <!-- <el-table-column prop="status" width="250" label="状态"></el-table-column> -->
                    
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
            <ApprovalDetail :formId="formId" ref="ApprovalDetail" @reloadList = "reloadList"></ApprovalDetail>
             <!-- :formId="formId" -->
        </el-card>
         <ApprovalForm  ref="ApprovalForm" @reloadList = "reloadList"></ApprovalForm>
         <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import ApprovalForm from "./ApprovalForm";
import ApprovalDetail from "./ApprovalDetail";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "Approval",
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                pageNum: 1,
                pageSize: 5,
                creatorName: "",
                useItems: "",
                total: 0,
                created:"",
                organName:"",
            },
            formName:"singApproval"
        };
    },
    components: {
        ApprovalForm,
        ApprovalDetail
    },
    methods: {
        //获取列表
         async getList(pageNum) {
            let $self = this;
            $self.url = "/api/v1/singApproval/queryList";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                   let formId = response.data.content.list[0].id;
                   $self.$refs.ApprovalDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.ApprovalDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.ApprovalForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.ApprovalForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.ApprovalDetail.getFormDetails(params.id);
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
            this.params.useItems = this.params.creatorName = "";
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style scoped>

      #ApprovalFilter  .el-form-item--small.el-form-item{
            width: 100%;
        }
     #ApprovalFilter .filterForm >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
</style>
<style lang="scss" scoped>
 #ApprovalFilter {
        .searchBtn {
            padding-right: 25px;
            .positionBtn{
                text-align: right;
            }
        }
        
    }
</style>

