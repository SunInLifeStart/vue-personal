<template>
    <div id="Inspect">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="InspectFilter">
                <el-form :inline="true" class="demo-form-inline" label-width="90px" label-position="left" :model="formInline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="公司部门：" prop="organName">
                                <el-input v-model="formInline.organName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="立项人：" prop="definer">
                                <el-input v-model="formInline.definer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="标题：" prop="title">
                                <el-input v-model="formInline.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--
            <el-col :span="8">
              <el-form-item label="被督办部门负责人：" prop="inspector">
                <el-select v-model="formInline.inspector" filterable placeholder="请选择" style="width:100%">
                  <el-option v-for="item in inspectors" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
              
            </el-col>
            -->
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="创建时间">
                                <div>
                                    <el-date-picker style="width:100%" v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态：" prop="status">
                                <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                                    <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item>
                                <!-- <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>-->
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <!-- 新建 -->
            <div class="toolbar">
                <!-- <el-button type="primary" icon="el-icon-plus" @click="creatForm">新建</el-button> -->
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="InspectList">
                <el-table :data="tableData" style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="title" label="标题" min-width="150px" align="center"></el-table-column>
                    <el-table-column prop="organName" label="公司部门" min-width="150px" align="center"></el-table-column>
                    <el-table-column prop="definer" label="立项人" min-width="150px" align="center"></el-table-column>
                    <!--<el-table-column prop="inspector" label="被督办部门负责人" min-width="150px" align="center"></el-table-column>-->
                    <el-table-column prop="created" label="创建时间" min-width="150px" align="center"></el-table-column>
                    <el-table-column prop="deadline" label="截至日期" min-width="150px" to="/index" align="center"></el-table-column>
                    <el-table-column prop="status" label="单据状态" min-width="100px" align="center" :formatter="stateFormatter"></el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br>
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <InspectDetail :formId="formId" ref="InspectDetail" @reloadList="reloadList" @resetStatus="resetStatus"></InspectDetail>
            <!-- :formId="formId" -->
        </el-card>
        <InspectForm ref="InspectForm" @reloadList="reloadList"></InspectForm>
        <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';
import { CONFIG } from '../data.js';
import InspectForm from './InspectForm';
import InspectDetail from './InspectDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Inspect',
    data() {
        return {
            searchOptions: [],
            formInline: {
                title: '',
                definer: '',
                inspector: '',
                status: '',
                organName: '',
                created: []
            },
            statusAll: CONFIG['status'],
            tableData: [],
            inspectors: [],
            formDetails: {},
            formId: '',
            params: {
                page: 1,
                pageSize: 5,
                orderBy: 'created',
                desc: true,
                options: [],
                uid: parseInt(cookies.get('uid'))
            },
            formName: 'inspect_forms'
        };
    },
    components: {
        InspectForm,
        InspectDetail
    },
    methods: {
        getInspector() {
            const self = this;
            let type = this.$store.getters.LoginData.code.split('_')[0];
            axios
                .get(`/api/v1/users/role/${type}_deptManager`)
                .then(res => {
                    self.inspectors = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        },
        stateFormatter(row, column) {
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
                case '03':
                    state = '已撤销';
                    break;
                case '04':
                    state = '已完成';
                    break;
            }
            return state;
        },
        //获取列表
        async getList(pageNum) {
            let $self = this;
            $self.url = '/api/v1/inspect_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                // if (response.data.content.list.length > 0) {
                //   // let formId = response.data.content.list[0].id;
                //   $self.$refs.InspectDetail.getFormDetails(formId);
                $self.tableData = response.data.forms;
                // }
                if ($self.tableData.length > 0)
                    this.$refs.InspectDetail.getFormDetails(
                        $self.tableData[0].id
                    );
                $self.params.total = response.data.totalCount;
            }
        },
        deleteCurrentLine(id, params) {
            let $self = this;
            $self
                .$confirm(params ? '是否撤销?' : '是否删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    $self.$axios
                        .get('/api/v1/inspect_forms/delete/' + id)
                        .then(res => {
                            $self.msgTips(
                                params ? '撤销成功' : '删除成功',
                                'success'
                            );
                            if (params) {
                                $self.$emit('reloadList', 'reload');
                            } else {
                                $self.getList();
                            }
                        });
                });
        },
        //选择行
        showCurrentId(row) {
            this.$refs.InspectDetail.getFormDetails(row.id);
        },
        saveOk() {
            this.getList();
        },
        subOk() {
            this.getList();
        },
        //新建
        createNewForm() {
            this.$refs.InspectForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.InspectForm.setDataFromParent(data);
        },
        reloadList(params) {
            this.getList();
            if (params == 'reload') {
                this.params.pageNum = 1;
            } else {
                this.$refs.InspectDetail.getFormDetails(params.id);
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
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.formInline.organName
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
            if (this.formInline.definer.trim() !== '') {
                this.searchOptions.push({
                    field: 'definer',
                    filter: 'LIKE',
                    value: this.formInline.definer
                });
            }
            if (this.formInline.inspector.trim() !== '') {
                this.searchOptions.push({
                    field: 'inspector',
                    filter: 'LIKE',
                    value: this.formInline.inspector
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
        },
        searchList() {
            this.onSubmit();
            this.params.options = this.searchOptions;
            this.getList();
        },
        resetInput() {
            // this.params.submitter = this.params.department = "";
            this.formInline.title = '';
            this.formInline.definer = '';
            this.formInline.inspector = '';
            this.formInline.organName = '';
            this.formInline.status = '';
            this.formInline.created = [];
            this.onSubmit();
            this.params.options = this.searchOptions;
            this.getList();
        }
    },
    mounted() {
        this.getList();
        this.getInspector();
    }
};
</script>

<style lang="scss" scoped>
#InspectFilter {
    .el-select {
        width: 100%;
    }
    .el-form-item--small.el-form-item {
        width: 100%;
    }
}
</style>
<style scoped>
#InspectFilter >>> .el-form-item__content {
    width: calc(100% - 100px);
}
</style>