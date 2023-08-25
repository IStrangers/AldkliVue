<script setup lang="ts">
import axios from 'axios';
import { ref,reactive,onBeforeMount } from 'vue'
const apiEntryList = ref<Array<Record<string,any>>>([])
const currentApiEntry = ref()
const requestMetaData = reactive({
    requestPath: "",
    method: "",
})

const setApiEntryList = (data: Array<Record<string,any>>) => {
    apiEntryList.value = data
    currentApiEntry.value = apiEntryList.value[0]
}

onBeforeMount(() => {
    // axios.get("/aldkli/metaData/getApiEntryList").then((res) => {
    //     setApiEntryList(res.data)
    // })
    setApiEntryList([{
        "name": "全部",
        "apiGroupMetaDataList": [{"name":"测试分组","pathList":["test"],"apiMetaDataList":[{"name":"获取测试列表","methodType":"ALL","pathList":["getTestList","TestList"]},{"name":"getMapping","methodType":"GET","pathList":["getMapping"]}]}]
    }])
})
</script>

<template>
    <Row>
        <Col>
            <Select v-model="currentApiEntry">
                <Option v-for="(apiEntry,entryIndex) in apiEntryList" :value="apiEntry">{{ apiEntry.name }}</Option>
            </Select>
            <Menu active-name="0-0" :open-names="['0']">
                <Submenu v-for="(apiGroupMetaData,groupIndex) in currentApiEntry.apiGroupMetaDataList" :name="`${groupIndex}`">
                    <template #title>
                        <Icon type="ios-list" />
                        {{ apiGroupMetaData.name }}
                    </template>
                    <MenuItem v-for="(apiMetaData,apiIndex) in apiGroupMetaData.apiMetaDataList" :name="`${groupIndex}-${apiIndex}`">
                        <Icon type="ios-code-working" />
                        {{ apiMetaData.name }}
                    </MenuItem>
                </Submenu>
            </Menu>
        </Col>
        <Col>
            <Input v-model="requestMetaData.requestPath">
                <template #prepend>
                    <Select v-model="requestMetaData.method" style="width: 80px">
                        
                    </Select>
                </template>
                <template #append>
                    <Button icon="ios-search"></Button>
                </template>
            </Input>
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
