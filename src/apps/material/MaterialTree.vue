<template>
    <div id="MaterialTree">
        <!--:props="defaultProps"-->
        <el-tree :data="data" default-expand-all @node-click="nodeClick" style="font-size: 3px;margin-top: 20px;">
        </el-tree>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'MaterialTree',
    data() {
        return {
            data: [],
            dataOrgan: [],
            searchOgans: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                id: 'id'
            }
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        nodeClick(data) {
            this.searchOgans = [];
            this.searchOgans.push({
                field: 'reportingUnit',
                filter: 'LIKE',
                value: data.label
            });
            this.$emit('searchOrgans', this.searchOgans);
        },
        getList() {
            const self = this;
            this.dataOrgan = [];
            axios
                .get('/api/v1/outgoing_forms/listOrg')
                .then(res => {
                    this.dataOrgan.push({
                        id: 0,
                        label: '中关村发展集团',
                        children: []
                    });
                    for (let data of res.data[0].children) {
                        if (data.label == '各下级单位') {
                            for (let data1 of data.children) {
                                this.dataOrgan.push(data1);
                            }
                        }
                    }
                    this.data = this.dataOrgan;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>