<script setup lang="ts">
import axios from 'axios';
import { ref,reactive,onBeforeMount } from 'vue'
const apiEntryList = ref<Array<Record<string,any>>>([])
const currentApiEntry = ref<Record<string,any>>({})
const currentApiMetaData = ref<Record<string,any>>({})

const getApiMetaData = (index: string) => {
    const indexArray = index.split("-")
    return currentApiEntry.value.apiGroupMetaDataList[indexArray[0]].apiMetaDataList[indexArray[1]]
}

const setApiEntryList = (data: Array<Record<string,any>>) => {
    apiEntryList.value = data
    currentApiEntry.value = apiEntryList.value[0]
    setCurrentApiMetaData("0-0")
}

const setCurrentApiMetaData = (index: string) => {
    currentApiMetaData.value = getApiMetaData(index)
    currentApiMetaData.value.selectedMethod = currentApiMetaData.value.methodType
}

onBeforeMount(() => {
    // axios.get("/aldkli/metaData/getApiEntryList").then((res) => {
    //     setApiEntryList(res.data)
    // })
    setApiEntryList([{
        "name": "全部",
        "apiGroupMetaDataList": [{"name":"测试分组","pathList":["test"],"apiMetaDataList":[{"name":"获取测试列表","methodType":"ALL","pathList":["getTestList","TestList"],"apiParamList":[{"name":"param1","required":false,"description":"参数1","type":"search","dataType":"String"},{"name":"param2","required":true,"description":"","type":"urlPath","dataType":"int"}]},{"name":"getMapping","methodType":"GET","pathList":["getMapping"],"apiParamList":[]}]}]
    }])
})
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-select v-model="currentApiEntry" size="large">
                        <el-option
                            v-for="(apiEntry,entryIndex) in apiEntryList"
                            :key="apiEntry"
                            :label="apiEntry.name"
                            :value="apiEntry"
                        ></el-option>
                    </el-select>
                    <el-menu default-active="0-0" @select="setCurrentApiMetaData">
                        <el-sub-menu v-for="(apiGroupMetaData,groupIndex) in currentApiEntry.apiGroupMetaDataList" :index="`${groupIndex}`">
                            <template #title>
                                <el-icon><Reading /></el-icon>
                                {{ apiGroupMetaData.name }}
                            </template>
                            <el-menu-item v-for="(apiMetaData,apiIndex) in apiGroupMetaData.apiMetaDataList" :index="`${groupIndex}-${apiIndex}`">
                                {{ apiMetaData.methodType }} {{ apiMetaData.name }}
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-input
                        :value="currentApiMetaData.pathList[0]"
                        class="input-with-select"
                        size="large"
                    >
                        <template #prepend>
                            <el-select v-model="currentApiMetaData.selectedMethod" style="width: 115px" size="large">
                                <template v-if="currentApiMetaData.methodType === 'ALL'">
                                    <el-option v-for="method in ['GET','POST','PUT','DELETE','PATCH']" :label="method" :value="method" ></el-option>
                                </template>
                                <template  v-else>
                                    <el-option :label="currentApiMetaData.methodType" :value="currentApiMetaData.methodType" ></el-option>
                                </template>
                            </el-select>
                        </template>
                        <template #append>
                            <el-button size="large">发送</el-button>
                        </template>
                    </el-input>
                    <el-table :data="currentApiMetaData.apiParamList" border style="width: 100%;margin-top: 5px;">
                        <el-table-column prop="name" label="参数名称"></el-table-column>
                        <el-table-column prop="required" label="是否必填"></el-table-column>
                        <el-table-column prop="description" label="参数说明"></el-table-column>
                        <el-table-column prop="type" label="参数类型"></el-table-column>
                        <el-table-column prop="dataType" label="数据类型"></el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="scss">
.common-layout {
    height: 100%;
    .el-container {
        height: 100%;
        .el-aside {
            .el-menu {
                height: calc(100% - 40px);
            }
        }
        .el-main {
            padding: 0 10px;
        }
    }
}

</style>
