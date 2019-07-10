<template>
    <div id="Approval">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="ApprovalFilter">
                <el-form :inline="true" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <!-- 印章种类、申请日期、申请人、申请部门 -->
                        <el-col :span="8">
                            <el-form-item label="公司部门">
                                <el-input placeholder="请输入公司部门" v-model="params.organName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请人">
                                <el-input placeholder="请输入申请人" v-model="params.creatorName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="印章种类">
                                <!-- <el-input placeholder="请输入印章种类" v-model="params.useItems"></el-input> -->
                                <el-select style="width:100%;" clearable v-model="params.useItems" placeholder="请选择印章种类">
                                    <el-option v-for="item in onOption" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="申请时间">
                                <!-- <el-input placeholder="请输入申请时间" v-model="params.created"></el-input> -->
                                <el-date-picker v-model="params.created" value-format="yyyy-MM-dd" style="width:100%" type="date">
                                </el-date-picker>
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
                        <el-col :span="8" >
                            <el-form-item >
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
            <div id="ApprovalList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column label="印章种类">
                        <template slot-scope="scope">{{scope.row.useItems | useItemsfilter}}</template>
                    </el-table-column>
                    <el-table-column prop="organName" label="公司部门">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="申请人">
                    </el-table-column>
                    <el-table-column prop="created" label="申请时间">
                    </el-table-column>
                    <el-table-column prop="recipientsTime" label="领用时间">
                    </el-table-column>
                    <el-table-column prop="accompanyingPerson" label="陪同人">
                    </el-table-column>
                    <!-- <el-table-column prop="fileName" label="用印文件名称">
                    </el-table-column>
                    <el-table-column prop="fileNum" width="250" label="用印份数"></el-table-column> -->
                    <el-table-column label="单据状态">
                        <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                    </el-table-column>

                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00' ">
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
            <ApprovalDetail @resetStatus="resetStatus" :formId="formId" ref="ApprovalDetail" @reloadList="reloadList"></ApprovalDetail>
            <!-- :formId="formId" -->
        </el-card>
        <ApprovalForm ref="ApprovalForm" @reloadList="reloadList"></ApprovalForm>
        <!-- :formDataFromIndex="formDataFromIndex"  -->
    </div>
</template>
<script>
import ApprovalForm from './ApprovalForm';
import ApprovalDetail from './ApprovalDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Approval',
    data() {
        return {
            tableData: [],
            formDetails: {},
            onOption: [
                {
                    value: 'farenzhang',
                    label: '法人章'
                },
                {
                    value: 'dangzhibuzhang',
                    label: '党支部章'
                },
                {
                    value: 'gongzhang',
                    label: '公章'
                },
                {
                    value: 'hetongzhang',
                    label: '合同章'
                },
                {
                    value: 'gonghuizhang',
                    label: '工会章'
                },
                {
                    value: 'yingyezhizhao',
                    label: '营业执照'
                },
                {
                    value: 'jingshenweizhang',
                    label: '经审委印章'
                }
            ],
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
                pageNum: 1,
                pageSize: 5,
                creatorName: '',
                useItems: '',
                total: 0,
                created: '',
                organName: '',
                status: ''
            },
            formName: 'singApproval'
        };
    },
    components: {
        ApprovalForm,
        ApprovalDetail
    },
    filters: {
        useItemsfilter: function(data) {
            let xmlJson = {
                farenzhang: '法人章',
                dangzhibuzhang: '党支部章',
                gongzhang: '公章',
                hetongzhang: '合同章',
                gonghuizhang: '工会章',
                yingyezhizhao: '营业执照',
                jingshenweizhang: '经审委印章',
                caiwuzhang: '财务章'
            };
            return xmlJson[data];
        },
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
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        },
        //获取列表
        async getList(pageNum) {
            let $self = this;
            $self.url = '/api/v1/singApproval/queryList';
            let response = await $self.getQueryList();
            if (response) {
                if (
                    response.data.content.list &&
                    response.data.content.list.length > 0
                ) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.ApprovalDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                // $self.msgTips('获取列表失败', 'warning');
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.ApprovalDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.ApprovalForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.ApprovalForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.ApprovalDetail.getFormDetails(params.id);
            }
        },
        //分页
        currentChange(pageNum) {
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
            this.params.creatorName = this.params.useItems = '';
            this.params.created = this.params.organName = '';
            this.params.status = '';
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style scoped>
#ApprovalFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#ApprovalFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}

#ApprovalFilter .filterForm >>> .el-select {
    width: calc(100% - 15px);
}
#ApprovalFilter .filterForm >>> .el-date-editor {
    width: calc(100% - 0px);
}
</style>
<style lang="scss" scoped>
#ApprovalFilter {
    .searchBtn {
        padding-right: 25px;
        .positionBtn {
            text-align: right;
        }
    }
}
</style>

