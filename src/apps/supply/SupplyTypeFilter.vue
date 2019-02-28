<template>
    <div id="SupplyTypeFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="用品类型 ：">
                <el-select v-model="formInline.typeinput" placeholder="请选择">
                    <el-option v-for="item in oprationType" :key="item.id" :label="item.type" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量：">
                <el-input placeholder="数量" style="width:100px" v-model="formInline.numbers"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input placeholder="名称" style="width:100px" v-model="formInline.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SupplyTypeFilter',
    data() {
        return {
            searchOptions: [],
            formInline: {
                typeinput: '',
                numbers: '',
                name: ''
            },
            oprationType: []
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        onReset(){
         this.formInline.typeinput = '';
         this.formInline.numbers = '';
         this.formInline.name = '';
         this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.typeinput !== '') {
                this.searchOptions.push({
                    field: 'classify',
                    filter: 'EQUAL',
                    value: this.formInline.typeinput
                });
            }
            if (this.formInline.numbers.trim() !== '') {
                this.searchOptions.push({
                    field: 'quantity',
                    filter: 'EQUAL',
                    value: this.formInline.numbers
                });
            }
            if (this.formInline.name.trim() !== '') {
                this.searchOptions.push({
                    field: 'name',
                    filter: 'LIKE',
                    value: this.formInline.name
                });
            }
            console.log(this.searchOptions);
            this.$emit('searchList', this.searchOptions);
        },
        getList() {
            const self = this;
            const params = {};
            axios
                .post(
                    '/api/v1/supply_forms/type/query',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.oprationType = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>