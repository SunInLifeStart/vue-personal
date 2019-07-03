<template>
    <div id="Reimbursement">
        <el-card class="box-card">
            <div id="ReimbursementFilter">
                <el-form :inline="true" label-width="70px" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="formInline.creatorName" placeholder="提单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="部门">
                                <el-input v-model="formInline.organName" placeholder="部门"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态">
                                <el-select v-model="formInline.status" placeholder="请选择">
                                    <el-option label="已保存" value="00"></el-option>
                                    <el-option label="审核中" value="01"></el-option>
                                    <el-option label="已驳回" value="02"></el-option>
                                    <el-option label="已完成" value="04"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="单据编号">
                                <el-input v-model="formInline.no" placeholder="单据编号"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--
                        <el-col :span="8">
                            <el-form-item label="日期" label-width="60px;">
                                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        -->
                        <el-col :span="16">
                            <el-form-item class="">
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="ExpenseList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="creatorName" label="提单人">
                    </el-table-column>
                    <el-table-column prop="organName" label="部门">
                    </el-table-column>
                    <el-table-column prop="no" label="单据编号">
                    </el-table-column>
                    <el-table-column prop="total" label="金额">
                    </el-table-column>
                    <el-table-column prop="currency" label="币种">
                        <template slot-scope="scope">
                            {{scope.row.repayItems.length > 0 ? scope.row.repayItems[0].currency.label : '人民币'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="created" label="提单时间"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '02' || scope.row.status == '00'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '00'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
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
            <ReimbursementDetail :formId="formId" ref="ReimbursementDetail" @reloadList="reloadList" @resetStatus="resetStatus"></ReimbursementDetail>
        </el-card>
        <ReimbursementForm ref="ReimbursementForm" @reloadList="reloadList"></ReimbursementForm>
    </div>
</template>
<script>
import ReimbursementForm from './ReimbursementForm';
import ReimbursementDetail from './ReimbursementDetail';
import { publicMethods } from '../application.js';
import moment from 'moment';
export default {
    mixins: [publicMethods],
    name: 'Reimbursement',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: '',
            searchOptions: [],
            formInline: {
                creatorName: '',
                organName: '',
                created: [],
                status: '',
                no: ''
            },
            params: {
                page: 1,
                pageSize: 5,
                orderBy: 'id',
                desc: true,
                options: []
            },
            formName: 'expense_forms'
        };
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
        }
    },
    components: {
        ReimbursementForm,
        ReimbursementDetail
    },
    methods: {
        //获取列表
        async getList(page) {
            let $self = this;
            $self.params.options = this.searchOptions;
            $self.url = '/api/v1/expense_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.ReimbursementDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                // $self.msgTips('获取列表失败', 'warning');
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.ReimbursementDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.ReimbursementForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.ReimbursementForm.setDataFromParent(data);
        },
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
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.ReimbursementDetail.getFormDetails(params.id);
            }
        },

        //分页
        currentChange(page) {
            this.params.page = page;
            this.getList(page);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.searchOptions = [];
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.formInline.creatorName
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            if (this.formInline.no.trim() !== '') {
                this.searchOptions.push({
                    field: 'no',
                    filter: 'LIKE',
                    value: this.formInline.no
                });
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.created[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            this.getList();
        },
        resetInput() {
            this.formInline.creatorName = '';
            this.formInline.organName = '';
            this.formInline.created = [];
            this.formInline.status = '';
            this.formInline.no = '';
            this.searchOptions = [];
            this.params.page = 1;
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#Reimbursement {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
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
#ReimbursementFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 100px);
}
</style>



