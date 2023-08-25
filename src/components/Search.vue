<script setup lang="ts">

import { ref, watch } from 'vue'
import { req,apiBaseUrl } from "../funcs";

const emit = defineEmits<{
  (e: 'showWord', w: string): void,
  (e: 'showConfig'): void
}>()

const showWord = (w: string) => {
  console.log('Search -> showWord')
  emit('showWord', w)
}

const showConfig = () => {
  console.log('Search -> showConfig')
  emit('showConfig')
}

const fuzzyWords = ref<string[]>([])

// dinfine a reactive value 
const keyword = ref('')
const setKeyword = (k: string) => {
  // keyword.value = k
  // people select a word shows that no more need fuzzy words
  fuzzyWords.value = []
  showWord(k)
}

// when keyword changed, request fuzzy words list if  len of keyword > 2
watch(keyword, async () => {

  if (keyword.value.length > 2) {
    console.log('Search -> fuzzyWords')

    const resp = await fetch(`${apiBaseUrl}/db/words?k=${keyword.value}`)
    if (resp.status != 200) {
      alert(`sorry\nerror code ${resp.status}`)
    } else {
      const data = await resp.json()
      fuzzyWords.value = data
      console.log('data', data)
    }
  } else {
    fuzzyWords.value = []
  }
})

// const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>

<template>

  <div class="bar">
    <input class="search-input" type="text" placeholder="Search" v-model="keyword" />
    <span class="icon-box" @click="showConfig">
      <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
      </path>
    </svg>
    </span>
  </div>

  <ul v-if="fuzzyWords.length" class="bar top fuzzy-words">
    <li class="fuzzy-word" v-for="(w, i) in fuzzyWords" @click="setKeyword(w)">
      <span class="fuzzy-word-text">{{ w }}</span>
      <span class="fuzzy-word-index">{{ i + 1 }}</span>
    </li>
  </ul>
</template>

<style scoped>
.top {
  top: 3.5rem;
}

.search-input {
  color: var(--color-text);
}

.bar>.icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-link);
  fill: none;
  stroke: currentColor;
  stroke-width: 2px;
}

.fuzzy-words {
  flex-direction: column;
  justify-content: left;
  max-height: 30rem;
  overflow-y: auto;
}

.fuzzy-word {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-line2);
  cursor: pointer;
  font-weight: lighter;
  padding: 1rem;
}

.fuzzy-word-text {
  color: var(--color-link);
}


.fuzzy-word-index {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-text4);
  font-weight: lighter;
}


</style>
