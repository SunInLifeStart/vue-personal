<template>
  <div id="APPROVE">
    <leaveDetail :formId="formId" ref="leaveDetail"></leaveDetail>
  </div>
</template>
<script>
import axios from "axios";
import leaveDetail from "./LeaveDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        // this.$refs.leaveDetail.setTab();
    },
    components: {
        leaveDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #leaveDetail {
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
