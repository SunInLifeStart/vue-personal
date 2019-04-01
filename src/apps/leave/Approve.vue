<template>
  <div id="APPROVE">
    <LeaveDetail ref="LeaveDetail"> </LeaveDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import LeaveDetail from "./LeaveDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.LeaveDetail.getFormDetails(this.formId);
    },
    components: {
       LeaveDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #LeaveDetail {
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
