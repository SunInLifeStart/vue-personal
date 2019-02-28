<template>
    <div id="Example" class="main-container">
        
        <div class="content-container" >
            <el-card class="box-card">
                
                <ExampleFilter/>

                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true">新建</el-button>
                </div>

                <ExampleList/>
            </el-card>
            <br>
            <el-card class="box-card">               
                <ExampleDetail/>
            </el-card>
        </div>
        <el-dialog title="收文" :visible.sync="dialogFormVisible" max-width="1280px" width="70%">
            <ExampleForm/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ExampleForm from "./ExampleForm";
import ExampleFilter from "./ExampleFilter";
import ExampleList from "./ExampleList";
import ExampleDetail from "./ExampleDetail";
export default {
  name: "Example",
  mounted() {},
  data() {
    return {
      dialogFormVisible: false
    };
  },
  components: {
    ExampleForm,
    ExampleFilter,
    ExampleList,
    ExampleDetail
  },
  methods: {}
};
</script>
<style lang="scss">
</style>