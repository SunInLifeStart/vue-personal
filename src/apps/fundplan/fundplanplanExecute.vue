<template>
    <div>
        <p>xx部门xx月资金计划执行情况单</p>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="统计年份">
                <el-date-picker  v-model="formInline.value6" type="month" value-format="yyyy-MM"  placeholder="选择时间">
                </el-date-picker>
                至
                <el-date-picker  v-model="formInline.value7" type="month"  placeholder="选择时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="executiveArm">执行生成</el-button>
        <el-button type="primary">导出</el-button>
        <el-button type="primary">打印</el-button>
        <el-table  ref="multipleTable"  :data="tableData"  tooltip-effect="dark"  style="width: 100%;margin-top: 10px;"  @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column  label="资金计划项" prop="capitalProject">
            </el-table-column>
            <el-table-column  prop="capitalProjectSum"  label="资金计划总额" >
            </el-table-column>
            <el-table-column  prop="capitalReimSum"  label="报销执行总额" >
            </el-table-column>
            <el-table-column  prop="practicalExecuteSum"  label="实际执行总额" >
            </el-table-column>
            <el-table-column  prop="capitalReimSum"  label="执行率" >
            </el-table-column>
            <el-table-column  prop="remarks"  label="备注/执行差异说明" >
            </el-table-column>
        </el-table>
        <el-dialog title=""  :visible.sync="dialogVisible"  width="80%" >
            <executiveArm ></executiveArm>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import executiveArm from "./executiveArm.vue";
export default {
  name: "fundplanplanExecute",
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      formInline: {
        value6: "",
        value7:"",
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
    }
    
  },
  components: {
    executiveArm
  },
  mounted(){
      this.getList();
     
  },
  methods: {
    pushoptions2(){},
    onSubmit() {
        let val7 = this.formInline.value7.replace("-", ",").split(",");
        // let val6 = this.formInline.value6.replace("-", ",").split(","); 
        // console.log(val6)
        console.log(val7)
        // const params = {
        //     startYear: val6[0],
        //     startMonth: val6[1],
        //     endYear: val7[0],
        //     endMonth: val7[1]
        // };
        // axios
        //     .post(
        //     "/budget/capitalCaseDpt/listByYearAndMonth",
        //     JSON.stringify(params),
        //     {
        //         headers: {
        //         "Content-type": "application/json"
        //         }
        //     }
        //     )
        //     .then(res => {
        //     // this.tableData= res.data.content ;
        //     })
        //     .catch(function() {
        //     self.$message({
        //         message: "操作失败",
        //         type: "error"
        //     });
        //     });
              
        },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    executiveArm() {
      this.dialogVisible = true;
      // this.operationType = 'create';
    },
    getList() {
      const self = this;
      const params = {
        groupId: "",
        month: "",
        year: ""
      };
      axios
        .post(
          "/budget/capitalCaseDpt/listByYearAndMonth",
          JSON.stringify(params),
          {
            headers: {
              "Content-type": "application/json"
            }
          }
        )
        .then(res => {
           this.tableData= res.data.content ;
        })
        .catch(function() {
          self.$message({
            message: "操作失败",
            type: "error"
          });
        });
    }
  }
};
</script>
