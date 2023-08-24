<script setup lang="ts">
import { reactive } from 'vue'
const apiGroupMetaDataList = [{"apiMetaDataList":[{"methodType":"ALL","name":"获取测试列表","pathList":["getTestList","TestList"]},{"methodType":"GET","name":"getMapping","pathList":["getMapping"]}],"name":"测试分组","pathList":["test"]}]
</script>

<template>
    <Row>
        <Col>
            <Menu active-name="0-0" :open-names="['0']">
                <Submenu v-for="(apiGroupMetaData,groupIndex) in apiGroupMetaDataList" :name="`${groupIndex}`">
                    <template #title>
                        <Icon type="ios-analytics" />
                        {{ apiGroupMetaData.name }}
                    </template>
                    <MenuItem v-for="(apiMetaData,apiIndex) in apiGroupMetaData.apiMetaDataList" :name="`${groupIndex}-${apiIndex}`">
                        {{ apiMetaData.name }}
                    </MenuItem>
                </Submenu>
            </Menu>
        </Col>
        <Col>

        </Col>
    </Row>
</template>

<style scoped lang="scss">
.ivu-row {
    height: 100%;
    .ivu-menu {
        height: 100%;
    }
}
</style>
