<template>
  <div id="APPROVE">
    <MotionDetail :formId="formId" ref="MotionDetail"></MotionDetail>
  </div>
</template>
<script>
import axios from "axios";
import MotionDetail from "./MotionDetail";
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
        MotionDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #MotionDetail {
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
         .tabmsg {
            display: block;
            margin: 15px 0px;
        }
        
    }
}
</style>
