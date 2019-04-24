<template>
  <div id="APPROVE">
    <TrainDetail ref="TrainDetail"> </TrainDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import TrainDetail from "./TrainDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
         this.$refs.TrainDetail.getFormDetails(this.formId);
    },
    components: {
       TrainDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scoped>
#APPROVE {
    height: 100%;
    #TrainDetail {
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
