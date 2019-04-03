<template>
  <div id="APPROVE">
    <TravelDetail ref="TravelDetail"> </TravelDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import TravelDetail from "./TravelDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.TravelDetail.getFormDetails(this.formId);
    },
    components: {
       TravelDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #TravelDetail {
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
