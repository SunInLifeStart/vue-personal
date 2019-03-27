<template>
  <div id="APPROVE">
    <RecruitmentCommitteeDetail ref="RecruitmentCommitteeDetail"></RecruitmentCommitteeDetail>
  </div>
</template>
<script>
import axios from "axios";
import RecruitmentCommitteeDetail from "./RecruitmentCommitteeDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.RecruitmentCommitteeDetail.getFormDetails(this.formId);
    },
    components: {
        RecruitmentCommitteeDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #RecruitmentCommitteeDetail {
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
