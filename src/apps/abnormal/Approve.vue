<template>
  <div id="APPROVE">
    <AbnormalDetail ref="AbnormalDetail"></AbnormalDetail>
  </div>
</template>
<script>
import axios from "axios";
import AbnormalDetail from "./AbnormalDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.AbnormalDetail.getFormDetails(this.formId);
    },
    components: {
        AbnormalDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #AbnormalDetail {
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
