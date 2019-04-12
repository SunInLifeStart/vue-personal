<template>
    <div id='Payment'>
        <el-card class="box-card">
            <div id="PaymentFilter">
                <el-form :inline="true" class="demo-form-inline" label-width="60px;">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="部门：">
                                <el-input v-model="formInline.organ"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提单人：">
                                <el-input v-model="formInline.applicantName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态：">
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
                            <el-form-item label="单据编号：">
                                <el-input v-model="formInline.numericalOrder"></el-input>
                            </el-form-item>
                        </el-col>
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
            <div id="PaymentList">
                <el-table :data="tableData" stripe @row-click="showCurrentId">
                    <el-table-column prop="submitter" label="提单人" align="center">
                    </el-table-column>
                    <el-table-column prop="subOrganName" label="费用承担部门" align="center">
                    </el-table-column>
                    <el-table-column prop="number" label="流水号" align="center">
                    </el-table-column>
                    <el-table-column prop="submitted" label="提单时间" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                            <!--
                            {{scope.row.status == '00'? '已保存' :scope.row.status == '01' ? '审核中': scope.row.status == '02' ? '已驳回': scope.row.status == '03' ? '已撤销': scope.row.status == '04'? '已完成': ''}}
                        -->
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button @click="editForm(scope.row)" type="primary" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">编辑
                    </el-button>
                    <el-button type="danger" @click="deleteItem(scope.row)" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">删除
                    </el-button> -->
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
            <PaymentDetail :formId="formId" ref="PaymentDetail" @reloadList="reloadList" @resetStatus="resetStatus"></PaymentDetail>
        </el-card>
        <PaymentForm ref="PaymentForm" @reloadList="reloadList"></PaymentForm>
    </div>
</template>
<script>
import PaymentForm from './PaymentForm';
import PaymentDetail from './PaymentDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Payment',
    data() {
        return {
            tableData: [],
            searchOptions: [],
            formId: '',
            formInline: {
                applicantName: '',
                numericalOrder: '',
                organ: '',
                status: ''
            },
            params: {
                page: 1,
                pageSize: 5,
                options: [],
                orderBy: 'id',
                desc: true,
                total: 0
            },
            formName: 'payment_forms'
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
            if (this.formInline.applicantName.trim() !== '') {
                this.searchOptions.push({
                    field: 'applicantName',
                    filter: 'LIKE',
                    value: this.formInline.applicantName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            if (this.formInline.organ.trim() !== '') {
                this.searchOptions.push({
                    field: 'organ',
                    filter: 'LIKE',
                    value: this.formInline.organ
                });
            }
            if (this.formInline.numericalOrder.trim() !== '') {
                this.searchOptions.push({
                    field: 'numericalOrder',
                    filter: 'LIKE',
                    value: this.formInline.numericalOrder
                });
            }
            this.params.options = this.searchOptions;
        },
        async getList(page) {
            let $self = this;
            this.getFilter();
            $self.url = '/api/v1/travel_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.PaymentDetail.getFormDetails(formId);
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
            this.$refs.PaymentDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.PaymentForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.PaymentForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.PaymentDetail.getFormDetails(params.id);
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
            this.formInline.submitter = this.formInline.subOrganName = this.formInline.status =
                '';
            this.params.page = 1;
            this.getList();
        }
    },
    components: {
        PaymentForm,
        PaymentDetail
    }
};
</script>
<style lang="scss" scoped>
#Payment {
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
#PaymentFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 100px);
}
</style>


