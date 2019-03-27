<template>
    <div id="Discussion">
        <el-card class="box-card">
            <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="议题名称">
                            <el-input v-model="params.topicName" placeholder="请输入议题名称"></el-input>
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
                <el-table-column prop="topicName" label="议题名称">
                </el-table-column>
                <el-table-column prop="creatorName" label="提单人">
                </el-table-column>
                <el-table-column prop="organName" label="所属部门">
                </el-table-column>
                <el-table-column prop="committed" label="提单时间">
                </el-table-column>
                <el-table-column prop="applyDepartment" label="提请部门">
                </el-table-column>
                <el-table-column prop="timeApplication" label="提请时间">
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
            <DiscussionDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="DiscussionDetail"></DiscussionDetail>
        </el-card>
        <DiscussionForm  ref="DiscussionForm" @reloadList = "reloadList"></DiscussionForm>
    </div>
</template>
<script>
import DiscussionForm from './DiscussionForm';
import DiscussionDetail from './DiscussionDetail';
import {publicMethods} from "../application.js";
import axios from 'axios';
export default {
    mixins:[publicMethods],
    name: 'Discussion',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                topicName: '',
                total: 0
            },
            dialogFormVisibleDiscussion: false,
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
        DiscussionForm,
        DiscussionDetail
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
                this.$refs.DiscussionDetail.getFormDetails(params.id);
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
                    $self.$refs.DiscussionDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        clickTableRow(row) {
            this.$refs.DiscussionDetail.getFormDetails(row.id);
        },
        editForm(data) {
            this.$refs.DiscussionForm.setDataFromParent(data);
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
            this.params.topicName = '';
            this.onSubmit();
        },
        onSubmit() {
            this.getList();
        },
        cleanform() {
            this.$refs.DiscussionForm.createForm();
        },
        refreshBoardData() {
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
    #Discussion {
        .card_margin_10 {
            margin-top: 10px;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
    }
</style>
<style scoped>
    #Discussion .filterForm >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
</style>