<template>
  <div id="APPROVE">
    <DiscussionDetail ref="DiscussionDetail"></DiscussionDetail>
  </div>
</template>
<script>
import axios from "axios";
import DiscussionDetail from "./DiscussionDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.DiscussionDetail.getFormDetails(this.formId);
    },
    components: {
        DiscussionDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #DiscussionDetail {
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
