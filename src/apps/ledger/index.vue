<template>
    <div id="Ledger">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="LedgerFilter">
                <el-form :inline="true" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="提单人：">
                                <el-input v-model="formInline.applyName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目：">
                                <el-input v-model="formInline.project" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="部门：">
                                <el-input v-model="formInline.dept" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="合同价格形势：">
                                <!-- <el-input v-model="formInline.shape" placeholder=""></el-input> -->
                                <el-select v-model="formInline.shape" clearable placeholder="请输入单据状态">
                                    <el-option v-for="item in shapeOption" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="发起时间：">
                                <el-date-picker v-model="formInline.initiateTime" value-format="yyyy-MM-dd" placeholder="请输入时间" style="width:100%" type="date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="formInline.status" clearable placeholder="请输入单据状态">
                                    <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <!--
                                <el-button type="primary" @click="searchList">统计</el-button>-->
                                <el-button type="primary" @click="exportData">导出</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div id="LedgerList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" highlight-current-row @row-click="showCurrentId">
                    <el-table-column prop="applyName" label="提单人">
                    </el-table-column>
                    <el-table-column prop="dept" label="所属部门">
                    </el-table-column>
                    <el-table-column prop="project" label="所属项目">
                    </el-table-column>
                    <el-table-column prop="contractNum" label="合同编号">
                    </el-table-column>

                    <el-table-column prop="shape" label="合同价格形势">
                        <template slot-scope="scope">
                            {{scope.row.shape | filtershape}}

                        </template>
                    </el-table-column>
                    <el-table-column prop="contractName" label="合同名称" min-width='150px'>
                    </el-table-column>
                    <el-table-column prop="initiateTime" label="提单时间">
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                            <!--
                            {{scope.row.status == '00'? '已保存' :scope.row.status == '01' ? '审核中': scope.row.status == '02' ? '已驳回': scope.row.status == '03' ? '已撤销': scope.row.status == '04'? '已完成': ''}}
                        -->
                        </template>
                    </el-table-column>
                </el-table>
                <br />
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <LedgerDetail :formId="formId" ref="LedgerDetail"></LedgerDetail>
        </el-card>
        <!-- <LedgerForm ref="LedgerForm" @reloadList="reloadList"></LedgerForm> -->
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import LedgerForm from './LedgerForm';
import LedgerDetail from './LedgerDetail';
import { CONFIG } from '../data.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Ledger',
    data() {
        return {
            statusAll: CONFIG['status'],
            tableData: [],
            formDetails: {},
            formId: '',
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
            shapeOption: [
                {
                    value: '1',
                    label: '固定总价'
                },
                {
                    value: '2',
                    label: '固定综合单价'
                },
                {
                    value: '3',
                    label: '其他'
                }
            ],
            params: {
                desc: true,
                page: 1,
                pageSize: 5,
                department: '',
                submitter: '',
                total: 0,
                orderBy: 'created',
                desc: true,
                options: []
            },
            searchOptions: [],
            formName: 'contract_forms',
            formInline: {
                applyName: '',
                project: '',
                initiateTime: '',
                shape: '',
                dept: '', //申请部门
                shape: '', //合同价格形式
                applyDate: [],
                status: ''
            }
        };
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
        filtershape: function(data) {
            let xmlJson = {
                '1': '固定总价',
                '2': '固定综合单价',
                '3': '其他'
            };
            return xmlJson[data];
        }
    },
    components: {
        LedgerForm,
        LedgerDetail
    },
    methods: {
        exportData() {
            const self = this;
            let applyName =
                this.formInline.applyName != ''
                    ? this.formInline.applyName
                    : null;
            let shape =
                this.formInline.shape != '' ? this.formInline.shape : null;
            let project =
                this.formInline.project != '' ? this.formName.project : null;
            let dept = this.formInline.dept != '' ? this.formInline.dept : null;
            let status =
                this.formInline.status != '' ? this.formInline.status : null;
            let initiateTime =
                this.formInline.initiateTime != ''
                    ? this.formInline.initiateTime
                    : null;
            let urldata =
                '/api/v1/contract_forms/exportByAccount?applyName=' +
                applyName +
                '&shape=' +
                shape +
                '&project=' +
                project +
                '&dept=' +
                dept +
                '&status=' +
                status +
                '&initiateTime=' +
                initiateTime;
            console.log(urldata);
            axios
                .get(urldata)
                .then(res => {
                 this.common.downloadExport(res.data);
                })
                .catch(function() {
                    self.$message({
                        message: '导出操作失败',
                        type: 'error'
                    });
                });
        },
        //获取列表
        async getList(pageNum) {
            this.onSubmit();
            let $self = this;
            $self.url = '/api/v1/contract_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.LedgerDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.applyName.trim() !== '') {
                this.searchOptions.push({
                    field: 'applyName',
                    filter: 'LIKE',
                    value: this.formInline.applyName
                });
            }
            if (this.formInline.project.trim() !== '') {
                this.searchOptions.push({
                    field: 'project',
                    filter: 'LIKE',
                    value: this.formInline.project
                });
            }

            if (this.formInline.initiateTime) {
                this.searchOptions.push({
                    field: 'initiateTime',
                    filter: 'LIKE',
                    value: this.formInline.initiateTime
                });
            }
            // if (this.formInline.initiateTime) {
            //      this.searchOptions.push({
            //          field: 'initiateTime',
            //          filter: 'BETWEEN',
            //          value: this.formInline.initiateTime,
            //          value2: this.formInline.initiateTime
            //      });
            //  }

            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            if (this.formInline.dept.trim() !== '') {
                this.searchOptions.push({
                    field: 'dept',
                    filter: 'LIKE',
                    value: this.formInline.dept
                });
            }
            if (this.formInline.shape.trim() !== '') {
                this.searchOptions.push({
                    field: 'shape',
                    filter: 'LIKE',
                    value: this.formInline.shape
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
            this.$refs.LedgerDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.LedgerForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.LedgerForm.setDataFromParent(data);
        },
        // reloadList(params) {
        //     if (params == "reload") {
        //         this.params.page = 1;
        //         this.getList();
        //     } else {
        //         this.$refs.LedgerDetail.getFormDetails(params.id);
        //     }
        // },

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
            this.formInline.applyName = '';
            this.formInline.project = '';
            this.formInline.initiateTime = '';
            this.formInline.shape = '';
            this.formInline.status = '';
            this.formInline.dept = '';
            this.formInline.shape = '';
            this.formInline.applyDate = [];
            this.formInline.status = '';
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.status) {
                case '00':
                    state = '已保存';
                    break;
                case '01':
                    state = '审核中';
                    break;
                case '02':
                    state = '驳回';
                    break;
                case '03':
                    state = '撤销';
                    break;
                case '04':
                    state = '已完成';
                    break;
            }
            return state;
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#LedgerFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#Ledger {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
    }
}
</style>
<style scoped>
#LedgerFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 120px);
}
#LedgerFilter .filterForm >>> .el-select {
    width: calc(100% - 15px);
}
#LedgerFilter .filterForm >>> .el-date-editor {
    width: calc(100% - 0px);
}
</style>