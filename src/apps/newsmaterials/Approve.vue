<template>
    <div id="APPROVE">
        <PublicityMaterialsDetail :formId="formId" ref="PublicityMaterialsDetail"></PublicityMaterialsDetail>
    </div>
</template>
<script>
import axios from 'axios';
import PublicityMaterialsDetail from './PublicityMaterialsDetail';
export default {
    name: 'APPROVE',
    data() {
        return {};
    },
    props: ['formId'],
    mounted() {
        // this.$refs.IncomingDetail.setTab();
    },
    components: {
        PublicityMaterialsDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #PublicityMaterialsDetail {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        #actionList {
            padding-left: 20px;
        }
        .btnhide {
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
