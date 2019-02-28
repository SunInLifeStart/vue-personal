<template>
  <div id="APPROVE">
    <IncomingDetail :formId="formId" ref="IncomingDetail"></IncomingDetail>
  </div>
</template>
<script>
import axios from "axios";
import IncomingDetail from "./IncomingDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        // this.$refs.IncomingDetail.setTab();
    },
    components: {
        IncomingDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #IncomingDetail {
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
