<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline" label-width="140px">
      <el-form-item label="关联月度资金计划：">
        <el-date-picker v-model="form.value1" type="month" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">确定</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button type="primary" @click="onSubmit">提交生成</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
        <el-button type="primary" @click="onPrinting">打印</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="plan" label="资金计划项" width="180" align="center"></el-table-column>
      <el-table-column prop="funds" label="资金计划总额" width="180" align="center">
      </el-table-column>
      <el-table-column prop="reimbursement" label="报销执行总额" width="180" align="center">
      </el-table-column>
      <el-table-column prop="actual" label="实际执行总额" width="180" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.actual"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="执行率" width="180" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remarks"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      tableData: [
        {
          plan: "股权筹资",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        },
        {
          plan: "债务筹资",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        },
        {
          plan: "处置子公司及其他单位的股权",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        },
        {
          plan: "收回委托贷款",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        },
        {
          plan: "投资收益",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        },
        {
          plan: "利息收入",
          funds: "",
          reimbursement: "",
          actual: "",
          rate: "",
          remarks: ""
        }
      ],
      options: [
        {
          value: "中发展集团",
          label: "中发展集团"
        },
        {
          value: "董事会办公室",
          label: "董事会办公室"
        },
        {
          value: "党群工作室",
          label: "党群工作室"
        },
        {
          value: "资本运营部",
          label: "资本运营部"
        },
        {
          value: "海外事业部",
          label: "海外事业部"
        }
      ]
    };
  },
  methods: {
    //查询
    onSearch() {},
    //导出
    onExport() {},
    //打印
    onPrinting() {},
    //保存
    onSave(){},
    //提交
    onSubmit(){},
    handleSelectionChange() {}
  }
};
</script>
<style>
</style>
