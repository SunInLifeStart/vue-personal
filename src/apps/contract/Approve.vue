<template>
    <div id="APPROVE">
        <ContractDetail ref="ContractDetail"> </ContractDetail>
        <!-- :formId="formId" -->
    </div>
</template>

<script>
import axios from 'axios';
import ContractDetail from './ContractDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        this.$refs.ContractDetail.getFormDetails(this.formId);
    },
    components: {
        ContractDetail
    },
    watch: {},

    methods: {}
};
</script>

<style lang="scss" scope>
#APPROVE {
    height: 90%;
    #ContractDetail {
        height: 85%;
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
