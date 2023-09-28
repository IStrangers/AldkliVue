<script setup lang="ts">
const props = defineProps<{
    apiMetaData: Record<string,any> | undefined
}>()
</script>

<template>
    <template v-if="apiMetaData">
        <el-input
        :value="`/${apiMetaData.parent.pathList[0]}/${apiMetaData.pathList[0]}`"
        class="input-with-select"
        size="large"
        readonly="readonly"
        >
            <template #prepend>
                <el-select v-model="apiMetaData.methodType" style="width: 115px" size="large" disabled="disabled">
                    <template v-if="apiMetaData.methodType === 'ALL'">
                        <el-option v-for="method in ['GET','POST','PUT','DELETE','PATCH']" :label="method" :value="method" ></el-option>
                    </template>
                    <template  v-else>
                        <el-option :label="apiMetaData.methodType" :value="apiMetaData.methodType" ></el-option>
                    </template>
                </el-select>
            </template>
        </el-input>
        <el-table :data="apiMetaData.apiParamMetaDataList" border style="width: 100%;margin-top: 5px;">
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column prop="required" label="是否必填"></el-table-column>
            <el-table-column prop="description" label="参数说明"></el-table-column>
            <el-table-column prop="type" label="参数类型"></el-table-column>
            <el-table-column prop="dataType" label="数据类型"></el-table-column>
        </el-table>
        <el-table row-key="name" default-expand-all :data="[apiMetaData.apiReturnTypeMetaData]" border style="width: 100%;margin-top: 5px;">
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column prop="description" label="参数说明"></el-table-column>
            <el-table-column prop="dataType" label="数据类型"></el-table-column>
        </el-table>
    </template>
</template>

<style scoped lang="scss">

</style>
