<template>
  <div id="APPROVE">
    <TenderingDetail ref="TenderingDetail"></TenderingDetail>
  </div>
</template>
<script>
import axios from "axios";
import TenderingDetail from "./TenderingDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.TenderingDetail.getFormDetails(this.formId);
    },
    components: {
        TenderingDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #TenderingDetail {
        height: 100%;
        width: 100%;
        /*display: flex;*/
        /*flex-direction: column;*/
        #actionList {
            padding-left: 20px;
        }
        .btnhide{
             display: block;
         }
        .formContent {
            flex: 1;
            height: 90%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 15px 30px;
        }
        
    }
}
</style>
