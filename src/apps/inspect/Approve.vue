<template>
  <div id="APPROVE">
      <InspectDetail :formId="formId" ref="InspectDetail"></InspectDetail>
    <!-- <InspectDetail ref="InspectDetail"> </InspectDetail> -->
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import InspectDetail from "./InspectDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.InspectDetail.getFormDetails(this.formId);
    },
    components: {
       InspectDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #InspectDetail {
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
