<script setup lang="ts">

import { RouterView } from 'vue-router'

</script>

<template>
  <RouterView />
</template>

<style>
:root {
  font-size: 15px;
  --color-bg: #fffdf2;
  --color-link: #409eff;
  --color-text: #303133;
  --color-text2: #606266;
  --color-text3: #909399;
  --color-text4: #c0c4cc;
  --color-line: #dcdfe6;
  --color-line2: #f2f6fc;
  --color-success: #67c23a;
  --color-warning: #e6a23c;
  --color-danger: #f56c6c;
}

* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  border: none;
  outline: none;
  box-sizing: border-box;
  color: var(--color-text);
  background-color: var(--color-bg);
}

@font-face {
  font-family: Emoji;
  src: local("Apple Color Emojiji"), local("Segoe UI Emoji"),
    local("Segoe UI Symbol"), local("Noto Color Emoji");
  unicode-range: U+1F000-1F644, U+203C-3299;
}

.bar {
  position: fixed;
  left: 0;
  width: calc(100% - 2rem);
  margin: 1rem;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 0.75rem #0000001a;
}

.bar > * {
  padding: 1rem;
}

.bar-top {
  top: 0;
}

.bar-bottom {
  bottom: 0;
}

.bar .icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-link);
  fill: none;
  stroke: currentColor;
  stroke-width: 2px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

svg {
  width: 1rem;
  height: 1rem;
  display: block;
}


.v-enter-active,
.v-leave-active {
  transition: 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>