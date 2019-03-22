<template>
    <div id="Contract" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName">
                <!-- <el-tab-pane label="合同管理" name="first" v-if="this.htsq"> -->
                <el-tab-pane label="合同管理" name="first">
                    <el-card class="box-card">
                        <ContractFilter @searchList="getSearchOptions"></ContractFilter>
                        <div class="toolbar">
                            <el-button type="primary" icon="el-icon-plus" @click="newForm">新建</el-button>
                        </div>
                        <ContractList ref="contractlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></ContractList>
                    </el-card>
                    <br>
                    <el-card class="box-card">
                        <ContractDetail :formId="formId" ref="ContractDetail" @refreshData="refreshData"></ContractDetail>
                    </el-card>
                </el-tab-pane>
                <!-- <el-tab-pane label="统计查询" name="second" v-if="this.tjcx"> -->
                <el-tab-pane label="统计查询" name="second">
                    <ContractStatistics :formId="formId" @formId="getFormId"></ContractStatistics>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="合同管理" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <ContractForm ref="contractform" @refreshData="refreshData" @info="getInfo" :formId="dialogFormId" :operationType="operationType"></ContractForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ContractForm from './ContractForm';
import ContractFilter from './ContractFilter';
import ContractList from './ContractList';
import ContractDetail from './ContractDetail';
import ContractStatistics from './ContractStatistics';
export default {
    name: 'Contract',
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            activeName: 'first',
            sstatus: '',
            tabsManage: [],
            htsq: false,
            tjcx: false
        };
    },
    mounted() {
        this.tabsManage = this.$store.getters.getMenusByType('contract');
        for (let item of this.tabsManage) {
            if (item.code == 'htsq') {
                this.htsq = true;
            }
            if (item.code == 'tjcx') {
                this.tjcx = true;
            }
        }
    },

    components: {
        ContractForm,
        ContractFilter,
        ContractList,
        ContractDetail,
        ContractStatistics
    },
    methods: {
        newForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.contractform) {
                this.$refs.contractform.clearForm();
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getInfo(info) {
            this.sstatus = info;
        },
        getFormId(id) {
            this.formId = id;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.contractlist.getList();
            this.$refs.ContractDetail.getForm();
            this.dialogFormVisible = false;
        },
        saveForm() {
            this.$refs.contractform.saveForm1();
            // if (this.sstatus == 'saveRuleSucceed') {
            //     this.dialogFormVisible = false;
            //     this.sstatus = '';
            // }
        },
        submitForm() {
            if (this.$refs.contractform.value != '') {
                this.$refs.contractform.submitCheck();
            } else {
                this.$message({
                    message: '请选择谈判小组成员',
                    type: 'warning'
                });
            }
            // if (this.sstatus == 'saveRuleSucceed') {
            //     this.dialogFormVisible = false;
            //     this.sstatus = '';
            // }
        },
        terminalForm() {
            this.$refs.contractform.terminalForm();
            this.dialogFormVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>