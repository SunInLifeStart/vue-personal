<template>
  <div id="fundplanplanpList">
    <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
      <el-table-column prop="title" label="资金计划"></el-table-column>
      <!-- <el-table-column label="执行情况">
        <template slot-scope="scope">
          
          <el-button type="text" size="small" @click="views(scope.row)" v-else>查看</el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="created" label="资金计划生效时间"></el-table-column>
      <el-table-column label="操作" width align="center">
        <template slot-scope="scope">
          <el-button
            @click="editForm(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.excuteStatus == '0' "
          >生成执行</el-button>
          <el-button type="text" size="small" @click="checkItem(scope.row)" v-else>查看</el-button>
          <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="params.pageNum"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.total"
    ></el-pagination>
  </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
import store from "@/store";
export default {
  name: "fundplanplanpList",
  data() {
    return {
      tableData: [],
      params: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      }
    };
  },
  props: {
    searchOptions: {
      type: Array
    },
    operationType: {
      type: String
    }
  },
  watch: {
    searchOptions: function() {
      this.params.pageNum = 1;
      this.getList();
    }
  },

  filters: {
    filterStatus: function(data) {
      if (data == null) {
        return "已保存";
      } else {
        return data;
      }
    }
  },
  mounted() {
    this.getList();
    
    console.log();
  },
  methods: {
    //查看
    checkItem(row) {
      this.$emit("checkItem", row.id);
      console.log(33333, row.id);
    },
    //编辑
    editItem(row) {
      this.$emit("editItem", row.id);
    },
    //删除
    deleteItem(row) {
      this.$confirm("此操作将永久删除该表单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.get(`budget/capitalDptForm/deleteById/${row.id}`).then(res => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    // deleteForm(row) {
    //     this.$confirm("此操作将永久删除该表单, 是否继续?", "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //     }).then(() => {
    //         axios
    //             .get("/api/v1/incoming_forms/delete/" + row.id)
    //             .then(res => {
    //                 this.getList();
    //                 this.$message({
    //                     type: "success",
    //                     message: "删除成功!"
    //                 });
    //             });
    //     });
    // },
    getList() {
      const self = this;
      const params = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        organId: 1 || this.$store.state.loginData.oid - 0, //因为13没有数据
        month:
          this.searchOptions.length > 0
            ? JSON.parse(JSON.stringify(this.searchOptions[1]))
            : "", // 深拷贝
        year:
          this.searchOptions.length > 0
            ? JSON.parse(JSON.stringify(this.searchOptions[0]))
            : ""
        // month: "2",
        // year: "2019"
      };
      console.log(this.searchOptions);
      axios
        .post("/budget/capitalDptForm/list", JSON.stringify(params), {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => {
          console.log(111225, res);
          self.tableData = res.data.list;
          self.params.total = res.data.total;
          self.params.pageNum = res.data.pageNum;
          self.params.pageSize = res.data.pageSize;
          //   if (res.data.forms.length > 0) {
          //     self.$emit("formId", res.data.forms[0].id);
          //   }
        })
        .catch(function() {
          self.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    getTargetTree() {
      console.log("get-tree");
      axios.get("/budget/capitalDptForm/getTargetTree").then(res => {
        console.log(res);
      });
    },
    clickTableRow(row) {
      this.$emit("getFormId", row.id);
    },
    editForm(row) {
      this.$emit("editForm", row.id);
    },
    views(row) {
      this.$emit("viewsForm", row.id);
    },
    currentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.getList();
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.getList();
    }
  },
  store
};
</script>