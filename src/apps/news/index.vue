<template>
    <div id="Train">
        <el-card class="box-card">
               <!-- 查询 -->
          

                  <!-- 新建 -->
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
                </div>
                <div id="TrainList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="title" label="标题">
                    </el-table-column>
                    <el-table-column prop="reportingOrg" label="报送单位">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="作者">
                    </el-table-column>
                    <el-table-column prop="created" width="250" label="创建时间"></el-table-column>
                     <el-table-column  width="100" label="单据状态">
                         <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                     </el-table-column>
                </el-table>
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
                   <br />
                 <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
          </el-card>
        <br>
        <el-card class="box-card">
            <newsDetail :formId="formId" ref="newsDetail" @reloadList = "reloadList" @resetStatus = "resetStatus"></newsDetail>
        </el-card>
         <newsForm  ref="newsForm" @reloadList = "reloadList"></newsForm>
    </div>
</template>
<script>
import newsForm from "./newsForm";
import newsDetail from "./newsDetail";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "news",
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                page: 1,
                pageSize: 5,
                desc: true,
                options: [],
                orderBy: "created"
               
            },
            formName:"news_forms"
        };
    },
    components: {
        newsForm,
        newsDetail
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
        //获取列表
         async getList(pageNum) {
            let $self = this;
            $self.url = "/api/v1/news_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                   let formId = response.data.forms[0].id;
                   $self.$refs.newsDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.newsDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.newsForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.newsForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.newsDetail.getFormDetails(params.id);
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
            this.params={
               department: "",
                submitter: "",
                committed:"",
                status:"",
                trainingTime:[],
                 startTime:"",
                endTime:"",
               
            }
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
         #TrainFilter {
             .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }}
</style>


