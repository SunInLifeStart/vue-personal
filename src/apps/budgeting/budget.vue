<template>
  <div id="budget">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="年度：">
        <el-input v-model="formInline.year"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="toolbar">
      <router-link to="/apps/budgetingform">
        <el-button type="primary" icon="el-icon-plus">新建预算</el-button>
      </router-link>
    </div>
    <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow" :highlight-current-row='true' class="lista">
      <el-table-column prop="title" label="全年预算" min-width="260"></el-table-column>
      <el-table-column label="执行情况" min-width="260">
        <template slot-scope="scope">
          <router-link to="/apps/budgetingsignal">
            <el-button type="text">生成执行</el-button>
          </router-link>
          <!-- <router-link to="/apps/budgetingform"> -->
          <router-link :to="{path:'/apps/budgetingform', query:{library:scope.row}}">
            <el-button type="text">查看</el-button>
          </router-link>
          <el-button type="text" @click="deleteList(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="资金计划生效时间" min-width="200"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import { YUSUAN } from '../data.js'
import cookies from 'js-cookie'
export default {
  name: 'budget',
  data() {
    return {
      formInline: {
        year: ''
      },
      tableData: [],
      // tableData: YUSUAN['yusuanList'],
      params: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      costUnit: '',
      organs: []
    }
  },
  mounted() {
    this.getOrgan()
    this.getList()
  },
  methods: {
    //删除预算列
    deleteList(row) {
      this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
        axios.get('/budget/BudgetDptForm/' + row.id + '/delete').then(res => {
          this.getList();
        })
      });
    },
    onSubmit() {
      this.getList()
    },
    newForm() { },
    clickTableRow() { },
    getList() {
      console.log('getlist')
      const self = this
      const params = {
        page: this.params.pageNum,
        pageSize: this.params.pageSize,
        year: this.formInline.year,
        crtDeptId: cookies.get('oid'),
      }
      axios
        .post('/budget/BudgetDptForm/queryList', JSON.stringify(params), {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(res => {
          self.tableData = res.data.content.list;
          this.params.total = res.data.content.total;
          //   if (res.data.forms.length > 0) {
          //     self.$emit("formId", res.data.forms[0].id);
          //   }
        })
        .catch(function () {
          self.$message({
            message: '操作失败',
            type: 'error'
          })
        })
    },
    getOrgan() {
      axios.get('/api/v1/users/get/allOrgans').then(res => {
        this.organs = res.data
      })
    },
    //分页查询
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(pageNum) {
      this.params.pageNum = pageNum
      this.getList()
    }
  }
}
</script>
<style>
</style>