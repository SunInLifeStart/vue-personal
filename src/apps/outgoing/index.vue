<template>
    <div id="Outgoing">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="OutgoingFilter">
                <el-form :inline="true" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="公司部门">
                                <el-input placeholder="" v-model="params.organName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="拟稿人">
                                <el-input placeholder="请输入拟稿人" v-model="params.creatorName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="标题" label-width="50px">
                                <el-input v-model="params.title" placeholder="请输入标题"></el-input>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="16">
                            <el-form-item label="创建时间">
                                <div>
                                    <el-date-picker style="width:100%" v-model="params.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="params.status" clearable placeholder="请选择">
                                    <el-option v-for="item in s_status" :key="item.value" :label="item.label" :value="item.value">
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
                </el-form>
            </div>

            <!-- 新建 -->
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="OutgoingList">

                <el-table :data="tableData" stripe style="margin-bottom: 10px;" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="title" label="标题"></el-table-column>
                    <el-table-column prop="organName" label="公司部门" width="200"></el-table-column>
                    <el-table-column prop="creatorName" label="拟稿人" width="200"></el-table-column>

                    <el-table-column prop="created" label="创建时间" width="150" sortable>
                        <template slot-scope="scope">
                            {{scope.row.created | dateformat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态" width="100">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <!-- v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'" -->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-delete" @click="deleteForm(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br />
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.page" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <OutgoingDetail :formId="formId" ref="OutgoingDetail" @reloadList="reloadList" @resetStatus="resetStatus"></OutgoingDetail>
            <!-- :formId="formId" -->
        </el-card>
        <OutgoingForm ref="OutgoingForm" @reloadList="reloadList"></OutgoingForm>
        <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import OutgoingForm from './OutgoingForm';
import OutgoingDetail from './OutgoingDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Outgoing',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: '',
            s_status: [
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
            params: {
                page: 1,
                pageSize: 5,
                department: '',
                title: '',
                creatorName: '',
                organName: '',
                total: 0,
                committed: '',
                created: [],
                status: '',
                // outgoingingTime:[],
                // startTime:"",
                // endTime:"",
                orderBy: 'created',
                desc: true,
                options: []
            },
            searchOptions: [],
            formName: 'outgoingingApplication'
        };
    },
    components: {
        OutgoingForm,
        OutgoingDetail
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
        }
    },
    methods: {
        deleteForm(row) {
            this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row.id);
                axios
                    .delete('/api/v1/outgoing_forms/delete/' + row.id)
                    .then(res => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
            });
        },

        //获取列表
        async getList(page) {
            let $self = this;
            $self.url = '/api/v1/outgoing_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms && response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.OutgoingDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            } else {
                // $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.OutgoingDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.OutgoingForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.OutgoingForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.OutgoingDetail.getFormDetails(params.id);
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
            if (this.params.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value: this.params.creatorName
                });
            }
            if (this.params.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.params.title
                });
            }
            if (this.params.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.params.organName
                });
            }
            if (this.params.created && this.params.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.params.created[0]).format('YYYY-MM-DD'),
                    value2: moment(this.params.created[1]).format('YYYY-MM-DD')
                });
            }
            if (this.params.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.params.status
                });
            }
            this.params.options = this.searchOptions;
            this.getList();
        },
        resetInput() {
            this.params = {
                page: 1,
                pageSize: 5,
                department: '',
                creatorName: '',
                title: '',
                total: 0,
                created: [],
                committed: '',
                status: '',
                organName: '',
                // outgoingingTime:[],
                // startTime:"",
                // endTime:"",
                orderBy: 'created',
                desc: true,
                options: []
            };
            this.getList();
            // this.s_status=[]
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#OutgoingFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#OutgoingFilter {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
    }
}
</style>
<style scoped>
#OutgoingFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
#OutgoingFilter .filterForm >>> .el-select {
    width: calc(100% - 15px);
}
#OutgoingFilter .filterForm >>> .el-date-editor {
    width: calc(100% - 0px);
}
</style>

