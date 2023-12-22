<script setup lang="ts">

import { ref, onBeforeMount } from 'vue'
import { useRouter } from "vue-router";
import { buildTodayWords,getConfigCache,getDateString,recountHistory } from "../funcs";
import type { TypeTodayWords } from "../funcs";

const router = useRouter();

let config = getConfigCache()
const todayWordsList = ref<TypeTodayWords>()

const getTodayWordsList = async () => {
  // if this component load at same day, not rebuid words
  let currentDate = getDateString();
  let beforeDate = localStorage.getItem('currentDate');
  if (currentDate != beforeDate || !localStorage.getItem('todayWords')) {
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

const toDetailPage = (word:string)=>router.push(`/detail?word=${word}`)

onBeforeMount(async () => {
  getTodayWordsList()
})

</script>

<template>
  <ul v-if="todayWordsList" class="words">
    <li @click="toDetailPage(word[0])" v-for="(word, index) in todayWordsList" :key="index">
      <div class="word">
        <span class="word-text">{{ word[0] }}</span>
        <span class="word-detail">{{ word[1].split("，").length > 2 ? word[1].split("，").slice(0,2).join(", ") : word[1].split("，").join(", ")}}</span>
      </div>
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
  padding: 1.75rem;
  padding-top: 5rem;
  z-index: 2;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  justify-content: start;
}

.word {
  border-bottom: 1px solid var(--color-line2);
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0rem;
  border-radius: 0;

}

.word-text {
  color: var(--color-link);

}

.word-detail {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--color-text2);
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
