<template>
  <div id="APPROVE">
    <OutgoingDetail :formId="formId" ref="OutgoingDetail"></OutgoingDetail>
  </div>
</template>
<script>
import axios from "axios";
import OutgoingDetail from "./OutgoingDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        // this.$refs.OutgoingDetail.setTab();
    },
    components: {
        OutgoingDetail
    },
    watch: {},
    methods: {}
};
</script>
<style lang="scss" scope>

#APPROVE {
    height: 100%;
    #OutgoingDetail {
        height: 100%;
         display: flex;
        width: 100%;
         flex-direction: column;
        #actionList {
            height: 40px;
            padding-left: 20px;
            margin-bottom: 0px;
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
        .crumbList {
            margin: 15px 0px;
        }
        .tabmsg {
            display: block;
            margin: 15px 0px;
        }
    }
}
</style>
