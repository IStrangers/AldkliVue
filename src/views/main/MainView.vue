<script setup lang="ts">
import DocumentView from './DocumentView.vue'
import DebuggerView from './DebuggerView.vue'
const props = defineProps<{
    apiMetaData: Record<string,any> | undefined
}>()
</script>

<template>
    <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane>
            <template #label>
                <el-icon><Document /></el-icon>
                <span style="margin-left: 5px;">文档</span>
            </template>
            <DocumentView :apiMetaData="apiMetaData"></DocumentView>
        </el-tab-pane>
        <el-tab-pane>
            <template #label>
                <el-icon><Reading /></el-icon>
                <span style="margin-left: 5px;">调试</span>
            </template>
            <DebuggerView :apiMetaData="apiMetaData"></DebuggerView>
        </el-tab-pane>
    </el-tabs>

</template>

<style scoped lang="scss">

</style>
