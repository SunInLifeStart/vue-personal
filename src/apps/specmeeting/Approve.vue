<template>
  <div id="APPROVE">
    <SpecmeetingDetail :formId="formId" ref="SpecmeetingDetail"></SpecmeetingDetail>
  </div>
</template>
<script>
import axios from "axios";
import SpecmeetingDetail from "./SpecmeetingDetail";
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
        SpecmeetingDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #SpecMeetingDetail{
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
