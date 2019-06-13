<template>
    <div id="APPROVE">
        <LoanDetail ref="LoanDetail"> </LoanDetail>
        <!-- :formId="formId" -->
    </div>
</template>
<script>
import axios from 'axios';
import LoanDetail from './LoanDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        this.$refs.LoanDetail.getFormDetails(this.formId);
    },
    components: {
        LoanDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #LoanDetail {
        height: 90%;
        width: 100%;
       // display: flex;
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
