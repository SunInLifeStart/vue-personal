<template>
    <div id="Files">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="FilesFilter">
                <el-form :inline="true" label-width="100px" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="公司部门">
                                <el-input v-model="params.organName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请人">
                                <el-input v-model="params.creatorName" placeholder="" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属月份">
                                <el-select v-model="params.umonth" clearable style="width:100%" filterable placeholder="全部">
                                    <el-option v-for="item in onOption" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <!-- <el-col :span="8">
                            <el-form-item label="印刷文件名称：">
                                <el-input v-model="params.fileName" placeholder="" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="是否属于年度预算内">
                                <el-radio v-model="params.utype" label="true">是</el-radio>
                                <el-radio v-model="params.utype" label="false">否</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期">
                                <!-- <el-input v-model="params.applyDept" placeholder=""></el-input> -->
                                <el-date-picker v-model="params.created" value-format="yyyy-MM-dd" style="width:100%" type="date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="params.status" placeholder="请选择">
                                    <el-option v-for="item in statusOpertions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </el-row>
                </el-form>
            </div>

            <!-- 新建 -->
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="FilesList">
                <el-table :data="tableData" style="width: 100%; cursor:pointer" highlight-current-row @row-click="showCurrentId">
                    <el-table-column prop="organName" label="公司部门">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="申请人">
                    </el-table-column>
                    <el-table-column prop="created" label="申请日期" sortable>
                        <template slot-scope="scope">
                            {{scope.row.created | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="utype" label="是否属于年度预算内" :formatter="fomutype">
                    </el-table-column>
                    <el-table-column prop="umonth" label="所属月份">
                    </el-table-column>
                    <el-table-column prop="allPrintNumber" label="总印刷数量">
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态" :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)" v-show="scope.row.status!='01'&&scope.row.status!='04'"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '00' || scope.row.status == '02'">
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
import FilesForm from './FilesForm';
import FilesDetail from './FilesDetail';
import { CONFIG } from '../data.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Files',
    data() {
        return {
            onOption: [
                {
                    value: '一月',
                    label: '一月'
                },
                {
                    value: '二月',
                    label: '二月'
                },
                {
                    value: '三月',
                    label: '三月'
                },
                {
                    value: '四月',
                    label: '四月'
                },
                {
                    value: '五月',
                    label: '五月'
                },
                {
                    value: '六月',
                    label: '六月'
                },
                {
                    value: '七月',
                    label: '七月'
                },
                {
                    value: '八月',
                    label: '八月'
                },
                {
                    value: '九月',
                    label: '九月'
                },
                {
                    value: '十月',
                    label: '十月'
                },
                {
                    value: '十一月',
                    label: '十一月'
                },
                {
                    value: '十二月',
                    label: '十二月'
                }
            ],
            statusOpertions: [
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
            statusAll: CONFIG['status'],
            tableData: [],
            formDetails: {},
            formId: '',
            params: {
                total: 0,
                pageSize: 5,
                pageNum: 1,
                created: '',
                creatorName: '',
                umonth: '',
                utype: '',
                fileName: '',
                organName: '',
                status: ''
            },
            searchOptions: [],
            formName: 'documentPrinting'
        };
    },
    components: {
        FilesForm,
        FilesDetail
    },
    methods: {
        //获取列表
        async getList(pageNum) {
            // this.onSubmit();
            let $self = this;
            $self.url = '/api/v1/documentPrinting/queryList';
            let response = await $self.getQueryList();
            if (response) {
                if (
                    response.data.content.list &&
                    response.data.content.list.length > 0
                ) {
                    let formId = response.data.content.list[0].id;
                    // debugger
                    $self.$refs.FilesDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                // $self.msgTips("获取列表失败", "warning");
            }
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
            if (params == 'reload') {
                this.params.pageNum = 1;
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
            // debugger
            this.params.pageNum = pageNum;
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
                pageNum: 1,
                pageSize: 5,
                created: '',
                creatorName: '',
                umonth: '',
                utype: '',
                fileName: '',
                organName: '',
                status: ''
            };
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
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
                case '04':
                    state = '已完成';
                    break;
            }
            return state;
        },
        fomutype(row, column) {
            let state;
            switch (row.utype) {
                case 'true':
                    state = '是';
                    break;
                case 'false':
                    state = '否';
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
<style scoped>
#FilesFilter >>> .el-select {
    width: calc(100% - 0px);
}
#FilesFilter >>> .el-form-item__content {
    width: calc(100% - 110px);
}
#FilesFilter >>> .el-checkbox {
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
        .positionBtn {
            text-align: right;
        }
    }
}
</style>
