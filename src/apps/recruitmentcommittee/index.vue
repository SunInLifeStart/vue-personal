<template>
    <div id="RecruitmentCommittee">
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
                <!--<el-table-column prop="status" label="单据状态" width="200"></el-table-column>-->
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
            <RecruitmentCommitteeDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="RecruitmentCommitteeDetail"></RecruitmentCommitteeDetail>
        </el-card>
        <RecruitmentCommitteeForm  ref="RecruitmentCommitteeForm" @reloadList = "reloadList"></RecruitmentCommitteeForm>
    </div>
</template>
<script>
    import RecruitmentCommitteeForm from './RecruitmentCommitteeForm';
    import RecruitmentCommitteeDetail from './RecruitmentCommitteeDetail';
    import {publicMethods} from "../application.js";
    import axios from 'axios';
    export default {
        mixins:[publicMethods],
        name: 'RecruitmentCommittee',
        data() {
            return {
                tableData: [],
                params: {
                    pageNum: 1,
                    pageSize: 5,
                    topicName: '',
                    total: 0
                },
                searchOptions: [],
                dialogFormVisibleRecruitmentCommittee: false,
                searchBoardOptions: [],
                formBoardId: '',
                dialogBoardFormId: '',
                operationBoardType: 'create',
                formName:"issuesReported",
                statusNews: ''
            };
        },
        components: {
            RecruitmentCommitteeForm,
            RecruitmentCommitteeDetail
        },
        mounted() {
            this.getList();
        },
        watch: {
            searchOptions: function() {
                this.params.pageNum = 1;
                this.getList();
            }
        },
        methods: {
            reloadList(params) {
                if (params == "reload") {
                    this.params.pageNum = 1;
                    this.getList();
                } else {
                    this.$refs.RecruitmentCommitteeDetail.getFormDetails(params.id);
                }
            },
            async getList() {
                const $self = this;
                $self.url = "/api/v1/issuesReported/queryList";
                let response = await $self.getQueryList();
                if (response) {
                    if (response.data.content.list.length > 0) {
                        let formId = response.data.content.list[0].id;
                        $self.$refs.RecruitmentCommitteeDetail.getFormDetails(formId);
                    }
                    $self.tableData = response.data.content.list;
                    $self.params.total = response.data.content.total;
                } else {
                    $self.msgTips("获取列表失败", "warning");
                }
            },
            clickTableRow(row) {
                this.$refs.RecruitmentCommitteeDetail.getFormDetails(row.id);
            },
            editForm(data) {
                this.$refs.RecruitmentCommitteeForm.setDataFromParent(data);
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
                this.$refs.RecruitmentCommitteeForm.createForm();
            },
            refreshBoardData() {
                this.getList();
            }
        }
    };
</script>
<style lang="scss" scoped>
    #RecruitmentCommittee {
        .card_margin_10 {
            margin-top: 10px;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
    }
</style>
<style scoped>
    #RecruitmentCommittee .filterForm >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
</style>