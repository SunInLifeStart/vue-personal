<template>
    <div id="SupplyStatics">
        <el-card class="box-card">
            <SupplyStaticsFilter @searchList="getSearchOptions"></SupplyStaticsFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="openForm()">新建</el-button>
            </div>
            <SupplyStaticsList ref="supplystaticslist" @formId="getFormId" :searchOptions="searchOptions"></SupplyStaticsList>
        </el-card>
        <br>
        <el-card class="box-card">
            <SupplyStaticsDetail :formId="formId"></SupplyStaticsDetail>
        </el-card>
        <!--@refreshData="refreshData"-->
        <el-dialog title="用品种类" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal="false">
            <SupplyStaticsForm ref="supplystaticsform" @saveStatus="saveStatus" @refreshData="refreshData"></SupplyStaticsForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存到购物车</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import SupplyStaticsFilter from './SupplyStaticsFilter';
import SupplyStaticsForm from './SupplyStaticsForm';
import SupplyStaticsList from './SupplyStaticsList';
import SupplyStaticsDetail from './SupplyStaticsDetail';
export default {
    name: 'SupplyStatics',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            singal: 1
        };
    },
    components: {
        SupplyStaticsFilter,
        SupplyStaticsForm,
        SupplyStaticsList,
        SupplyStaticsDetail
    },
    methods: {
        handleClick(tab, event) {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        saveStatus(type) {
            this.dialogFormVisible = type;
        },
        refreshData() {
            this.$refs.supplystaticslist.getList();
            //this.$refs.supplystaticsform.getList();
        },
        submitForm() {
            this.$refs.supplystaticsform.messageCheck('submit');
        },
        openForm() {
            let d = new Date();
            console.log(d.getDate());
            if (parseInt(d.getDate()) <= 10) {
                this.dialogFormVisible = true;
                if (this.singal != 1) {
                    this.$refs.supplystaticsform.getFList();
                }
                this.singal++;
            } else {
                this.$message({
                    message: '只有每月的10号前才可以提单',
                    type: 'error'
                });
            }
        },
        saveForm() {
            this.$refs.supplystaticsform.messageCheck('save');
        }
    }
};
</script>
<style lang="scss" scoped>
</style>