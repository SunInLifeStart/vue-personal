<template>
    <div id="Files">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="FilesFilter">
                <el-form :inline="true" label-width="100px" label-position="left" class="demo-form-inline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名：">
                                <el-input v-model="formInline.proposer" placeholder="" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间：">
                                <!-- <el-input v-model="formInline.applyDept" placeholder=""></el-input> -->
                                 <el-date-picker v-model="formInline.created" value-format="yyyy-MM-dd" style="width:100%" type="date" >
                                  </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属月份：" prop="status">
                                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                                    <el-option v-for="item in onOption"
                                     :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="印刷文件名称：">
                                <el-input v-model="formInline.proposername" placeholder="" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否属于年度预算内:" >
                                <el-radio v-model="formInline.type" label="true">是</el-radio>
                                <el-radio v-model="formInline.type" label="false">否</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="searchBtn">
                            <el-form-item class="positionBtn">
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
            <div id="FilesList">
                <el-table :data="tableData" style="width: 100%; cursor:pointer" highlight-current-row @row-click="showCurrentId">
                    <el-table-column prop="proposer" label="申请人">
                    </el-table-column>
                    <el-table-column prop="applyDept" label="申请部门">
                    </el-table-column>
                    <el-table-column prop="applyDate" label="申请日期" sortable >
                        <template slot-scope="scope">
                            {{scope.row.applyDate | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="applyDept" label="是否属于年度预算内">
                    </el-table-column>
                    <el-table-column prop="applyDept" label="资金计划所属月份">
                    </el-table-column>
                    <el-table-column prop="applyDept" label="总印刷数量">
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态"  :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)" v-show="scope.row.status!='01'&&scope.row.status!='04'"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)" v-show="scope.row.status!='01'&&scope.row.status!='04'"></el-button>
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
            <FilesDetail :formId="formId" ref="FilesDetail" @reloadList="reloadList" @resetStatus="resetStatus"></FilesDetail>
        </el-card>
        <FilesForm ref="FilesForm" @reloadList="reloadList"></FilesForm>
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import FilesForm from "./FilesForm";
import FilesDetail from "./FilesDetail";
import { CONFIG } from '../data.js';
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "Files",
    data() {
        return {
            onOption: [
                {
                    value: 'yiyue',
                    label: '一月'
                },
                {
                    value: 'eryue',
                    label: '二月'
                },
                {
                    value: 'sanyue',
                    label: '三月'
                },
                {
                    value: 'siyue',
                    label: '四月'
                },
                {
                    value: 'wuyue',
                    label: '五月'
                },
                {
                    value: 'liuyue',
                    label: '六月'
                },
                {
                    value: 'qiyue',
                    label: '七月'
                },
                {
                    value: 'bayue',
                    label: '八月'
                },
                {
                    value: 'jiuyue',
                    label: '九月'
                },
                {
                    value: 'shiyue',
                    label: '十月'
                },
                {
                    value: 'shiyiyue',
                    label: '十一月'
                },
                {
                    value: 'shieryue',
                    label: '十二月'
                },
            ],
            statusAll: CONFIG['status'],
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                desc: true,
                page: 1,
                pageSize: 5,
                department: "",
                submitter: "",
                total: 0,
                orderBy: 'created',
                desc: true,
                options: []
            },
            searchOptions: [],
            formName: "files_forms",
            formInline: {
                proposer: '',
                created: '',
                applyDate: [],
                status: '',
                type:"",
                proposername:'',
            },
        };
    },
    components: {
        FilesForm,
        FilesDetail
    },
    methods: {
        
        //获取列表
        async getList(pageNum) {
            this.onSubmit();
            let $self = this;
            $self.url = "/api/v1/files_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.FilesDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;

            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.proposer.trim() !== '') {
                this.searchOptions.push({
                    field: 'proposer',
                    filter: 'LIKE',
                    value: this.formInline.proposer
                });
            }
           
            if (
                this.formInline.applyDate &&
                this.formInline.applyDate.length > 0
            ) {
                this.searchOptions.push({
                    field: 'applyDate',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.applyDate[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.applyDate[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            this.params.options = this.searchOptions;
        },
        //选择行
        showCurrentId(row) {
            this.$refs.FilesDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.FilesForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.FilesForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.FilesDetail.getFormDetails(params.id);
            }
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
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
            this.formInline.proposer = '';
            // this.formInline.applyDept = '';
            this.formInline.applyDate = [];
            this.formInline.status = '';
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.status) {
                case '00':
                    state = "已保存";
                    break;
                case '01':
                    state = "审核中";
                    break;
                case '02':
                    state = "驳回";
                    break;
                case '03':
                    state = "撤销";
                    break;
                case '04':
                    state = "已完成";
                    break;
            }
            return state;
        },
    },
    mounted() {
        this.getList();

    }
};
</script>
<style scoped>
#FilesFilter  >>> .el-select{
        width: calc(100% - 0px);
    }
     #FilesFilter >>> .el-form-item__content{
        width: calc(100% - 110px);
    }
     #FilesFilter >>> .el-checkbox{
         width: 30px;
    }
</style>

<style lang="scss" scoped>
#FilesFilter .el-form-item--small.el-form-item {
  width: 100%;
}
#FilesFilter {
             .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }}
</style>
