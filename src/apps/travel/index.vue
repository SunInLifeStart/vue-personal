<template>
    <div>
        <el-card class="box-card">
            <div id="TravelFilter">
                <el-form :inline="true" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="params.submitter" placeholder="提单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="params.submitter" placeholder="提单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="费用承担部门">
                                <el-input v-model="params.subOrganName" placeholder="费用承担部门"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="状态">
                                <el-select v-model="params.status" placeholder="请选择">
                                    <el-option label="已保存" value="已保存"></el-option>
                                    <el-option label="审核中" value="审核中"></el-option>
                                    <el-option label="已驳回" value="已驳回"></el-option>
                                    <el-option label="已完成" value="已完成"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提单时间">
                                <el-date-picker v-model="params.submitted" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style=" text-align: right">
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button type="" @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--  <el-form-item label="拟稿单位">
                        <el-input v-model="params.draftUnit" placeholder="拟稿单位"></el-input>
                    </el-form-item> -->
                </el-form>
            </div>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="TravelList">
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
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button @click="editForm(scope.row)" type="primary" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">编辑
                    </el-button>
                    <el-button type="danger" @click="deleteItem(scope.row)" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">删除
                    </el-button> -->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '已保存'">
                                <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <TravelDetail :formId="formId" ref="TravelDetail"></TravelDetail>
        </el-card>
        <TravelForm ref="TrainForm" @reloadList = "reloadList"></TravelForm>
    </div>
</template>
<script>
// import TravelList from './TravelList';
import TravelForm from './TravelForm';
// import TravelFilter from './TravelFilter';
import TravelDetail from './TravelDetail';
export default {
    name: 'travel',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                pageNum: 1,
                pageSize: 5,
                department: "",
                submitter: "",
                total: 0
            },
            formName:"trainingApplication"
        };
    },
    mounted(){
        this.getList
    },
    methods: {
       async getList(pageNum) {
            let $self = this;
            $self.url = "/api/v1/trainingApplication/queryList";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                   let formId = response.data.content.list[0].id;
                   $self.$refs.TrainDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.TrainDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.TrainForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.TrainForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.TrainDetail.getFormDetails(params.id);
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
            this.params.submitter = this.params.department = "";
        }
    },
    components: {
        TravelForm,
        TravelDetail
    }
};
</script>
<style lang="scss" scoped>
      #TravelFilter  .el-form-item--small.el-form-item{
            width: 100%;
        }
</style>
<style scoped>
#TravelFilter .filterForm >>> .el-form-item__content{
        width: calc(100% - 100px);
    }
</style>


