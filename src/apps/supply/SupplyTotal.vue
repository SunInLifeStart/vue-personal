<template>
    <div id="SupplyTotal">
        <el-card class="box-card">
            <SupplyTotalFilter @searchList="getSearchOptions"></SupplyTotalFilter>
            <SupplyTotalList :searchOptions="searchOptions"></SupplyTotalList>
        </el-card>
    </div>
</template>
<script>
import SupplyTotalFilter from './SupplyTotalFilter';
import SupplyTotalList from './SupplyTotalList';
export default {
    name: 'SupplyTotal',
    mounted() {},
    data() {
        return {
            searchOptions: []
        };
    },
    components: {
        SupplyTotalFilter,
        SupplyTotalList
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>