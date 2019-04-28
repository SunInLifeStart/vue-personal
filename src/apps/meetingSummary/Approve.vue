<template>
  <div id="APPROVE">
    <MeetingSummaryDetail ref="MeetingSummaryDetail"> </MeetingSummaryDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import MeetingSummaryDetail from "./meetingSummaryDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.MeetingSummaryDetail.getFormDetails(this.formId);
    },
    components: {
       MeetingSummaryDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scoped>
#APPROVE {
    height: 100%;
    #MeetingSummaryDetail {
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
