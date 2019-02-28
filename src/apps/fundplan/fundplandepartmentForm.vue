<template>
  <div id="fundplanplanpForm">
    <el-button type="primary" @click="exportForm">导出</el-button>
    <el-button type="primary" style="margin-bottom:10px">打印</el-button>

    <el-form ref="formupdate" :model="rows" :inline="true" label-width="80px">
      <el-form-item label>
        <el-select v-model="rows.year" placeholder="选择年">
          <el-option
            v-for="item in optionsYear"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <span style=" display: inline-block; margin-top: 7px;margin-right:7px;">------</span>
      <el-form-item label>
        <el-select v-model="rows.month" placeholder="选择月">
          <el-option
            v-for="item in optionsMonth"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <p style="text-align: center">中关村发展集团股份有限公司</p>
      <p style="text-align: center;color: #e01e1e;">{{rows.year}}年{{rows.month}}滚动资金计划收支表</p>
      <p class="rmb">
        <span>党委办公室/集团办公室</span>
        <span>单位：元人民币</span>
      </p>
      <table style="width: 100%; table-layout: fixed; word-break: break-all;">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <col style="width: 7%">
        <tr>
          <td rowspan="2">项目</td>
          <td colspan="3">季度合计</td>
          <td colspan="3">{{rows.year}}年{{rows.month}}</td>
          <td colspan="3">{{rows.year || yearFilter}}年{{rows.month || monthFilter}}</td>
          <td colspan="3">{{rows.year || yearFilter}}年{{rows.month || monthFilter}}</td>
          <td rowspan="2">编制依据、内容、标准进展等</td>
        </tr>
        <tr>
          <td>预算内</td>
          <td>预算外</td>
          <td>小计</td>
          <td>预算内</td>
          <td>预算外</td>
          <td>小计</td>
          <td>预算内</td>
          <td>预算外</td>
          <td>小计</td>
          <td>预算内</td>
          <td>预算外</td>
          <td>小计</td>
        </tr>

        <tr v-for="(item,index) in list" :key="index">
          <td>{{item.name}}</td>
          <td>
            <el-input :disabled="disabl" v-model="item.budgetInQuarter"></el-input>
          </td>
          <td>
            <el-input :disabled="disabl" v-model="item.budgetOutQuarter"></el-input>
          </td>
          <td>
            <el-input :disabled="disabl" v-model="item.totalQuarter"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetIn" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetOut" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="disabl" v-model="item.total"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetIn2" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetOut2" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="disabl" v-model="item.total2"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetIn3" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.budgetOut3" @input="getRow(item)"></el-input>
          </td>
          <td>
            <el-input :disabled="disabl" v-model="item.total3"></el-input>
          </td>
          <td>
            <el-input :disabled="item.disabl" v-model="item.compilationBasis"></el-input>
          </td>
        </tr>
      </table>
    </el-form>
  </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
import cookies from "js-cookie";
import moment from "moment";
import FilesOperate from "../FilesOperate";
export default {
  name: "fundplanplanpForm",
  data() {
    return {
      disabl: "",
      numberValidateForm: {},
      tabledata: [],
      optionsYear: [],
      optionsMonth: [],
      valueYear: "",
      valueMonth: "",
      rows: {
        month: "",
        year: "",
        records: [
          {
            budgetIn: 0,
            budgetOut: 0,
            code: "031002002",
            compilationBasis: "编制依据",
            month: "月度",
            project: "把收回的代持资金还给政府",
            targetId: 257,
            total: 0,
            year: "年度"
          }
        ]
      },
      list: [],
      uploadId: 0,
      lastCopy_status: false,
      childOptions_status: false,
      commonInput: true,
      currentFormId: this.operationType == "create" ? "" : this.formId,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      value2: ""
    };
  },
  props: {
    formId: {
      type: Number
    },
    operationType: {
      type: String
    }
  },
  components: {
    FilesOperate
  },
  watch: {
    // formId: function() {
    //   this.getForm();
    // },
    operationType: function() {
      if (this.operationType == "create") {
        this.clearForm();
      } else {
        // this.getForm();
      }
    }
  },
  mounted() {
  
    if (this.operationType == "checkItem") {
      
      this.getFormById();
    }
    if (this.operationType == "editItem") {
      this.getFormById();
      this.rows.id = this.formId;
    }
    console.log(5555, this.formId);
  },
  methods: {
    //导出
    exportForm() {},
    getRow(item) {
      item.total = parseFloat(item.budgetOut) + parseFloat(item.budgetIn);
      item.total2 = parseFloat(item.budgetOut2) + parseFloat(item.budgetIn2);
      item.total3 = parseFloat(item.budgetOut3) + parseFloat(item.budgetIn3);
    },
    getId(id) {
      let self = this;
      self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
        self.rows.attachments.forEach(function(value, index) {
          if (value.id == id) {
            axios.get("/api/v1/incoming_forms/deleteAtt/" + id).then(res => {
              self.rows.attachments.splice(index, 1);
            });
          }
        });
      });
    },
    //根据id获取详细
    getFormById() {
      axios
        .post(`/budget/capitalDptForm/findById/${this.formId}`, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => {
          this.list = res.data.content.records;
          // this.list = JSON.parse(JSON.stringify(self.list).replace(/project/g,"name"));
          console.log("看一看", res);
          this.rows.year = res.data.content.year;
          this.rows.month = res.data.content.month;
          this.list.filter(item => {
            return (item.name = item.project);
          });
        })
        .catch(function() {
          // self.$message({
          //   message: "查询失败",
          //   type: "error"
          // });
        });
    },
    //码表获取年
    getYear() {
      axios
        .get(`/budget/code/getCode/1`, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => {
          console.log(54322221, res);
          this.optionsYear = res.data.content;
        })
        .catch(function() {
          // self.$message({
          //   message: "查询失败",
          //   type: "error"
          // });
        });
    },
    //码表获取月
    getMonth() {
      axios
        .get(`/budget/code/getCode/2`, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => {
          console.log(54322221, res);
          this.optionsMonth = res.data.content;
        })
        .catch(function() {
          // self.$message({
          //   message: "查询失败",
          //   type: "error"
          // });
        });
    },
    getIcommingType(type) {
      if (type) {
        this.rows.organ = "";
        if (type == "superior" || type == "copy") {
          this.childOptions_status = this.commonInput = false;
          this.lastCopy_status = true;
        } else if (type == "childcom") {
          this.lastCopy_status = this.commonInput = false;
          this.childOptions_status = true;
        } else {
          this.lastCopy_status = this.childOptions_status = false;
          this.commonInput = true;
        }
      }
    },
   
    saveFormValidate() {
      
      this.$refs["formupdate"].validate(valid => {
        if (valid) {
          this.saveForm();
          this.$emit("saveStatus", false);
        }
      });
    },
    saveForm() {
      const self = this;
      self.list = JSON.parse(
        JSON.stringify(self.list).replace(/name/g, "project")
      );
      self.list = JSON.parse(
        JSON.stringify(self.list).replace(/id/g, "targetId")
      );
      console.log(1125, this.list);
      self.list.forEach(item => {
        return (item.budgetIn = parseFloat(item.budgetIn));
      });
      self.list.forEach(item => {
        return (item.budgetOut = parseFloat(item.budgetOut));
      });
      self.list.forEach(item => {
        return (item.year = this.rows.year);
      });
      self.list.forEach(item => {
        return (item.month = this.rows.month);
      });
      self.rows.records = self.list;
      axios
        .post(
          "/budget/capitalDptForm/update?uid=1&uname=1&oid=1&oname=1",
          JSON.stringify(self.rows),
          {
            headers: {
              "Content-type": "application/json"
            }
          }
        )
        .then(res => {
          
          self.$emit("saveSuccess", res.status);
          self.currentFormId = res.data.id;
          self.setMemo();
          // self.clearForm();
          self.list = [];
          if (action == "save") {
            self.submitForm();
          } else {
            self.$emit("refreshData");
            if (this.operationType == "edit") {
              self.$emit("refreshDetail");
            }
          }
        })
        .catch(function() {
          // self.$message({
          //   message: "操作失败",
          //   type: "error"
          // });
        });
    },
    //提交
    submitCheck() {
      this.$refs["formupdate"].validate(valid => {
        if (valid) {
          // this.saveForm("save");
          this.submitForm();
          this.$emit("saveStatus", false);
        }
      });
    },
    submitForm() {
      const self = this;
      axios
        .post(`/budget/capitalDptForm/${this.formId}/commit`, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => {
         

          self.actionsForm();
        })
        .catch(function() {
          self.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    actionsForm() {
      axios
        .get(
          `/workflow/motor-budget_plan/${this.formId}/${cookies.get("uid")}/actions`,

          {
            headers: {
              "Content-type": "application/json"
            }
          }
        )
        .then(res => {
          
          this.startProcess(res);
        })
        .catch(function() {
          self.$message({
            message: "actions操作失败",
            type: "error"
          });
        });
    },
    comment(comment) {
      let self = this;
      axios
        .put(`/api/v1/incoming_forms/${self.currentFormId}/comment`, {
          content: "提交"
        })
        .then(res => {});
    },
    commitForm(processId) {
      const self = this;
      axios
        .put(
          "/api/v1/incoming_forms/" +
            this.currentFormId +
            "/commit/" +
            processId,
          "",
          {
            headers: {
              "Content-type": "application/json"
            }
          }
        )
        .then(res => {
          self.comment();
          self.startProcess();
        })
        .catch(function() {
          self.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    startProcess(res) {
      const self = this;
      
  
      axios
        .put(
          `/workflow/motor-budget_plan/${this.formId}/${cookies.get("uid")}/signal`,
          JSON.stringify({}),
          {
            headers: {
              "Content-type": "application/json"
            }
          }
        )
        .then(res => {
          self.$message({
            message: "提交成功",
            type: "success"
          });
         
          // self.$emit("refreshData");
          // self.comment(params.id);
        })
        .catch(function() {
          self.$message({
            message: "signal操作失败",
            type: "error"
          });
        });
    },
    deleteItem(index) {
      this.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
        this.tableData.splice(index, 1);
      });
    },
    handleSuccess(response, file) {
      const self = this;
      if (response.length > 0) {
        response.forEach(function(item) {
          self.rows.attachments.push(item);
        });
      }
      this.$refs.upload.clearFiles();
    },
    downloadFile(item) {
      // window.open(url, '_blank');
      this.common.preview(item);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handlePreview() {},
    handleRemove() {},
    getFormData() {
      return this.rows;
    },
    clearForm() {
      this.rows = {
        year: "",
        month: "",
        records:[],
      };
    },
    getList() {
      // GET /api/v1/budget/capitalDptForm/getTargetTree
      let url = `/budget/capitalDptForm/getTargetTree?formId=12`;
      axios.get(url).then(res => {
        let data = res.data.content;
        this.listDivided(data);
      });
    },
    listDivided(arr) {
      if (arr.length == 0) return;
      let newArr = arr.filter(item => {
        //最底层为12个数字的
        // return item.code.length == 12
      });
      newArr.forEach((item, index) => {
        let key = item.code.substr(0, 9);
        let val = item.code.substr(0, 6);
        arr.forEach((i, j) => {
          if (i.code == key) {
            i.disabl = true;
          }
          if (i.code == val) {
            i.disabl = true;
          }
        });
      });
      let contentArr = arr.filter(item => {
        //最底层为9个数字
        // return item.code.length == 9
      });
      contentArr.forEach((item, index) => {
        let key = item.code.substr(0, 6);
        arr.forEach((i, j) => {
          if (i.code == key) {
            i.disabl = true;
          }
        });
      });
      let toptArr = arr.filter(item => {
        //最底层为6个数字
        // return item.code.length == 6
      });
      toptArr.forEach((item, index) => {
        let key = item.code.substr(0, 6);
        arr.forEach((i, j) => {
          if (i.code == key) {
            i.disabl = true;
          }
        });
      });

      // 找到最顶层的叶子结点，判断是不是同时也是最底层的叶子结点
      //  let topArr = arr.filter(item => {
      //    return item.code.length == 6      //最顶层code长度为6
      //  })
      //  topArr.forEach((item,index) => {

      //    arr.forEach((i,j) => {
      //      let isBottom = false;
      //      if (i.code.indexOf(item.code) != -1 ) {    //包含这个的话
      //        let mod = i.code.length % item.code.length;
      //       //  if (mod == 0) {

      //       //  }else if (mod == 3) {

      //       //  }else if (mod == 6) {

      //       //  }

      //       //  if (mod == 3) {

      //       //  }
      //       //  if (mod == 6) {

      //       //  }

      //      }else {        // code长度为6已经是最底层了
      //       continue;
      //      }
      //    })
      //  })

      //找到
      //添加属性
      this.list = arr;
    }
  },
  created() {
    this.getList();
    this.getYear();
    this.getMonth();
  },
  computed: {
    editComputed() {}
  }
};
</script>
<style lang="scss" scoped>
#fundplanplanpForm {
  table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    width: 100%;
  }
  table td,
  table th {
    border: 1px solid #000;
    color: #000;
    height: 40px;
    vertical-align: middle;
  }
  table thead th {
    background-color: #cce8eb;
  }
  table tr:nth-child(odd) {
    background: #fff;
  }
  table tr:nth-child(even) {
    background: #fff;
  }
  .rmb span {
    color: #e01e1e;
  }
  .rmb span:last-child {
    float: right;
  }
}
</style>