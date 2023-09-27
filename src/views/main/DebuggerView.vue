<script setup lang="ts">
import JsonViewer from 'vue-json-viewer'
import axios from 'axios';
import { defineProps,reactive,ref } from 'vue'
const props = defineProps<{
    apiGroupMetaData: Record<string,any> | undefined
    apiMetaData: Record<string,any> | undefined
}>()

const getId = () => Math.random() * 100000000
const getEmptyObj = () => {return {_id: getId()}}
const cloneObj = (obj: any) => JSON.parse(JSON.stringify(obj))

const loading = ref(false)
const { apiGroupMetaData,apiMetaData } = props
const requestConfig: Record<string,any> = reactive( 
    apiGroupMetaData && apiMetaData ?
    {
        url: `${apiGroupMetaData.pathList[0]}/${apiMetaData.pathList[0]}`,
        methodType: apiMetaData.methodType,
        selectedMethod: apiMetaData.methodType,
        headers: [],
        params: cloneObj(apiMetaData.apiParamMetaDataList.map((v: Record<string,any>) => {v._id = getId();return v})),
    } : {
        url: ``,
        methodType: ``,
        selectedMethod: ``,
        headers: [],
        params: [],
    }
)

const deleteSelectedRecord = (selectedRecords: Array<Record<string,any>>) => (record: Record<string,any>) => !selectedRecords.find(selectedRecord => record._id === selectedRecord._id)
let selectedHeaders: Array<Record<string,any>> = []
let selectedParams: Array<Record<string,any>> = []
const changeSelectedHeaders = (headers: Array<Record<string,any>>) => {
    selectedHeaders = headers;
}
const changeSelectedParams = (params: Array<Record<string,any>>) => {
    selectedParams = params
}
const deleteHeaders = () => {
    requestConfig.headers = requestConfig.headers.filter(deleteSelectedRecord(selectedHeaders))
}
const addHeader = () => {
    requestConfig.headers.push(getEmptyObj())
}
const deleteParams = () => {
    requestConfig.params = requestConfig.params.filter(deleteSelectedRecord(selectedParams))
}
const addParam = () => {
    requestConfig.params.push(getEmptyObj())
}


const arrayToObj = (arr: Array<Record<string,any>>) => {
    const obj: any = {}
    for (const a of arr) {
        obj[a.name] = a.value
    }
    return obj
}
const response = reactive<Record<string,any>>({})
const sendRequest = () => {
    loading.value = true
    axios({
        url: requestConfig.url,
        method: requestConfig.selectedMethod,
        headers: arrayToObj(requestConfig.headers),
        params: arrayToObj(requestConfig.params),
        data: requestConfig.data,
    }).then((res) => {
        response.data = res.data
        loading.value = false
    }).catch(err => {
        console.log(err)
        loading.value = false
    })
}
</script>

<template>
    <div v-loading="loading">
        <el-input
            v-model="requestConfig.url"
            class="input-with-select"
            size="large"
        >
            <template #prepend>
                <el-select v-model="requestConfig.selectedMethod" style="width: 115px" size="large">
                    <template v-if="requestConfig.methodType === 'ALL'">
                        <el-option v-for="method in ['GET','POST','PUT','DELETE','PATCH']" :label="method" :value="method" ></el-option>
                    </template>
                    <template  v-else>
                        <el-option :label="requestConfig.methodType" :value="requestConfig.methodType" ></el-option>
                    </template>
                </el-select>
            </template>
            <template #append>
                <el-button size="large" @click="sendRequest">发送</el-button>
            </template>
        </el-input>
        <el-tabs style="height: 100%">
            <el-tab-pane label="请求头值">
                <el-button @click="deleteHeaders">删除</el-button>
                <el-button @click="addHeader" type="primary">增加</el-button>
                <el-table @selection-change="changeSelectedHeaders" :data="requestConfig.headers" border style="width: 100%;margin-top: 5px;">
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
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="请求参数">
                <el-button @click="deleteParams">删除</el-button>
                <el-button @click="addParam" type="primary">增加</el-button>
                <el-table @selection-change="changeSelectedParams" :data="requestConfig.params" border style="width: 100%;margin-top: 5px;">
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
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <div class="response-container">
            <JsonViewer v-if="response.data" :value="response.data" boxed sort theme="light"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.el-tab-pane) {
    padding-top: 10px;
}
.response-container {
    margin-top: 10px;
}
</style>
