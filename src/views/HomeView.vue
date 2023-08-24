<script setup lang="ts">
import { reactive } from 'vue'
const apiGroupMetaDataList = reactive([])
</script>

<template>
    <Row>
        
    </Row>
    <Row>
        <Col span="12">
            <Menu v-for="(apiGroupMetaData,groupIndex) in apiGroupMetaDataList" active-name="1-2" :open-names="['1']">
                <Submenu :name="groupIndex">
                    <template #title>
                        <Icon type="ios-analytics" />
                        {{ apiGroupMetaData.value }}
                    </template>
                    <MenuItem v-if="(apiMetaData,apiIndex) in apiGroupMetaData.apiMetaDataList" :name="`${groupIndex}-${apiIndex}`">
                        {{ apiMetaData.value }}
                    </MenuItem>
                </Submenu>
            </Menu>
        </Col>
        <Col span="12">

        </Col>
    </Row>
</template>

<style scoped>

</style>
