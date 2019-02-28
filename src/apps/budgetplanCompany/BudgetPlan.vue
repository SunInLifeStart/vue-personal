<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline" label-width="100px">
      <el-form-item label="年度：">
        <el-select v-model="form.year" placeholder="请选择年份">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="月度：">
        <el-select v-model="form.month" placeholder="请选择月份">
          <el-option
            v-for="item in optionsmonth"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="organName" label="部门" width align="center"></el-table-column>
      <el-table-column prop="title" label="资金计划" width="350" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
          <el-button
            @click="temporarySummary(scope.row)"
            type="text"
            size="small"
           v-show="scope.row.organName=='中关村发展集团'" >临时汇总</el-button>
          <el-button
            @click="summary(scope.row)"
            type="text"
            size="small"
            v-show="scope.row.organName=='中关村发展集团'"
          >汇总编制</el-button>
          <el-button
            @click="onRemind(scope.row)"
            type="text"
            size="small"
          v-show="scope.row.organName != '中关村发展集团' && scope.row.id == undefined ">提醒</el-button>
           <el-button v-show="scope.row.organName != '中关村发展集团' && scope.row.id != undefined" v-text="scope.row.title"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop label="执行情况" width="350" align="center">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.excuteStatus | formStatus}}</span> -->
          <el-button
            @click="onCheck(scope.row)"
            type="text"
            size="small"
          v-show="scope.row.organName != '中关村发展集团' && scope.row.excuteSituation == '0' " >提醒</el-button>
          <el-button v-show="scope.row.organName != '中关村发展集团' && scope.row.excuteSituation == '1' ">执行</el-button>
          <el-button
            @click="temporaryCheck(scope.row)"
            type="text"
            size="small"
            v-show="scope.row.organName=='中关村发展集团'"
          >临时查看</el-button>
          <el-button
            @click="executeSummary(scope.row)"
            type="text"
            size="small"
            v-show="scope.row.organName=='中关村发展集团'"
          >生成执行汇总</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.pageNum"
        :page-sizes="[5, 10, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </div>
    <!--汇总弹框-->
    <el-dialog title="预算岗提汇总单" :visible.sync="dialogVisible" width="100%">
      <summary-sheet :summaryData = "summaryData"></summary-sheet>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="中发展集团资金计划执行情况单" :visible.sync="dialogForm" width="90%">
      <execute-form></execute-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="dialogForm = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SummarySheet from './SummarySheet.vue'
import ExecuteForm from './ExecuteForm.vue'
import axios from 'axios'
export default {
  data() {
    return {
      dialogVisible:false,
      dialogForm:false,
      options: [
        {
          value: "2018",
          label: "2018"
        },
        {
          value: "2019",
          label: "2019"
        },
        {
          value: "2020",
          label: "2020"
        },
        {
          value: "2021",
          label: "2021"
        },
        {
          value: "2022",
          label: "2022"
        }
      ],
      optionsmonth: [
        {
          value: "1月",
          label: "1月"
        },
        {
          value: "2月",
          label: "2月"
        },
        {
          value: "3月",
          label: "3月"
        },
        {
          value: "4月",
          label: "4月"
        },
        {
          value: "5月",
          label: "5月"
        },
        {
          value: "6月",
          label: "6月"
        },
        {
          value: "7月",
          label: "7月"
        },
        {
          value: "8月",
          label: "8月"
        },
        {
          value: "9月",
          label: "9月"
        },
        {
          value: "10月",
          label: "10月"
        },
        {
          value: "11月",
          label: "11月"
        },
        {
          value: "12月",
          label: "12月"
        }
      ],
      tableData: [
        // {
        //   organName: "中关村发展集团",
        //   plan: "",
        //   status: ""
        // },
        // {
        //   organName: "党委办公室/集团办公室",
        //   plan: "",
        //   status: "未完成"
        // },
        // {
        //   organName: "党群工作部",
        //   plan: "12月资金计划",
        //   status: " "
        // }
      ],
      organData : [],
      form: {
        month : (new Date().getMonth() + 1 ) + '月',
        year : new Date().getFullYear() + '年'
      },
      page : {
        pageNum:1,
        pageSize:5,
        total:5
      },
      summaryData : {
        // data : {
        // }

      }
     
    };
  },
components: {
      SummarySheet,
      ExecuteForm
    },
  methods: {
    onSearch() {},
    //提醒
    onRemind(row) {
      console.log(1125, row.department);
    },
    sizeChange(){},
    currentChange(){},
    //临时汇总
    temporarySummary(row){
      this.dialogVisible=true;
      this.summaryData = {
        idCollection : ['11','12'],   //先写死
        year : this.form.year || '2018',
        month : this.form.month || '12'
      } 
    },
    //汇总编制
    summary(){
      this.dialogVisible=true;
    },
    //查看
    onCheck(){},
    //临时查看
    temporaryCheck(){
      this.dialogForm = true;
    },
    //生成执行汇总
    executeSummary(){
      this.dialogForm = true;
    },
    //获取资金计划列表信息
    getList () {
      //GET budget/capitalGroupForm/organList
      let url = `/budget/capitalGroupForm/organList`
      let params = Object.assign(this.page,this.form);
      axios.get(url,{
                headers: {
                    'Content-type': 'application/json'
                }
            }).then((res)=>{
              let data = res.data;
              this.organData = data.content;
            }).then((resolve) => {
              console.log(this.form.year)
              let params = {
                month : this.form.month || '02月',
                organs : this.organData,
                year : this.form.year || '2019'
              }
              // POST /api/v1/budget/capitalGroupForm/capitalDptFormList
              let url = `/budget/capitalGroupForm/capitalDptFormList`
              axios.post(url,JSON.stringify(params),{
                headers: {
                    'Content-type': 'application/json'
                }
              }).then(res => {
                let data = res.data.content;
                let obj = {
                  organName : '中关村发展集团'
                }
                data.unshift(obj)
                this.tableData = data;
              })

            })
    },
  
 },
  created () {
    // this.form.year = ;
    // this.form.month = (new Date().getMonth() + 1 ) + '月';
    this.getList();
  },
  filters : {
    formStatus (val) {
      let status = val - 0;
      return status ? '提醒' : '查看'
    }
  }
};
</script>
<style>
</style>
