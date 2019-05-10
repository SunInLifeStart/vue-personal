<template>
  <div id="APPROVE">
    <ProgrammeDetail ref="ProgrammeDetail"></ProgrammeDetail>
  </div>
</template>
<script>
import axios from "axios";
import ProgrammeDetail from "./ProgrammeDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.ProgrammeDetail.getFormDetails(this.formId);
    },
    components: {
        ProgrammeDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #ProgrammeDetail {
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
