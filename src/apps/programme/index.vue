<template>
    <div id="Programme">
        <el-card class="box-card">
            <el-form :inline="true" label-width="100px" label-position="left" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="公司部门">
                            <el-input v-model="params.organName" placeholder="请输入公司部门"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提单人">
                            <el-input v-model="params.creatorName" placeholder="请输入提单人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目名称">
                            <el-input v-model="params.projectName" placeholder="请输入项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="filterForm">
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
                <el-table-column prop="projectName" label="项目名称">
                </el-table-column>
                <el-table-column prop="organName" label="公司部门">
                </el-table-column>
                <el-table-column prop="creatorName" label="提单人">
                </el-table-column>
                <el-table-column prop="purchaseProjectName" label="采购项目名称">
                </el-table-column>
                <el-table-column prop="purchaseSignSketch" label="采购标的简述">
                </el-table-column>
                <el-table-column prop="purchaseSchemeSign" label="采购方案是否是规定情形">
                    <template slot-scope="scope">{{scope.row.purchaseSchemeSign | filterSchemeSign}}</template>
                </el-table-column>
                <el-table-column prop="purchaseStartTime" label="采购发起时间">
                </el-table-column>
                <el-table-column label="单据状态">
                    <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status === '00' || scope.row.status === '02'">
                            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status === '00' || scope.row.status == '02'">
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
            <ProgrammeDetail :formId="formBoardId" @refreshData="refreshBoardData" ref="ProgrammeDetail" @reloadList="reloadList"></ProgrammeDetail>
        </el-card>
        <ProgrammeForm ref="ProgrammeForm" @reloadList="reloadList"></ProgrammeForm>
    </div>
</template>
<script>
import ProgrammeForm from './ProgrammeForm';
import ProgrammeDetail from './ProgrammeDetail';
import { publicMethods } from '../application.js';
import axios from 'axios';
export default {
    mixins: [publicMethods],
    name: 'Programme',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
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
            dialogFormVisibleProgramme: false,
            searchBoardOptions: [],
            formBoardId: '',
            dialogBoardFormId: '',
            operationBoardType: 'create',
            formName: 'motor-procscheme',
            statusNews: ''
        };
    },
    components: {
        ProgrammeForm,
        ProgrammeDetail
    },
    mounted() {
        this.getList();
        // this.getOrgans();
    },
    filters: {
        filterStatus: function(data) {
            let xmlJson = {
                '00': '已保存',
                '01': '审核中',
                '02': '已驳回',
                '03': '已撤销',
                '04': '已完成'
            };
            return xmlJson[data];
        },
        filterSchemeSign: function(data) {
            let xmlJson = {
                '1': '是',
                '2': '否'
            };
            return xmlJson[data];
        }
    },
    methods: {
        reloadList(params) {
            if (params == 'reload') {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.ProgrammeDetail.getFormDetails(params.id);
            }
        },
        searchList() {
            this.getList();
        },
        async getList() {
            const $self = this;
            $self.url = '/api/v1/motor-procscheme/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.ProgrammeDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            }
        },
        clickTableRow(row) {
            this.$refs.ProgrammeDetail.getFormDetails(row.id);
        },
        editForm(data) {
            this.$refs.ProgrammeForm.setDataFromParent(data);
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
            };
            this.onSubmit();
        },
        onSubmit() {
            this.getList();
        },
        cleanform() {
            this.$refs.ProgrammeForm.createForm();
            this.$refs.ProgrammeForm.getTableCode();
        },
        refreshBoardData() {
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
#Programme {
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
#Programme .filterForm >>> .el-form-item__content {
    width: calc(100% - 110px);
}
</style>