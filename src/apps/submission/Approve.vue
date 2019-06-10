<template>
  <div id="APPROVE">
    <SubmissionDetail ref="SubmissionDetail"> </SubmissionDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import SubmissionDetail from "./SubmissionDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.SubmissionDetail.getFormDetails(this.formId);
    },
    components: {
       SubmissionDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 90%;
    #SubmissionDetail {
        height: 100%;
        width: 100%;
      //  display: flex;
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
