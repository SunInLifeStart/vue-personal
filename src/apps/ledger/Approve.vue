<template>
  <div id="APPROVE">
    <LedgerDetail ref="LedgerDetail"> </LedgerDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import LedgerDetail from "./LedgerDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        console.log('APPROVE-----')
         this.$refs.LedgerDetail.getFormDetails(this.formId);
    },
    components: {
       LedgerDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #LedgerDetail {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        #actionList {
            padding-left: 20px;
        }
        .btnhide{
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
