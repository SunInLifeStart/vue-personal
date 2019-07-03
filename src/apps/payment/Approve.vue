<template>
    <div id="APPROVE">
        <PaymentDetail ref="PaymentDetail"> </PaymentDetail>
        <!-- :formId="formId" -->
    </div>
</template>
<script>
import axios from 'axios';
import PaymentDetail from './PaymentDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        this.$refs.PaymentDetail.getFormDetails(this.formId);
    },
    components: {
        PaymentDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #PaymentDetail {
        height: 100%;
        width: 100%;
        //  display: flex;
        flex-direction: column;
        #actionList {
            padding-left: 20px;
        }
        .btnhide {
            display: block;
        }
        .formContent {
            flex: 1;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 15px 30px;
        }
    }
}
</style>
