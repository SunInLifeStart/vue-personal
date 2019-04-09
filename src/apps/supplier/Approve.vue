<template>
  <div id="APPROVE">
    <SupplierDetail ref="SupplierDetail"></SupplierDetail>
  </div>
</template>
<script>
import axios from "axios";
import SupplierDetail from "./SupplierDetail";
export default {
    name: "APPROVE",
    data() {
        return {};
    },
    props: ["formId"],
    mounted() {
        this.$refs.SupplierDetail.getFormDetails(this.formId);
    },
    components: {
        SupplierDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #SupplierDetail {
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
