<template>
    <div>
        <div id="PartDiscussionForm">
            <el-form :model="formData" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="议题">
                            <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="内容">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" :autosize="{ minRows: 2, maxRows: 20}" v-model="formData.content">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列席">
                            <el-select style="width:100%;" v-model="formData.delegates" value-key="id" multiple filterable allow-create default-first-option placeholder="请选择列席人员">
                                <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item">
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
import axios from 'axios';
export default {
    name: 'PartDiscussionForm',
    data() {
        return {
            formData: {
                title: '',
                content: '',
                serial: '',
                delegates: []
            },
            checkedUsers: [],
            userList: []
        };
    },
    props: ['discussionData'],
    watch: {
        discussionData: function() {
            this.formData = this.discussionData;
        }
    },

    mounted() {
        this.getUserList();
    },

    methods: {
        savaCurrentDiscussion() {
            this.$emit(
                'currentDiscussionData',
                JSON.parse(JSON.stringify(this.formData))
            );
        },
        clearForm(index) {
            this.formData = {
                title: '',
                content: '',
                serial: '议题' + index,
                delegates: []
            };
            this.checkedUsers = [];
        },
        getUserList() {
            axios.get('/api/v1/users', '').then(res => {
                for (let item of res.data) {
                    this.userList.push({ id: item.id, name: item.name });
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
