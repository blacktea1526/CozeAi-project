<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.aside {
  background-color: #cce0fd;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
