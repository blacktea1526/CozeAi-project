<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="typewriter-container">
    <div class="typewriter-text">{{ displayedText }}</div>
    <div class="cursor" :class="{ blink: isCursorVisible }"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const fullText = ref('Hello, this is a typewriter effect in Vue!')
const displayedText = ref('') // 当前显示的文本
const cursorInterval = ref(null) // 定时器
const typingSpeed = 100 // 打字速度（毫秒）

// 控制光标闪烁的变量
const isCursorVisible = ref(true)
const cursorBlinkInterval = 500 // 光标闪烁速度（毫秒）

// 开始打字效果
function startTyping() {
  let index = 0
  cursorInterval.value = setInterval(() => {
    if (index < fullText.value.length) {
      displayedText.value += fullText.value[index]
      index++
    } else {
      clearInterval(cursorInterval.value) // 完成后停止定时器
    }
  }, typingSpeed)
}

// 光标闪烁效果
function startCursorBlink() {
  setInterval(() => {
    isCursorVisible.value = !isCursorVisible.value
  }, cursorBlinkInterval)
}

onMounted(() => {
  startTyping() // 开始打字效果
  startCursorBlink() // 开始光标闪烁
})

onUnmounted(() => {
  clearInterval(cursorInterval.value) // 组件销毁时清理定时器
})
</script>
<style scoped>
.typewriter-container {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2em;
  position: relative;
  display: inline-block;
}

.typewriter-text {
  white-space: pre; /* 保留空格和换行 */
}

.cursor {
  width: 2px;
  height: 100%;
  background-color: black;
  position: absolute;
  left: 100%;
  top: 0;
  transition: opacity 0.5s;
}

.blink {
  opacity: 1;
}

.cursor:not(.blink) {
  opacity: 0;
}
</style>
