<script setup lang="ts">
import AsideView from './aside/AsideView.vue'
import MainView from './main/MainView.vue'
import axios from 'axios'
import { ref,onBeforeMount } from 'vue'
const apiEntryList = ref<Array<Record<string,any>>>([])
const apiGroupMetaData = ref<Record<string,any>>()
const apiMetaData = ref<Record<string,any>>()

const changeApiMetaData = (_apiGroupMetaData: Record<string,any>,_apiMetaData: Record<string,any>) => {
    apiGroupMetaData.value = _apiGroupMetaData
    apiMetaData.value = _apiMetaData
    apiMetaData.value.parent = apiGroupMetaData.value
}
onBeforeMount(() => {
    axios.get("/aldkli/metaData/getApiEntryList").then((res) => {
        apiEntryList.value = res.data
    })

    apiEntryList.value = [{
        "name": "全部",
        "apiGroupMetaDataList": [{"name":"测试分组","pathList":["test"],"apiMetaDataList":[{"name":"获取测试列表","methodType":"ALL","pathList":["getTestList","TestList"],"apiParamMetaDataList":[{"name":"param1","required":false,"description":"参数1","type":"search","dataType":"String","example":"test"},{"name":"param2","required":true,"description":"","type":"urlPath","dataType":"int","example":"1"}],"apiReturnTypeMetaData":{"name":"Result","description":"测试列表","dataType":"List<Map<String,Object>>","children":[{"name":"testName","description":"测试名称","dataType":"String","children":[]},{"name":"testCode","description":"测试编码","dataType":"String","children":[]},{"name":"testMap","description":"测试映射","dataType":"Map<String,Object>","children":[{"name":"mappingName","description":"映射名称","dataType":"String","children":[]},{"name":"mappingCode","description":"映射编码","dataType":"String","children":[]}]}]}},{"name":"获取用户","methodType":"GET","pathList":["getUser"],"apiParamMetaDataList":[],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"User","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}},{"name":"获取用户列表","methodType":"GET","pathList":["getUserList"],"apiParamMetaDataList":[{"name":"data","required":false,"description":"","type":"","dataType":"Map<String,Long>","example":""}],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"List<User>","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}}]}]
    }]
})
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header>
            </el-header>
            <el-container>
                <el-aside width="300px">
                    <AsideView :apiEntryList="apiEntryList" @change="changeApiMetaData"></AsideView>
                </el-aside>
                <el-main>
                    <MainView :apiMetaData="apiMetaData"></MainView>
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
