<template>
    <div id='Expenses'>
        <el-card class="box-card">
            <div id="ExpensesFilter">
                <el-form :inline="true" class="demo-form-inline" label-width="60px;">
                    <!--
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="formInline.borrower" placeholder="借款人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="费用承担部门">
                                <el-input v-model="formInline.borrowDept" placeholder="费用承担部门"></el-input>
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
                    -->
                    <el-row class="filterForm">
                        <!--
                        <el-col :span="8">
                            <el-form-item label="提单时间">
                                <el-date-picker style="width: 285px;" v-model="params.submitted" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        -->
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button type="" @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="ExpensesList">
                <el-table :data="tableData" stripe @row-click="showCurrentId">
                    <el-table-column prop="borrower" label="提单人" align="left">
                    </el-table-column>
                    <el-table-column prop="borrowDept" label="所属部门" align="left" min-width="100">
                    </el-table-column>
                    <el-table-column prop="number" label="流水单号" align="left" width="150">
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态" align="left">
                    </el-table-column>
                    <el-table-column prop="borrowTime" label="提单时间" align="left" min-width="100">
                        <template slot-scope="scope">
                            {{scope.row.borrowTime | dateformat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--v-if="scope.row.status == '00' || scope.row.status == '02'"-->
                            <!--v-if="scope.row.status == '00'"-->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.page" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <ExpensesDetail :formId="formId" ref="ExpensesDetail" @reloadList="reloadList" @resetStatus="resetStatus"></ExpensesDetail>
        </el-card>
        <ExpensesForm ref="ExpensesForm" @reloadList="reloadList"></ExpensesForm>
    </div>
</template>
<script>
import ExpensesForm from './ExpensesForm';
import ExpensesDetail from './ExpensesDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Expenses',
    data() {
        return {
            tableData: [],
            searchOptions: [],
            formId: '',
            params: {
                page: 1,
                pageSize: 5,
                total: 0
            },
            formName: 'expenses_forms'
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
    mounted() {
        this.getList();
    },
    methods: {
        getFilter() {
            this.searchOptions = [];
            if (this.formInline.borrower.trim() !== '') {
                this.searchOptions.push({
                    field: 'borrower',
                    filter: 'LIKE',
                    value: this.formInline.borrower
                });
            }
            if (this.formInline.borrowDept.trim() !== '') {
                this.searchOptions.push({
                    field: 'borrowDept',
                    filter: 'LIKE',
                    value: this.formInline.borrowDept
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            this.params.options = this.searchOptions;
        },
        async getList(page) {
            let $self = this;
            //this.getFilter();
            $self.url = '/api/v1/expenses_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.ExpensesDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                $self.msgTips('获取列表失败', 'warning');
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
        //选择行
        showCurrentId(row) {
            this.$refs.ExpensesDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.ExpensesForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.ExpensesForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.ExpensesDetail.getFormDetails(params.id);
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
            this.getList();
        },
        resetInput() {
            // this.formInline.borrower = this.formInline.borrowDept = this.formInline.status =
            //    '';
            this.params.page = 1;
            this.getList();
        }
    },
    components: {
        ExpensesForm,
        ExpensesDetail
    }
};
</script>
<style lang="scss" scoped>
#Expenses {
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
#ExpensesFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 100px);
}
</style>


