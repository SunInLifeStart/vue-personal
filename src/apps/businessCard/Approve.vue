<template>
  <div id="APPROVE">
    <BusinessCardDetail ref="BusinessCardDetail"> </BusinessCardDetail>
     <!-- :formId="formId" -->
  </div>
</template>
<script>
import axios from "axios";
import BusinessCardDetail from "./BusinessCardDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        console.log('APPROVE-----')
         this.$refs.BusinessCardDetail.getFormDetails(this.formId);
    },
    components: {
       BusinessCardDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scoped>
#APPROVE {
    height: 100%;
    #BusinessCardDetail {
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
