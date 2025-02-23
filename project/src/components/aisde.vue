<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <el-button v-for="dialogue in dialogues" :key="dialogue.id" :value="dialogue"> </el-button>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
onMounted(() => {
  loadAllDialogues()
})
</script>
