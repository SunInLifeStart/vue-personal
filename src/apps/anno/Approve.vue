<template>
    <div id="APPROVE">
        <AnnoDetail :formId="formId" ref="AnnoDetail"></AnnoDetail>
    </div>
</template>
<script>
import axios from 'axios';
import AnnoDetail from './AnnoDetail';
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
        AnnoDetail
    },
    watch: {},

    methods: {}
};
</script>
<style lang="scss" scope>
#APPROVE {
    height: 100%;
    #AnnoDetail {
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
