<template>
    <div>
        <div id="DiscussionForm">
            <el-form :model="formData" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="标题">
                            <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="内容">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.content">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="序号">
                            <el-input :rows="2" placeholder="请输入序号" v-model="formData.serial">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列席">
                            <el-select style="width:100%;" v-model="userId" multiple filterable allow-create default-first-option placeholder="请选择列席人员">
                                <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

    

<script>
/* eslint-disable */
import axios from "axios";
export default {
    name: "DiscussionForm",
    data() {
        return {
            formData: {
                title: "",
                content: "",
                serial : ""
            },
            userId:[],
            userList: [],
        };
    },
    props:['users'],
    mounted() {
          this.userList =this.users;
    },
   
    methods: {
        savaCurrentDiscussion() {
            const self = this;
            const arr  = [];
            for(let a of self.userList){
               for(let b of self.userId){
                   if(a.id == b){
                       arr.push({"id":a.id,"name":a.name});
                   }
               }
            }
            this.formData.delegates = arr;
            console.log(self.formData);
            this.$emit(
                "currentDiscussionData",
                // this.formData
                JSON.parse(JSON.stringify(self.formData))
            );
            this.formData = {
                title: "",
                content: "",
                serial: ""
            };
            this.userId = [];
        }
    }
};
</script>

{
    
}

<style lang="scss" scoped>
</style>
