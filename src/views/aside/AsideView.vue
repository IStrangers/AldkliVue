<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, ref,watch } from 'vue'
const props = defineProps<{
    apiEntryList: Array<Record<string,any>>
}>()
const emits = defineEmits(['change'])
const isCollapse = ref<boolean>(false)
const apiEntry = ref<Record<string,any>>({})

const getMetaData = (index: string) => {
    const indexArray = index.split("-")
    const apiGroupMetaData = apiEntry.value.apiGroupMetaDataList[indexArray[0]]
    const apiMetaData = apiGroupMetaData.apiMetaDataList[indexArray[1]]
    return [apiGroupMetaData,apiMetaData]
}

const setCurrentApiMetaData = (index: string) => {
    const [apiGroupMetaData,apiMetaData] = getMetaData(index)
    emits("change",apiGroupMetaData,apiMetaData)
}

const changeApiEntry = (data: Array<Record<string,any>>) => {
    apiEntry.value = data[0]
    setCurrentApiMetaData("0-0")
}
watch(() => props.apiEntryList,(newVal) => {
    changeApiEntry(newVal)
})
onBeforeMount(() => {
    changeApiEntry(props.apiEntryList)
})
</script>

<template>
    <el-select v-model="apiEntry" size="large" style="width: 100%;" v-show="!isCollapse">
        <el-option
            v-for="(apiEntry,entryIndex) in apiEntryList"
            :key="apiEntry"
            :label="apiEntry.name"
            :value="apiEntry"
        ></el-option>
    </el-select>
    <el-menu default-active="0-0" :collapse="isCollapse" @select="setCurrentApiMetaData">
        <el-sub-menu v-for="(apiGroupMetaData,groupIndex) in apiEntry.apiGroupMetaDataList" :index="`${groupIndex}`">
            <template #title>
                <el-icon><Reading /></el-icon>
                <span>{{ apiGroupMetaData.name }}</span>
                <span style="display: flex;width: 100%;justify-content: right;">
                    <el-tag effect="plain" round>{{ apiGroupMetaData.apiMetaDataList.length }}</el-tag>
                </span>
            </template>
            <el-menu-item v-for="(apiMetaData,apiIndex) in apiGroupMetaData.apiMetaDataList" :index="`${groupIndex}-${apiIndex}`">
                <span style="margin-right: 10px;">{{ apiMetaData.methodType }}</span>
                <span>{{ apiMetaData.name }}</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
    height: calc(100% - 40px);
}
</style>