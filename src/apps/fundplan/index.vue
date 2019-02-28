<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="资金计划" name="first">
        <fundplanpdepartment></fundplanpdepartment>
    </el-tab-pane>
    <el-tab-pane label="执行" name="second">
      <fundplanplanExecute></fundplanplanExecute>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import fundplanpdepartment from './fundplanpdepartment.vue';
import fundplanplanExecute from './fundplanplanExecute.vue';
  export default {
    name:'fundplan',
    data() {
      return {
        activeName: 'first'
      };
    },
    components:{
        fundplanpdepartment,
        fundplanplanExecute
    },
    methods: {
      handleClick(tab, event) {
      }
    }
  };
</script>