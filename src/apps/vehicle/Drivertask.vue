<template>
    <el-card>
        <DrivertaskFilter @searchList="getSearchOptions"></DrivertaskFilter>
        <DrivertaskList :searchOptions="searchOptions" :searchCreated="searchCreated"></DrivertaskList>
    </el-card>
</template>
<script>
import DrivertaskFilter from './DrivertaskFilter';
import DrivertaskList from './DrivertaskList';
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
        DrivertaskList,
        DrivertaskFilter
    },
    methods: {
        getSearchOptions(searchOptions, searchCreated) {
            this.searchOptions = searchOptions;
            this.searchCreated = searchCreated;
        }
    }
};
</script>

