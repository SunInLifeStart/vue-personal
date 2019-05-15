<template>
    <div id="Contract">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="ContractFilter">
                <el-form :inline="true" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="合同名称">
                                <el-input placeholder="" v-model="formInline.contractName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同对方">
                                <el-input placeholder="" v-model="formInline.partyB"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                                    <el-option v-for="item in statusAll" :key="item.id" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetInput">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 新建 -->
            <div class="toolbar" style="margin-top:5px;">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="ContractList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="contractName" label="合同名称" min-width="260"></el-table-column>
                    <el-table-column prop="partyB" label="合同对方" min-width="260"></el-table-column>
                    <el-table-column prop="contractNum" label="合同编号" min-width="200"></el-table-column>
                    <el-table-column prop="applyName" label="制单人" min-width="120"></el-table-column>
                    <el-table-column prop="initiateTime" label="提单时间" min-width="120"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                            <!--
                            {{scope.row.status == '00'? '已保存' :scope.row.status == '01' ? '审核中': scope.row.status == '02' ? '已驳回': scope.row.status == '03' ? '已撤销': scope.row.status == '04'? '已完成': ''}}
                        -->
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '00' || scope.row.status == '02'">
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
            <ContractDetail :formId="formId" ref="ContractDetail" @reloadList="reloadList" @resetStatus="resetStatus"></ContractDetail>
            <!-- :formId="formId" -->
        </el-card>
        <ContractForm ref="ContractForm" @reloadList="reloadList"></ContractForm>
        <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import ContractForm from './ContractForm';
import ContractDetail from './ContractDetail';
import { publicMethods } from '../application.js';
import { CONFIG } from '../data.js';
export default {
    mixins: [publicMethods],
    name: 'Contract',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: '',
            params: {
                desc: true,
                page: 1,
                pageSize: 5,
                orderBy: 'id',
                options: []
            },
            searchOptions: [],
            formName: 'contract_forms',
            statusAll: [
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
            ], //单据状态
            formInline: {
                contractName: '',
                partyB: '',
                status: ''
            }
        };
    },
    filters: {
        filterStatus: function(data) {
            console.log(data);
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
        ContractForm,
        ContractDetail
    },
    methods: {
        //获取列表
        async getList(pageNum) {
            let $self = this;
            this.onSubmit();
            $self.url = '/api/v1/contract_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.ContractDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.contractName.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractName',
                    filter: 'LIKE',
                    value: this.formInline.contractName
                });
            }
            if (this.formInline.partyB.trim() !== '') {
                this.searchOptions.push({
                    field: 'partyB',
                    filter: 'LIKE',
                    value: this.formInline.partyB
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
            this.$refs.ContractDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.ContractForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.ContractForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.ContractDetail.getFormDetails(params.id);
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
            this.params.page = 1;
            this.formInline.contractName = '';
            this.formInline.partyB = '';
            this.formInline.status = '';
            this.getList();
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        }
    },
    mounted() {
        console.log(this.$store.getters.LoginData.oname);
        console.log(decodeURI(this.$store.getters.LoginData.companyName));
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#ContractFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#Contract {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
    }
}
</style>
<style scoped>
#ContractFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
</style>

