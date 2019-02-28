<template>
    <div id="index">
        <el-card style="margin-top:50px;">
            <el-row :gutter="50">
                <el-col :span="5" style="margin-left: 100px">
                    <router-link to="/apps/fundplan">
                        <div class="grid-content bg-purple-4">
                            <img src="../../assets/tianbao.png" alt="" style="width : 80px;margin : 0 auto; display : block;padding-top:40px">
                            <p class="grid-font">资金计划（部门）</p>
                        </div>
                    </router-link>
                </el-col>
                <el-col :span="5">
                    <router-link to="/apps/budgetplanCompany">
                        <div class="grid-content bg-purple-4">
                            <img src="../../assets/tianbao.png" alt="" style="width : 80px;margin : 0 auto; display : block;padding-top:40px">
                            <p class="grid-font">资金计划（集团）</p>
                        </div>
                    </router-link>
                </el-col>
                <el-col :span="5">
                    <router-link to="/apps/budgeting">
                        <div class="grid-content bg-purple-4">
                            <img src="../../assets/tianbao.png" alt="" style="width : 80px;margin : 0 auto; display : block;padding-top:40px">
                            <p class="grid-font">预算（部门）</p>
                        </div>
                    </router-link>
                </el-col>
                <el-col :span="5">
                    <router-link to="/apps/yusuan">
                        <div class="grid-content bg-purple-4">
                            <img src="../../assets/tianbao.png" alt="" style="width : 80px;margin : 0 auto; display : block;padding-top:40px">
                            <p class="grid-font">预算（集团）</p>
                        </div>
                    </router-link>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'index',
    data() {
        return {
            neirong: '',
            region: '',
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
        };
    },
    mounted() {

    },
    created() {

    },
    methods: {


    },

};
// setTimeout(()=>{
//     location.reload()
// },500)
</script>
<style lang="scss">
#index {
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 50px;
  }
  .bg-purple-1 {
    background: #71c671;
  }
  .bg-purple-2 {
    background: #98fb98;
  }
  .bg-purple-3 {
    background: #a2b5cd;
  }
  .bg-purple-4 {
    background: #c6e2ff;
  }
  .bg-purple-5 {
    background: #fff68f;
  }
  .grid-content {
    border-radius: 50px;
    height: 200px;
  }
  .content-font {
    font-size: 40px;
    text-align: center;
    line-height: 120px;
  }
  .grid-font {
    font-size: 20px;
    text-align: center;
  }
}
</style>
