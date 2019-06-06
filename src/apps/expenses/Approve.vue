<template>
    <div id="APPROVE">
        <ExpensesDetail ref="ExpensesDetail"> </ExpensesDetail>
        <!-- :formId="formId" -->
    </div>
</template>
<script>
import axios from 'axios';
import ExpensesDetail from './ExpensesDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        this.$refs.ExpensesDetail.getFormDetails(this.formId);
    },
    components: {
        ExpensesDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #ExpensesDetail {
        height: 100%;
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
