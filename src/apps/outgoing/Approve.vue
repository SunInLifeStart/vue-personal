<template>
  <div id="APPROVE">
    <OutgoingDetail ref="OutgoingDetail"> </OutgoingDetail>
     <!-- :formId="formId" -->
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
         this.$refs.OutgoingDetail.getFormDetails(this.formId);
    },
    components: {
       OutgoingDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scoped>
#APPROVE {
    height: 100%;
    #OutgoingDetail {
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
