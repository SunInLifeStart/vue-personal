<template>
  <div id="ContractList">
    <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow" :highlight-current-row='true' class="lista">
      <el-table-column prop="contractName" label="合同名称" min-width="260"></el-table-column>
      <el-table-column prop="partyB" label="合同对方" min-width="260"></el-table-column>
      <el-table-column prop="contractNum" label="合同编号" min-width="200"></el-table-column>
      <!-- <el-table-column prop="hostDept" label="合同承办部门" min-width="150"></el-table-column> -->
      <el-table-column prop="creatorName" label="制单人" min-width="120"></el-table-column>
      <!-- <el-table-column prop="created" label="申请日期" min-width="200">
                <template slot-scope="scope">
                    {{scope.row.created | dateformat}}
                </template>
            </el-table-column> -->
      <!-- <el-table-column prop="contractStatus" label="合同状态" min-width="140"></el-table-column> -->
      <el-table-column prop="status" label="单据状态" min-width="110"></el-table-column>
      <el-table-column label="操作" width="90px" fixed='right'>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-show="scope.row.status == '已保存' || scope.row.status == '已驳回'">
            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="left" v-show="scope.row.status == '已保存' || scope.row.status == '已驳回'">
            <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'ContractList',
    data() {
        return {
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            tableData: []
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.getList();
    },
    watch: {
        searchOptions: function() {
            this.params.pageNum = 1;
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/contract_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '查询列表操作失败',
                        type: 'error'
                    });
                });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            this.$emit('editForm', row.id);
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        deleteItem(row) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.deleteAffirm(row);
            });
        },
        deleteAffirm(row) {
            const self = this;
            axios
                .get('/api/v1/contract_forms/delete/' + row.id)
                .then(res => {
                    self.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    self.getList();
                })
                .catch(function() {
                    self.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss">
</style>
