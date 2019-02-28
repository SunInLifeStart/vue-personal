<template>
    <div id="app">
        <TopBar />
        <div class="container">
            <div id="publicforum">
                <div class="leftnav">
                    <ul>
                        <li v-for="(item,index) in userList" :key="item.id" @click="selectCurrent(item,index)"  :class="{active: activeIndex == index}">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
                <div class="rightcontent" style="position:relative;">
                     <el-form ref="formupdate"  label-width="80px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="userId :" prop="type">
                                      <el-input v-model="userId" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                             <el-col :span="8">
                                <el-form-item label="formId :" prop="type">
                                      <el-input v-model="formId" placeholder="表单Id"></el-input>
                                </el-form-item>
                            </el-col>
                               <el-col :span="8">
                                <el-form-item label="flowId :" prop="type">
                                <el-select v-model="flowId" placeholder="流程Id">
                                    <el-option v-for="item in flowArr" :key="item" :label="item" :value="item"></el-option>
                                 </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row>
                            <el-col>
                               <div style="padding-left:25px;"><el-button type="primary" @click="getActions">获取动作</el-button></div>
                            </el-col>
                        </el-row>
                     </el-form>
                </div>
      

                <!-- <el-dialog title="提出问题" :visible.sync="dialogStatus" :close-on-click-modal="false" max-width="1280px" width="40%" style="text-align: center;">
                    <el-form :model="dialogModel" :rules="rulesQuestion" ref="formVaildQuestion">
                        <el-row>
                          
                        </el-row>
                        <el-row>
                         
                        </el-row>
                    </el-form>
                </el-dialog> -->
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { version } from "moment";
import TopBar from "@/components/TopBar.vue";
export default {
    data() {
        return {
            activeIndex:0,
            userList:[],
            userId:"",
            dialogStatus:false,
            dialogModel:{},
            formId:"",
            flowId:"预算子公司流程",
            flowArr:[
                "预算子公司流程",
                "预算汇总流程",
                "计划子公司流程",
                "计划子汇总流程"
            ]
        };
    },
    components: {
        TopBar,
    },
    filters: {
        filterGroupName: function(ids, userList) {
           
        }
    },
    methods: {
        getActions(){
            let x = {
                "预算子公司流程":"motor-budget_fundBudget",
                "预算汇总流程":"motor-budget_fundBudgetCollect",
                "计划子公司流程":"motor-budget_plan",
                "计划子汇总流程":"motor-budget_plancollect"
            };
            axios
                .get("/workflow/"+x[this.flowId]+"/"+this.formId+"/"+this.$store.getters.LoginData.uid+"/actions")
                .then(res => {
                    
            });
        },
        selectCurrent(item,index){  
            this.activeIndex = index;
            this.userId = item.id;
        },
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                this.userList =  res.data;
                this.userId = this.userList[0].id;
            });
        },
    },
    mounted: function() {
        this.getUsers();
    },
};
</script>

<style lang="scss" scoped> 
.container {
    overflow-y: auto;
    overflow-x: hidden;
}


#publicforum {
    width: 1000px;
    margin: 20px auto;
    font-size: 14px;
    .leftnav {
        width: 220px;
        top: 70px;
        bottom: 0px;
        overflow: scroll;
        position: fixed;
        ul{
          list-style: none;
          margin: 0px; 
          li{
              line-height: 32px;
              cursor: pointer;
              border-top: 1px solid #ededed;
              text-indent: 1em;
          }
           .active{
                  background: #ddd;
            }
        }
    }
    .rightcontent {
        margin-left: 250px;
        width: 750px;
    }
       
}
</style>