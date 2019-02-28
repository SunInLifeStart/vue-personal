<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-card class="box-card">
                <StatisticsFilter @searchList="getSearchOptions" @dtypes="getdtypes"></StatisticsFilter>
                <el-button @click="excel()">导出</el-button>
                <StatisticsList @searchList="getSearchOptions" ref="Statisticslist"  @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions" :dtypes="dtypes"></StatisticsList>
            </el-card>
            <br>
            <el-card class="box-card">
                <TravelDetail v-if="this.dtype == '出差申请单'? true:false" :formId="formId"></TravelDetail>
                <LoanDetail v-if="this.dtype == '借款申请单'? true:false" :formId="formId"></LoanDetail>
                <PaymentDetail v-if="this.dtype == '付款申请单(对公)'? true:false" :formId="formId"></PaymentDetail>
                <ExpenseDetail v-if="this.dtype == '报销申请单(对私)'? true:false" :formId="formId"></ExpenseDetail>
            </el-card>
        </el-tabs>

    </div>
</template>
<script>
import axios from 'axios';
import StatisticsList from './StatisticsList';
import StatisticsFilter from './StatisticsFilter';
import TravelDetail from '../travel/TravelDetail';
import LoanDetail from '../loan/LoanDetail';
import PaymentDetail from '../payment/PaymentDetail';
import ExpenseDetail from '../expense/ExpenseDetail';
export default {
    name: 'Statistics',
    data() {
        return {
            activeName: 'first',
            dialogFormVisible: false,
            searchOptions: [],
            dtypes: '',
            formId: '',
            dtype:'',
            dialogFormId: '',
            operationType: 'create'
        };
    },
    methods: {
        handleClick() {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getdtypes(dtypes) {
            this.dtypes = dtypes;
        },
        getFormId(id,dtype) {
            this.formId = id;
            this.dtype = dtype;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        saveForm() {
            this.$refs.statisticsform.saveForm();
            this.dialogFormVisible = false;
        },
        submitForm() {
            this.$refs.statisticsform.submitCheck();
            this.dialogFormVisible = false;
        },
        cancelForm() {
            this.$refs.statisticsform.cancelForm();
            this.dialogFormVisible = false;
        },
        excel() {
            this.$refs.Statisticslist.excel();
        }
    },
    components: {
        StatisticsList,
        StatisticsFilter,
        TravelDetail,
        LoanDetail,
        PaymentDetail,
        ExpenseDetail
    }
};
</script>
<style lang="scss" scoped>
</style>


