<script setup lang="ts">

import type { TypeTodayWords } from '../funcs'

const props = defineProps<{
  word: string
}>()

const emits = defineEmits<{
  (e: 'next'): void
}>()


const markWord = (score: number) => {
  console.log('Mark -> ', props.word, score)
  let words = JSON.parse(localStorage.getItem('todayWords')!) as TypeTodayWords
  words.forEach((item, index, arr) => {
    if (item[0] == props.word) {
      arr.splice(index, 1);
    }
  });
  localStorage.setItem('todayWords', JSON.stringify(words));
  let history: Record<string, number> = JSON.parse(localStorage.getItem('history')!);

  if (score > 0) {
    history[props.word] = history[props.word] ? score + history[props.word] : score
  } else {
    history[props.word] = score
  }

  localStorage.setItem('history', JSON.stringify(history))
  console.log('Mark -> finished')
  emits('next')

}
</script>

<template>
  <div class="bar bar-bottom">

    <span class="b2" @click="markWord(1)">模糊</span>
    <span class="b1" @click="markWord(3)">熟悉</span>
    <span class="b3" @click="markWord(0)">陌生</span>
  </div>
</template>


<style scoped>
.bar-bottom {
  top: none;
  bottom: 0;
}

.b1 {
  color: var(--color-success);

}

.b2 {
  color: var(--color-warning);
}

.b3 {
  color: var(--color-danger);
}
</style>