<template>
    <div id="MeetingSummary">
        <el-card class="box-card">
               <!-- 查询 -->
                <div id="MeetingSummary">
                    <el-form :inline="true"  label-width="90px"  label-position="left"  class="demo-form-inline">
                        <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="总办会编号">
                                    <el-input v-model="params.numbers" placeholder="编号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="拟稿单位">
                                    <el-input v-model="params.draftUnit" placeholder="拟稿单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="拟稿时间">
                                    <el-date-picker v-model="params.draftTime" type="date"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="filterForm">
                            <el-col :span="8">
                                <el-form-item label="拟稿人">
                                    <el-input v-model="params.drafter" placeholder="拟稿人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="单据状态">
                                    <el-select v-model="params.status" placeholder="请选择">
                                        <el-option
                                                v-for="item in statusOption"
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
                <div id="MeetingSummaryList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                   
                    <el-table-column  label="会议类型">
                         <template slot-scope="scope">{{scope.row.meetingType | filtermeetingType}}</template>
                     </el-table-column>
                    <el-table-column prop="numbers" label="会议编号">
                    </el-table-column>
                    <el-table-column prop="draftUnit" label="拟稿单位">
                    </el-table-column>
                    <el-table-column prop="draftTime" label="拟稿时间">
                    </el-table-column>
                    <el-table-column prop="drafter" label="拟稿人">
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
            <MeetingSummaryDetail :formId="formId" ref="MeetingSummaryDetail" @reloadList = "reloadList" @resetStatus = "resetStatus"></MeetingSummaryDetail>
             <!-- :formId="formId" -->
        </el-card>
         <MeetingSummaryForm  ref="MeetingSummaryForm" @reloadList = "reloadList"></MeetingSummaryForm>
         <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import MeetingSummaryForm from "./meetingSummaryForm";
import MeetingSummaryDetail from "./meetingSummaryDetail";
import moment from "moment";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: "MeetingSummary",
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            statusOption: [
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
            searchOptions: [],
            params: {
                orderBy:"created",
                desc:true,
                page: 1,
                pageSize: 5,
                total: 0,
                options: []
            },
            formName:"meeting_forms"
        };
    },
    components: {
        MeetingSummaryForm,
        MeetingSummaryDetail
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
        },
        filtermeetingType: function(data) {
            let xmlJson = {
               "specMeeting":"专题会", 
               "communMeeting":"班子沟通会",
               "gmoMeeting" :"总办会",
               "partyMeeting" :"党支委会",
               "recruMeeting" :"招采委员会"
            };
            
            return xmlJson[data];
        }
    },
    methods: {
        //获取列表
         async getList(pageNum) {
            let $self = this;
             this.searchOptions = [];
             if (this.params.numbers && this.params.numbers.trim() !== '') {
                 this.searchOptions.push({
                     field: 'numbers',
                     filter: 'EQUAL',
                     value: this.params.numbers
                 });
             }
             if (this.params.draftUnit && this.params.draftUnit.trim() !== '') {
                 this.searchOptions.push({
                     field: 'draftUnit',
                     filter: 'LIKE',
                     value: this.params.draftUnit
                 });
             }
             if (this.params.drafter && this.params.drafter.trim() !== '') {
                 this.searchOptions.push({
                     field: 'drafter',
                     filter: 'LIKE',
                     value: this.params.drafter
                 });
             }
             if (this.params.status && this.params.status.trim() !== '') {
                 this.searchOptions.push({
                     field: 'status',
                     filter: 'EQUAL',
                     value: this.params.status
                 });
             }
             if (this.params.draftTime && this.params.draftTime !== '') {
                 this.searchOptions.push({
                     field: 'draftTime',
                     filter: 'BETWEEN',
                     value: moment(this.params.draftTime).format(
                         'YYYY-MM-DD'
                     ),
                     value2: moment(this.params.draftTime).format(
                         'YYYY-MM-DD'
                     )
                 });
             }
            this.params.options = this.searchOptions
            $self.url = "/api/v1/meeting_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                   let formId = response.data.forms[0].id;
                   $self.$refs.MeetingSummaryDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.MeetingSummaryDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.MeetingSummaryForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.MeetingSummaryForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.MeetingSummaryDetail.getFormDetails(params.id);
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
            this.getList();
        },
        resetInput() {
            this.params = {
                page: 1,
                orderBy:"created",
                desc:true,
                pageSize: 5,
                options: [],
                total: 0
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
      #MeetingSummary  .el-form-item--small.el-form-item{
            width: 100%;
        }
         #MeetingSummary {
             .el-select {
                 width: 100%;
             }
         }
</style>
<style scoped>

#MeetingSummary .filterForm >>> .el-form-item__content{
        width: calc(100% - 100px);
    }
    #MeetingSummary .filterForm >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>

