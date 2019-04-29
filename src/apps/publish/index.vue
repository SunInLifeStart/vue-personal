<template>
    <div id="Publish">
        <el-card class="box-card">
               <!-- 查询 -->
                <div id="PublishFilter">
                    <el-form :inline="true"  label-width="80px"  label-position="left" class="demo-form-inline">
                        <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="标题:" prop="notice_person">
                                    <el-input v-model="params.title" placeholder="标题"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="信息类型:" style="padding-right: 0px;">
                                    <el-select v-model="params.type" placeholder="请选择信息类型">
                                        <!--<el-option label="领导讲话" value="领导讲话"></el-option>-->
                                        <el-option label="规章制度" value="规章制度"></el-option>
                                        <el-option label="通知公告" value="通知公告"></el-option>
                                        <!--<el-option label="工作简报" value="工作简报"></el-option>-->
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="单据状态:" style="padding-right: 0px;">
                                    <el-select v-model="params.status" placeholder="请选择状态">
                                        <el-option
                                                v-for="item in s_status"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="时间:" prop="created">
                                    <el-date-picker v-model="params.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-button type="primary" @click="searchList">查询</el-button>
                                    <el-button @click="resetInput">重置</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                  <!-- 新建 -->
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
                </div>
                <div id="PublishList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="title" label="标题">
                    </el-table-column>
                    <el-table-column prop="columns" label="类型">
                    </el-table-column>
                    <el-table-column prop="created" label="时间">
                    </el-table-column>
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
            <PublishDetail :formId="formId" ref="PublishDetail" @reloadList = "reloadList" @resetStatus = "resetStatus"></PublishDetail>
           
        </el-card>
         <PublishForm  ref="PublishForm" @reloadList = "reloadList"></PublishForm>
         <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import moment from "moment";
import PublishForm from "./PublishForm";
import PublishDetail from "./PublishDetail";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "Publish",
    data() {
        return {
            tableData: [],
            searchOptions: [],
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
                        value: '03',
                        label: '已撤销'
                    },
                    {
                        value: '04',
                        label: '已完成'
                    }
                ],
            params: {
                page: 1,
                pageSize: 5,
                total: 0,
                orderBy:'created',
                desc:true,
                options: []
            },
            formName:"publish_forms"
        };
    },
    components: {
        PublishForm,
        PublishDetail
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
         async getList(pageNum) {
            let $self = this;
            $self.url = "/api/v1/publish_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                   let formId = response.data.forms[0].id;
                   $self.$refs.PublishDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.PublishDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.PublishForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.PublishForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.PublishDetail.getFormDetails(params.id);
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
            this.params.page = pageNum;
            this.getList(pageNum);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.searchOptions = [];
            if (this.params.title && this.params.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.params.title
                });
            }
            if (this.params.type && this.params.type.trim() !== '') {
                this.searchOptions.push({
                    field: 'columns',
                    filter: 'LIKE',
                    value: this.params.type
                });
            }
            if (this.params.status && this.params.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.params.status
                });
            }
            if (this.params.created && this.params.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.params.created[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.params.created[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            this.params.options = this.searchOptions
            this.getList();
        },
        resetInput() {
            this.params={
                page: 1,
                pageSize: 5,
                total: 0,
                orderBy:'created',
                desc:true,
                options: []
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
      #PublishFilter  .el-form-item--small.el-form-item{
            width: 100%;
        }
         #PublishFilter {
             .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }}
</style>
<style scoped>

#PublishFilter .filterForm >>> .el-form-item__content{
        width: calc(100% - 90px);
    }
    #PublishFilter .filterForm >>> .el-select {
        width: calc(100% - 15px);
    }
    #PublishFilter .filterForm >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>

