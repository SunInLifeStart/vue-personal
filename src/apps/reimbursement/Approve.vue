<template>
    <div id="APPROVE">
        <ReimbursementDetail ref="ReimbursementDetail"> </ReimbursementDetail>
        <!-- :formId="formId" -->
    </div>
</template>
<script>
import axios from 'axios';
import ReimbursementDetail from './ReimbursementDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        this.$refs.ReimbursementDetail.getFormDetails(this.formId);
    },
    components: {
        ReimbursementDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #ReimbursementDetail {
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
