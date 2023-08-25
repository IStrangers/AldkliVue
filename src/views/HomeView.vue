<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue'
const apiEntryList = ref([])
const currentApiEntry = ref()
axios.get("/aldkli/metaData/getApiEntryList").then((res) => {
    apiEntryList.value = res.data
    currentApiEntry.value = apiEntryList.value[0]
})
</script>

<template>
    <Row>
        <Col>
            <Menu active-name="0-0" :open-names="['0']">
                <Submenu v-for="(apiGroupMetaData,groupIndex) in currentApiEntry.apiGroupMetaDataList" :name="`${groupIndex}`">
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
