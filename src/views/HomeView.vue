<script setup lang="ts">
import axios from 'axios';
import { ref,reactive,onBeforeMount,toRefs } from 'vue'
const state = reactive({
    isCollapse: false
})
const apiEntryList = ref<Array<Record<string,any>>>([])
const currentApiEntry = ref<Record<string,any>>({})
const currentApiGroupMetaData = ref<Record<string,any>>({})
const currentApiMetaData = ref<Record<string,any>>({})

const getMetaData = (index: string) => {
    const indexArray = index.split("-")
    const apiGroupMetaData = currentApiEntry.value.apiGroupMetaDataList[indexArray[0]]
    const apiMetaData = apiGroupMetaData.apiMetaDataList[indexArray[1]]
    return [apiGroupMetaData,apiMetaData]
}

const setApiEntryList = (data: Array<Record<string,any>>) => {
    apiEntryList.value = data
    currentApiEntry.value = apiEntryList.value[0]
    setCurrentApiMetaData("0-0")
}

const setCurrentApiMetaData = (index: string) => {
    const [apiGroupMetaData,apiMetaData] = getMetaData(index)
    currentApiGroupMetaData.value = apiGroupMetaData
    currentApiMetaData.value = apiMetaData
    currentApiMetaData.value.selectedMethod = currentApiMetaData.value.methodType
}

onBeforeMount(() => {
    axios.get("/aldkli/metaData/getApiEntryList").then((res) => {
        setApiEntryList(res.data)
    })
    // setApiEntryList([{
    //     "name": "全部",
    //     "apiGroupMetaDataList": [{"name":"测试分组","pathList":["test"],"apiMetaDataList":[{"name":"获取测试列表","methodType":"ALL","pathList":["getTestList","TestList"],"apiParamMetaDataList":[{"name":"param1","required":false,"description":"参数1","type":"search","dataType":"String","example":"test"},{"name":"param2","required":true,"description":"","type":"urlPath","dataType":"int","example":"1"}],"apiReturnTypeMetaData":{"name":"Result","description":"测试列表","dataType":"List<Map<String,Object>>","children":[{"name":"testName","description":"测试名称","dataType":"String","children":[]},{"name":"testCode","description":"测试编码","dataType":"String","children":[]},{"name":"testMap","description":"测试映射","dataType":"Map<String,Object>","children":[{"name":"mappingName","description":"映射名称","dataType":"String","children":[]},{"name":"mappingCode","description":"映射编码","dataType":"String","children":[]}]}]}},{"name":"获取用户","methodType":"GET","pathList":["getUser"],"apiParamMetaDataList":[],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"User","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}},{"name":"获取用户列表","methodType":"GET","pathList":["getUserList"],"apiParamMetaDataList":[{"name":"data","required":false,"description":"","type":"","dataType":"Map<String,Long>","example":""}],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"List<User>","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}}]}]
    // }])
})

</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                
            </el-header>
            <el-container>
                <el-aside width="300px">
                    <el-select v-model="currentApiEntry" size="large" style="width: 100%;">
                        <el-option
                            v-for="(apiEntry,entryIndex) in apiEntryList"
                            :key="apiEntry"
                            :label="apiEntry.name"
                            :value="apiEntry"
                        ></el-option>
                    </el-select>
                    <el-menu default-active="0-0" :collapse="state.isCollapse" @select="setCurrentApiMetaData">
                        <el-sub-menu v-for="(apiGroupMetaData,groupIndex) in currentApiEntry.apiGroupMetaDataList" :index="`${groupIndex}`">
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
                </el-aside>
                <el-main>
                    <el-tabs tab-position="left" style="height: 100%">
                        <el-tab-pane>
                            <template #label>
                                <el-icon><Document /></el-icon>
                                <span style="margin-left: 5px;">文档</span>
                            </template>
                            <el-input
                                :value="currentApiGroupMetaData.pathList[0] + '/' + currentApiMetaData.pathList[0]"
                                class="input-with-select"
                                size="large"
                                readonly="readonly"
                            >
                                <template #prepend>
                                    <el-select v-model="currentApiMetaData.selectedMethod" style="width: 115px" size="large" disabled="disabled">
                                        <template v-if="currentApiMetaData.methodType === 'ALL'">
                                            <el-option v-for="method in ['GET','POST','PUT','DELETE','PATCH']" :label="method" :value="method" ></el-option>
                                        </template>
                                        <template  v-else>
                                            <el-option :label="currentApiMetaData.methodType" :value="currentApiMetaData.methodType" ></el-option>
                                        </template>
                                    </el-select>
                                </template>
                            </el-input>
                            <el-table :data="currentApiMetaData.apiParamMetaDataList" border style="width: 100%;margin-top: 5px;">
                                <el-table-column prop="name" label="参数名称"></el-table-column>
                                <el-table-column prop="required" label="是否必填"></el-table-column>
                                <el-table-column prop="description" label="参数说明"></el-table-column>
                                <el-table-column prop="type" label="参数类型"></el-table-column>
                                <el-table-column prop="dataType" label="数据类型"></el-table-column>
                            </el-table>
                            <el-table row-key="name" default-expand-all :data="[currentApiMetaData.apiReturnTypeMetaData]" border style="width: 100%;margin-top: 5px;">
                                <el-table-column prop="name" label="参数名称"></el-table-column>
                                <el-table-column prop="description" label="参数说明"></el-table-column>
                                <el-table-column prop="dataType" label="数据类型"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane>
                            <template #label>
                                <el-icon><Reading /></el-icon>
                                <span style="margin-left: 5px;">调试</span>
                            </template>
                            <el-input
                                :value="currentApiGroupMetaData.pathList[0] + '/' + currentApiMetaData.pathList[0]"
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
                            <el-tabs style="height: 100%">
                                <el-tab-pane label="请求头值">
                                    <el-table :data="[]" border style="width: 100%;margin-top: 5px;">
                                        <el-table-column type="selection" width="50"/>
                                        <el-table-column prop="name" label="Header">
                                            <template #default="scope">
                                                <el-input v-model="scope.row.name" clearable></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="value" label="Value">
                                            <template #default="scope">
                                                <el-input v-model="scope.row.value" clearable></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="操作" width="50">
                                            <template #default="scope">
                                                <el-icon size="20"><CirclePlus /></el-icon>
                                                <el-icon size="20"><Delete /></el-icon>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                                <el-tab-pane label="请求参数">
                                    <el-table :data="currentApiMetaData.apiParamMetaDataList" border style="width: 100%;margin-top: 5px;">
                                        <el-table-column type="selection" width="50"/>
                                        <el-table-column prop="name" label="Name">
                                            <template #default="scope">
                                                <el-input v-model="scope.row.name" clearable></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="value" label="Value">
                                            <template #default="scope">
                                                <el-input v-model="scope.row.value" clearable></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="操作" width="50">
                                            <template #default="scope">
                                                <el-icon size="20"><CirclePlus /></el-icon>
                                                <el-icon size="20"><Delete /></el-icon>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-tab-pane>
                            </el-tabs>
                        </el-tab-pane>
                    </el-tabs>
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
:deep(.el-tabs__header) {
    margin: 0;
}
:deep(.el-icon) {
    cursor: pointer;
}

</style>
