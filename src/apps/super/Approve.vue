<template>
  <div id="APPROVE">
    <SuperDetail :formId="formId" ref="SuperDetail"></SuperDetail>
  </div>
</template>
<script>
import axios from "axios";
import SuperDetail from "./SuperDetail";
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
        SuperDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #SuperDetail {
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
