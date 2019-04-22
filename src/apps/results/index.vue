<template>
    <div id="Results">
        <el-card class="box-card">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="项目名称">
                            <el-input v-model="params.projectName" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购项目名称">
                            <el-input v-model="params.purchaseProjectName" placeholder="请输入采购项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购发起时间">
                            <el-date-picker v-model="params.purchaseStartTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请输入采购发起时间" style="width:100%" type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="单据状态">
                            <el-select v-model="params.status" placeholder="请输入单据状态">
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
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                            <el-button @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card card_margin_10">
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="cleanform">新建</el-button>
            </div>

            <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
                <el-table-column prop="topicName" label="项目名称">
                </el-table-column>
                <el-table-column prop="creatorName" label="采购项目名称">
                </el-table-column>
                <el-table-column prop="organName" label="目标成本/预算完成情况">
                </el-table-column>
                <el-table-column prop="committed" label="采购起止时间">
                </el-table-column>
                <el-table-column prop="applyDepartment" label="采购内容摘要">
                </el-table-column>
                <el-table-column prop="timeApplication" label="采购过程简述">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="left">
                            <el-button type="text" icon="el-icon-delete" @click="deleteCurrentLine(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <br />
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
        </el-card>
        <el-card class="box-card card_margin_10">
            <ResultsDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="ResultsDetail" @reloadList = "reloadList"></ResultsDetail>
        </el-card>
        <ResultsForm  ref="ResultsForm" @reloadList = "reloadList"></ResultsForm>
    </div>
</template>
<script>
import ResultsForm from './ResultsForm';
import ResultsDetail from './ResultsDetail';
import {publicMethods} from "../application.js";
import axios from 'axios';
export default {
    mixins:[publicMethods],
    name: 'Results',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                topicName: '',
                total: 0
            },
            dialogFormVisibleResults: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            formName:"issuesReported",
            appFlowName:'motor-issuesreported_party-agendasheet',
            statusNews: ''
        };
    },
    components: {
        ResultsForm,
        ResultsDetail
    },
    mounted() {
        this.getList();
    },
    methods: {
        reloadList(params) {
            if (params == "reload") {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.ResultsDetail.getFormDetails(params.id);
            }
        },
        searchList() {
            this.getList();
        },
        async getList() {
            const $self = this;
            $self.url = "/api/v1/issuesReported/queryList";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    // $self.$refs.ResultsDetail.getFormDetails(formId);
                }
                // $self.tableData = response.data.content.list;
                // $self.params.total = response.data.content.total;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        clickTableRow(row) {
            this.$refs.ResultsDetail.getFormDetails(row.id);
        },
        editForm(data) {
            this.$refs.ResultsForm.setDataFromParent(data);
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        onReset() {
            this.params = {
                pageNum: 1,
                pageSize: 5
            }
            this.onSubmit();
        },
        onSubmit() {
            this.getList();
        },
        cleanform() {
            this.$refs.ResultsForm.createForm();
        },
        refreshBoardData() {
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
    #Results {
        .el-select {
            width: 100%;
        }
        .card_margin_10 {
            margin-top: 10px;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
    }
</style>
<style scoped>
    #Results .filterForm >>> .el-form-item__content{
        width: calc(100% - 110px);
    }
</style>