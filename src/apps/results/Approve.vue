<template>
  <div id="APPROVE">
    <ResultsDetail ref="ResultsDetail"></ResultsDetail>
  </div>
</template>
<script>
import axios from "axios";
import ResultsDetail from "./ResultsDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.ResultsDetail.getFormDetails(this.formId);
    },
    components: {
        ResultsDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #ResultsDetail {
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
