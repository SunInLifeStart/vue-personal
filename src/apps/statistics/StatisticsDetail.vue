<template>
    <div>
        <!-- <TravelDetail></TravelDetail>
        <LoanDetail></LoanDetail>
        <PaymentDetail></PaymentDetail>
        <ExpenseDetail></ExpenseDetail> -->
    </div>
</template>
<script>
import TravelDetail from '../travel/TravelDetail';
import LoanDetail from '../loan/LoanDetail';
import PaymentDetail from '../payment/PaymentDetail';
import ExpenseDetail from '../expense/ExpenseDetail';
export default {
    name: 'StatisticsDetail',
    data() {
        return {};
    },
    months: {},
    components: {
        TravelDetail,
        LoanDetail,
        PaymentDetail,
        ExpenseDetail
    }
};
</script>

