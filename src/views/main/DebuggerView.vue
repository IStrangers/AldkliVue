<script setup lang="ts">
import { JsonViewer } from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css"
import axios from 'axios'
import { onBeforeMount, reactive,ref,watch } from 'vue'
const props = defineProps<{
    apiMetaData: Record<string,any> | undefined
}>()
const defaultContentType = "application/x-www-form-urlencoded"
const defaultBodyContentType = "application/json"
const defaultHeaders = [{name: "Content-Type",value: defaultContentType}]
const defaultHeaderNames = defaultHeaders.map(header => header.name)
const getId = () => Math.random() * 100000000
const getEmptyObj = () => {return {_id: getId()}}
const cloneObj = (obj: any) => JSON.parse(JSON.stringify(obj))
const isDefaultHeader = (row: Record<string,any>) => {
    return defaultHeaderNames.includes(row.name)
}

const loading = ref(false)
let requestConfig: Record<string,any>
const initRequestConfig = (apiMetaData: Record<string,any> | undefined) => {
    requestConfig = reactive( 
        apiMetaData ?
        {
            bodyContentType: defaultBodyContentType,
            url: `/${apiMetaData.parent.pathList[0]}/${apiMetaData.pathList[0]}`,
            methodType: apiMetaData.methodType,
            selectedMethod: apiMetaData.methodType === "ALL" ? "GET" : apiMetaData.methodType,
            headers: cloneObj(defaultHeaders),
            params: cloneObj(apiMetaData.apiParamMetaDataList.map((v: Record<string,any>) => {v._id = getId();return v})),
        } : {
            bodyContentType: defaultBodyContentType,
            url: ``,
            methodType: ``,
            selectedMethod: ``,
            headers: cloneObj(defaultHeaders),
            params: [],
        }
    )
}
watch(() => props.apiMetaData,(apiMetaData: Record<string,any> | undefined) => {
    initRequestConfig(apiMetaData)
})
onBeforeMount(() => {
    initRequestConfig(props.apiMetaData)
})

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

const changeTab = (tabName: string) => {

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
    const header = requestConfig.headers.find((header: Record<string,any>) => header.name === "Content-Type")
    header.value = requestConfig.body ? requestConfig.bodyContentType : defaultContentType
    axios({
        url: requestConfig.url,
        method: requestConfig.selectedMethod,
        headers: arrayToObj(requestConfig.headers),
        params: arrayToObj(requestConfig.params),
        data: requestConfig.body,
    }).then((res) => {
        response.data = res.data
        loading.value = false
    }).catch(err => {
        console.log(err)
        loading.value = false
    })
}
const v = [{"name":"测试分组","pathList":["test"],"apiMetaDataList":[{"name":"获取测试列表","methodType":"ALL","pathList":["getTestList","TestList"],"apiParamMetaDataList":[{"name":"param1","required":false,"description":"参数1","type":"","dataType":"","example":"test"},{"name":"param2","required":false,"description":"","type":"","dataType":"","example":"1"}],"apiReturnTypeMetaData":{"name":"Result","description":"测试列表","dataType":"List<Map<String,Object>>","children":[]}},{"name":"获取用户列表","methodType":"GET","pathList":["getUserList"],"apiParamMetaDataList":[{"name":"arg0","required":false,"description":"","type":"","dataType":"Map<String,Long>","example":""}],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"List<User>","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}},{"name":"获取用户","methodType":"GET","pathList":["getUser"],"apiParamMetaDataList":[],"apiReturnTypeMetaData":{"name":"Result","description":"用户","dataType":"User","children":[{"name":"userName","description":"用户名称","dataType":"String","children":[]},{"name":"code","description":"编码","dataType":"Long","children":[]},{"name":"dept","description":"用户所在部门","dataType":"Dept","children":[{"name":"deptName","description":"部门名称","dataType":"String","children":[]},{"name":"code","description":"部门编码","dataType":"String","children":[]}]}]}}]}]
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
        <el-tabs style="height: 100%" @tab-change="changeTab">
            <el-tab-pane label="请求标头">
                <el-button @click="deleteHeaders">删除</el-button>
                <el-button @click="addHeader" type="primary">增加</el-button>
                <el-table key="_id" @selection-change="changeSelectedHeaders" :data="requestConfig.headers" border style="width: 100%;margin-top: 5px;">
                    <el-table-column type="selection" width="50" :selectable="(row: Record<string,any>) => !isDefaultHeader(row)"/>
                    <el-table-column prop="name" label="Header">
                        <template #default="scope">
                            <el-input v-model="scope.row.name" clearable :disabled="isDefaultHeader(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="Value">
                        <template #default="scope">
                            <el-input v-model="scope.row.value" clearable :disabled="isDefaultHeader(scope.row)"></el-input>
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
            <el-tab-pane label="请求主体">
                <el-dropdown @command="(v: string) => requestConfig.bodyContentType=v">
                    <el-button>
                        {{ requestConfig.bodyContentType }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="application/json">application/json</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div style="margin-top: 10px;">
                    <template v-if="requestConfig.bodyContentType === 'application/json'">
                        <el-input
                            v-model="requestConfig.body"
                            :rows="30"
                            type="textarea"
                            placeholder="请输入">
                        </el-input>
                    </template>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="response-container">
            <JsonViewer v-if="response.data" :value="response.data" expanded :expandDepth="5" boxed sort theme="light"/>
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
