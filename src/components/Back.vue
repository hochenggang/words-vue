<script setup lang="ts">

import { ref, watch } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const back = () => {
  console.log('Back -> back')

  emit('back')
}

</script>

<template>
  <div class="bar">
    <span class="icon-box" v-on:click="back">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <polyline points="9 14 4 9 9 4"></polyline>
        <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
      </svg>

    </span>
    <Transition>
      <span class="icon-box">
        <svg v-show="props.loading" class="icon loading" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2663" width="200" height="200">
          <path
            d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 128a298.666667 298.666667 0 1 0 0 597.333334 298.666667 298.666667 0 0 0 0-597.333334z"
            fill="#000000" fill-opacity=".05" p-id="2664"></path>
          <path
            d="M813.696 813.696c166.613333-166.613333 166.613333-436.778667 0-603.392-166.613333-166.613333-436.778667-166.613333-603.392 0A64 64 0 0 0 300.8 300.8a298.666667 298.666667 0 1 1 422.4 422.4 64 64 0 0 0 90.496 90.496z"
            fill="#000000" p-id="2665"></path>
        </svg>
      </span>
    </Transition>


  </div>
</template>


<style scoped>
.loading {
  animation: rotate 0.5s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>