<script setup lang="ts">

import { ref, watch, onBeforeMount } from 'vue'
import { getWordsCololection, buildTodayWords, recountHistory } from "../funcs";
const emit = defineEmits<{
  (e: 'showWord', w: string): void,

}>()

const showWord = (w: string) => {
  emit('showWord', w)
}

interface Config {
  collectionName: string,
  wordsLimit: number,
  sortType: string,
  autoNext: boolean
}

let config: Config = JSON.parse(localStorage.getItem('config')!)

const getDateText = () => {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}

const todayWordsList = ref<string[]>()

const getTodayWordsList = async () => {

  //   获取当前日期，与缓存日期比对，当不一致时，刷新单词。
  let currentDate = getDateText();
  console.log('WordList -> getTodayWordsList', currentDate)

  let beforeDate = localStorage.getItem('currentDate');

  if (currentDate != beforeDate) {
    if (!beforeDate) {
      localStorage.setItem('currentDate', currentDate);
      beforeDate = currentDate
    }

    recountHistory(currentDate, beforeDate)
    const words = await buildTodayWords(config.collectionName, config.wordsLimit)
    localStorage.setItem('todayWords', JSON.stringify(words));
    localStorage.setItem('currentDate', currentDate);
  };
  todayWordsList.value = JSON.parse(localStorage.getItem('todayWords')!);
}


onBeforeMount(async () => {
  getTodayWordsList()
})

</script>

<template>
  <ul v-if="todayWordsList" class="bar words">
    <li @click="showWord(word)" v-for="(word, index) in todayWordsList" :key="index">
      <span class="word-text">{{ word }}</span>
      <span class="word-index">{{ index + 1 }}</span>
    </li>
  </ul>
  <ul v-if="!todayWordsList?.length" class="bar words flex-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  </ul>
</template>

<style scoped>
.words {
  padding: 4.5rem 1rem;
  z-index: 2;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  justify-content: start;
}

.words li {
  border-bottom: 1px solid var(--color-line2);
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0;

}

.word-text {
  color: var(--color-link);

}

.word-index {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-text4);
  font-weight: lighter;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-link);
  fill: none;
  stroke: currentColor;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
