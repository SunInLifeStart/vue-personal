<template>
    <div id="Processing">
        <el-card class="box-card">
            <el-form :inline="true" label-width="70px" label-position="left" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <el-input v-model="params.uname" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请岗位">
                            <el-input v-model="params.applyPosition" placeholder="请输入申请岗位"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单据状态">
                            <el-select v-model="params.status" placeholder="请输入单据状态">
                                <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="公司部门">
                            <el-input v-model="params.organName" placeholder="请输入公司部门"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="填表时间">
                            <!-- <el-input v-model="params.applyDept" placeholder=""></el-input> -->
                            <el-date-picker v-model="params.created" value-format="yyyy-MM-dd" style="width:100%" type="date">
                            </el-date-picker>
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

            <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow" highlight-current-row>
                <el-table-column prop="applyPosition" label="申请岗位">
                </el-table-column>
                <el-table-column prop="organName" label="公司部门">
                </el-table-column>
                <el-table-column prop="created" label="填表日期">
                </el-table-column>
                <el-table-column prop="uname" label="姓名">
                </el-table-column>
                <el-table-column prop="sex" label="性别">
                </el-table-column>
                <el-table-column prop="nation" label="民族">
                </el-table-column>
                <el-table-column prop="nativePlace" label="籍贯/出生地">
                </el-table-column>
                <el-table-column prop="nativePlace" label="电子邮箱">
                </el-table-column>
                <!-- prop="maritalStatus" -->
                <el-table-column label="婚姻状况">
                    <template slot-scope="scope">{{scope.row.maritalStatus | filtermaritalStatus}}</template>
                </el-table-column>
                <el-table-column prop="phone" label="手机/家庭电话">
                </el-table-column>
                <el-table-column prop="highestEducation" label="最高学历">
                </el-table-column>
                <el-table-column label="单据状态">
                    <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00' ">
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
            <ProcessingDetail @resetStatus="resetStatus" :formId="formBoardId" @refreshData="refreshBoardData" ref="ProcessingDetail"></ProcessingDetail>
        </el-card>
        <ProcessingForm ref="ProcessingForm" @reloadList="reloadList"></ProcessingForm>
    </div>
</template>
<script>
import ProcessingForm from './ProcessingForm';
import ProcessingDetail from './ProcessingDetail';
import { publicMethods } from '../application.js';
import axios from 'axios';
export default {
    mixins: [publicMethods],
    name: 'Processing',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                uname: '',
                applyPosition: '',
                organName: '',
                status: '',
                created: '',
                total: 0
            },
            dialogFormVisibleProcessing: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            formName: 'examinationApproval',
            statusNews: '',
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
            ]
        };
    },
    components: {
        ProcessingForm,
        ProcessingDetail
    },
    mounted() {
        this.getList();
    },
    filters: {
        filterStatus: function(data) {
            let xmlJson = {
                '00': '已保存',
                '01': '审核中',
                '02': '已驳回',
                '04': '已完成'
            };
            return xmlJson[data];
        },
        filtermaritalStatus: function(data) {
            let xmlJson = {
                '0': '未婚',
                '1': '已婚',
                '2': '离异'
            };
            return xmlJson[data];
        }
    },
    methods: {
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.ProcessingDetail.getFormDetails(params.id);
            }
        },
        searchList() {
            this.getList();
        },
        async getList() {
            const $self = this;
            $self.url = '/api/v1/examinationApproval/queryList';
            let response = await $self.getQueryList();
            if (response) {
                if (
                    response.data.content.list &&
                    response.data.content.list.length > 0
                ) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.ProcessingDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                // $self.msgTips("获取列表失败", "warning");
            }
        },
        clickTableRow(row) {
            this.$refs.ProcessingDetail.getFormDetails(row.id);
        },
        editForm(data) {
            this.$refs.ProcessingForm.setDataFromParent(data);
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
                uname: '',
                applyPosition: '',
                status: '',
                organName: '',
                created: ''
            };
            this.getList();
        },
        onSubmit() {
            this.getList();
        },
        cleanform() {
            this.$refs.ProcessingForm.createForm();
            // this.$refs.ApprovalForm.createForm();
        },
        refreshBoardData() {
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
#Processing {
    .searchBtn {
        padding-right: 10px;
        // .positionBtn{
        //     // text-align: right;
        // }
    }
    .el-select {
        width: 100%;
    }
    .card_margin_10 {
        margin-top: 10px;
    }
    .el-form-item--small.el-form-item {
        width: 100%;
    }
}
</style>
<style scoped>
#Processing .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
</style>