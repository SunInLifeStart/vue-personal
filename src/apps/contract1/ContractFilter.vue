<template>
    <div id="ContractFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="合同名称：">
                        <el-input v-model="formInline.contractName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同对方：">
                        <el-input v-model="formInline.partyB"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据状态：">
                        <el-select v-model="formInline.status" style="width:100%" filterable placeholder="全部">
                            <el-option v-for="item in statusAll" :key="item.id" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" class="searchBtn">
                    <el-form-item class="positionBtn">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="合同状态：">
                <el-input v-model="formInline.contractStatus"></el-input>
            </el-form-item> -->
        </el-form>
    </div>
</template>


<script>
/* eslint-disable */
import { CONFIG } from '../data.js';
import cookies from 'js-cookie';
export default {
    name: 'ContractFilter',
    data() {
        return {
            formInline: {
                contractName: '',
                partyB: '',
                contractStatus: '',
                status: ''
            },
            searchOptions: [],
            statusAll: CONFIG['status']
        };
    },
    methods: {
        onReset() {
            this.formInline.contractName = '';
            this.formInline.partyB = '';
            this.formInline.contractStatus = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.contractName.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractName',
                    filter: 'LIKE',
                    value: this.formInline.contractName
                });
            }
            if (this.formInline.partyB.trim() !== '') {
                this.searchOptions.push({
                    field: 'partyB',
                    filter: 'LIKE',
                    value: this.formInline.partyB
                });
            }
            if (this.formInline.contractStatus.trim() !== '') {
                this.searchOptions.push({
                    field: 'contractStatus',
                    filter: 'LIKE',
                    value: this.formInline.contractStatus
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
    #ContractFilter {
        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
            width: 100%;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
    }
</style>
<style lang="scss" scoped>
    #Contract {
        .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }
    }
</style>
<style scoped>
    #ContractFilter >>> .el-form-item__content{
        width: calc(100% - 90px);
    }
</style>