<template>
    <el-card>
        <VehicleConditionFilter @searchList="getSearchOptions"></VehicleConditionFilter>
        <VehicleConditionList :searchOptions="searchOptions" :searchCreated="searchCreated"></VehicleConditionList>
    </el-card>
</template>
<script>
import VehicleConditionFilter from './VehicleConditionFilter';
import VehicleConditionList from './VehicleConditionList';
export default {
    name: 'Vehicle',
    mounted() {},
    data() {
        return {
            searchOptions: '',
            searchCreated: []
        };
    },
    components: {
        VehicleConditionList,
        VehicleConditionFilter
    },
    methods: {
        getSearchOptions(searchOptions, searchCreated) {
            this.searchOptions = searchOptions;
            this.searchCreated = searchCreated;
        }
    }
};
</script>

