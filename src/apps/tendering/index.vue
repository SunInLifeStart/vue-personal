<template>
    <div id="Tendering">
        <el-card class="box-card">
            <el-form :inline="true" label-width="100px"  label-position="left" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="项目名称">
                            <el-input v-model="params.projectName" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="招标项目名称">
                            <el-input v-model="params.biddingProjectName" placeholder="请输入采购项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="招标人">
                            <el-input v-model="params.tenderee" placeholder="请输入招标人"></el-input>
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
                <el-table-column prop="projectName" label="项目名称">
                </el-table-column>
                <el-table-column prop="biddingProjectName" label="招标项目名称">
                </el-table-column>
                <el-table-column prop="tenderee" label="招标人">
                </el-table-column>
                <el-table-column prop="estimatedAmount" label="预计金额">
                </el-table-column>
                <el-table-column prop="bidingSketch" label="标的简述">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status === '00' || scope.row.status === '02'">
                            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status === '00' || scope.row.status === '02'">
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
            <TenderingDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="TenderingDetail" @reloadList = "reloadList"></TenderingDetail>
        </el-card>
        <TenderingForm  ref="TenderingForm" @reloadList = "reloadList"></TenderingForm>
    </div>
</template>
<script>
    import TenderingForm from './TenderingForm';
    import TenderingDetail from './TenderingDetail';
    import {publicMethods} from "../application.js";
    import axios from 'axios';
    export default {
        mixins:[publicMethods],
        name: 'Tendering',
        data() {
            return {
                tableData: [],
                params: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0
                },
                dialogFormVisibleTendering: false,
                searchBoardOptions: [],
                formBoardId: '',
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
                        value: '03',
                        label: '已撤销'
                    },
                    {
                        value: '04',
                        label: '已完成'
                    }
                ],
                dialogBoardFormId: '',
                operationBoardType: 'create',
                formName:"motor-biddocument",
                statusNews: ''
            };
        },
        components: {
            TenderingForm,
            TenderingDetail
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
                    this.$refs.TenderingDetail.getFormDetails(params.id);
                }
            },
            searchList() {
                this.getList();
            },
            async getList() {
                const $self = this;
                $self.url = "/api/v1/motor-biddocument/queryList";
                let response = await $self.getQueryList();
                if (response) {
                    if (response.data.content.list.length > 0) {
                        let formId = response.data.content.list[0].id;
                        $self.$refs.TenderingDetail.getFormDetails(formId);
                    }
                    $self.tableData = response.data.content.list;
                    $self.params.total = response.data.content.total;
                } else {
                    $self.msgTips("获取列表失败", "warning");
                }
            },
            clickTableRow(row) {
                this.$refs.TenderingDetail.getFormDetails(row.id);
            },
            editForm(data) {
                this.$refs.TenderingForm.setDataFromParent(data);
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
                    pageSize: 5,
                    total: 0
                }
                this.onSubmit();
            },
            onSubmit() {
                this.getList();
            },
            cleanform() {
                this.$refs.TenderingForm.createForm();
                this.$refs.TenderingForm.getTableCode();
            },
            refreshBoardData() {
                this.getList();
            }
        }
    };
</script>
<style lang="scss" scoped>
    #Tendering {
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
    #Tendering .filterForm >>> .el-form-item__content{
        width: calc(100% - 110px);
    }
</style>