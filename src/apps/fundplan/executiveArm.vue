<template>
    <div>
        <p>xx部门xx月资金计划执行情况单</p>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="统计年份">
                <el-date-picker  v-model="formInline.value6" type="month" value-format="yyyy-MM"  placeholder="选择时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            <br>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary"  @click="submit">提交执行</el-button>    
            <el-button type="primary">导出</el-button>
            <el-button type="primary">打印</el-button>
            <el-table  ref="multipleTable"  :data="formInline.tableData"  tooltip-effect="dark"  style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column  label="资金计划项" prop="project">
                </el-table-column>
                <el-table-column  prop="name"  label="资金计划总额" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column  prop="address"  label="报销执行总额" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column  prop="address"  label="实际执行总额" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column  prop="address"  label="执行率" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column  prop="address"  label="备注/执行差异说明" >
                <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import cookies from 'js-cookie';
export default {
  name: "executiveArm",
  data() {
    return {
      dialogVisible: false,
      
      formInline: {
        value6: "",
        tableData: [
            {
                project:'daw'
            }
        ],
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
      }
    };
  },
  props: ['formId', 'operationType'],
  watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                // this.clearForm();
            } else {
                this.getForm();
            }
        }
    },
  methods: {
    onSubmit() {
        if(this.value6){
            let val6 = this.value6.replace("-", ",").split(",");
            let params={
                organId:cookies.get('oid'),
                year:val6[0],
                month:val6[1]
            }
            axios
                .post(
                "/budget/capitalCaseDpt/fillItemsByYearAndMonth",
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
    },
    save(){
         axios
                .post(
                    '/api/v1/budget/capitalCaseDpt/update',
                    JSON.stringify(this.formInline),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                   console.log(this.formInline)
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
    },
    submit(){

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
