<template>
    <div id="Asset">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="AssetFilter">
                <el-form :inline="true" label-width="100px" label-position="left" class="demo-form-inline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="申请人：">
                                <el-input v-model="formInline.proposer" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请部门：">
                                <el-input v-model="formInline.applyDept" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态：" prop="status">
                                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                                    <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="申请时间：">
                                <div>
                                    <el-date-picker v-model="formInline.applyDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item class="">
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <!-- 新建 -->
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="AssetList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" highlight-current-row @row-click="showCurrentId">
                    <el-table-column prop="proposer" label="申请人">
                    </el-table-column>
                    <el-table-column prop="applyDept" label="申请部门" min-width='150px'>
                    </el-table-column>
                    <el-table-column prop="assetsType" label="资产类型" min-width='120px'>
                    </el-table-column>
                    <el-table-column prop="applyDate" label="申请日期" sortable min-width='120px'>
                        <template slot-scope="scope">
                            {{scope.row.applyDate | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态" min-width='100px' :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left">
                                <!-- <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button> -->
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteItem(scope.row.id)"></el-button>
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
            <AssetDetail :formId="formId" ref="AssetDetail"></AssetDetail>
        </el-card>
        <AssetForm ref="AssetForm" @reloadList="reloadList"></AssetForm>
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import AssetForm from "./AssetForm";
import AssetDetail from "./AssetDetail";
import { CONFIG } from '../data.js';
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "Asset",
    data() {
        return {
            statusAll: CONFIG['status'],
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                desc: true,
                page: 1,
                pageSize: 5,
                department: "",
                submitter: "",
                total: 0,
                orderBy: 'created',
                desc: true,
                options: []
            },
            searchOptions: [],
            formName: "asset_forms",
            formInline: {
                proposer: '',
                applyDept: '',
                applyDate: [],
                status: ''
            },
        };
    },
    components: {
        AssetForm,
        AssetDetail
    },
    methods: {
        deleteItem(row) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .delete('/api/v1/asset_forms/delete/' + row)
                .then(res => {
                    self.$message({
                        message: '删除成功?',
                        type: 'success'
                    });
                    self.getList();
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        //获取列表
        async getList(pageNum) {
            this.onSubmit();
            let $self = this;
            $self.url = "/api/v1/asset_forms/query";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.AssetDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;

            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.proposer.trim() !== '') {
                this.searchOptions.push({
                    field: 'proposer',
                    filter: 'LIKE',
                    value: this.formInline.proposer
                });
            }
            if (this.formInline.applyDept.trim() !== '') {
                this.searchOptions.push({
                    field: 'applyDept',
                    filter: 'LIKE',
                    value: this.formInline.applyDept
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
            this.$refs.AssetDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.AssetForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.AssetForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.AssetDetail.getFormDetails(params.id);
            }
        },

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
            this.formInline.proposer = '';
            this.formInline.applyDept = '';
            this.formInline.applyDate = [];
            this.formInline.status = '';
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.status) {
                case '00':
                  state = "已保存";
                  break;
                case '01':
                    state = "审核中";
                    break;
                case '02':
                    state = "驳回";
                    break;
                case '03':
                    state = "撤销";
                    break;
                case '04':
                  state = "已完成";
                  break;
            }
            return state;
        },
    },
    mounted() {
        this.getList();

    }
};
</script>
<style lang="scss" scoped>
#AssetFilter .el-form-item--small.el-form-item {
  width: 100%;
}
</style>
