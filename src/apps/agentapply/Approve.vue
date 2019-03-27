<template>
  <div id="APPROVE">
    <AgentApplyDetail ref="AgentApplyDetail"></AgentApplyDetail>
  </div>
</template>
<script>
import axios from "axios";
import AgentApplyDetail from "./AgentApplyDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.AgentApplyDetail.getFormDetails(this.formId);
    },
    components: {
        AgentApplyDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #AgentApplyDetail {
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
