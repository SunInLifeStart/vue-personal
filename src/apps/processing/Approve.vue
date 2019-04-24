<template>
  <div id="APPROVE">
    <ProcessingDetail ref="ProcessingDetail"></ProcessingDetail>
  </div>
</template>
<script>
import ProcessingDetail from "./ProcessingDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.ProcessingDetail.getFormDetails(this.formId);
    },
    components: {
        ProcessingDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scoped>
#APPROVE {
    height: 100%;
    #ProcessingDetail {
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
