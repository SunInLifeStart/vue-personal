<template>
    <div id="PublicityMaterialsTree">
        <el-tree :data="data" :props="defaultProps" default-expand-all @node-click="nodeClick" style="font-size: 3px;margin-top: 20px;">
        </el-tree>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'PublicityMaterialsTree',
    data() {
        return {
            data: [
                {
                    id: '11',
                    name: '组织机构树',
                    children: []
                }
            ],
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
                field: 'organId',
                filter: 'EQUAL',
                value: String(data.id)
            });
            this.$emit('searchOrgans', this.searchOgans);
        },
        getList() {
            const self = this;
            axios
                .get('/api/v1/organs')
                .then(res => {
                    self.data[0].children = res.data;
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