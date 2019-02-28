<template>
  <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="资金计划" name="first">
        <budget-plan></budget-plan>  
      </el-tab-pane>
      <el-tab-pane label="执 行" name="second">
        <execute></execute>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import BudgetPlan from './BudgetPlan.vue'
import Execute from './Execute.vue'
export default {
  data(){
    return{
      activeName2: 'first',
    }
  },
  components: {
      BudgetPlan,
      Execute,
    },
    methods:{
      handleClick(){},
    },
};
</script>
<style>
</style>
