<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import { useRouter,useRoute } from 'vue-router'

import {
  getWordCololectionsNameList,
  buildTodayWords,
  getConfigCache,
  req,
  apiBaseUrl
} from '../funcs'
import type { TpyeWordCololectionsNameList } from '../funcs'
import IconSetting from './icons/IconSetting.vue'
import IconBack from './icons/IconBack.vue'
import IconSave from './icons/IconSave.vue'


const route = useRoute()
const router = useRouter()
const toDetailPage = (word: string) => router.push(`/detail?word=${word}`)

const settingVision = ref(false)
const searchVision = ref(true)

const collectionNameList = ref<TpyeWordCololectionsNameList>(
  JSON.parse(localStorage.getItem('collectionNameList')!)
)

let config = getConfigCache()
const collectionName = ref<string>(config.collectionName)
const wordsLimit = ref<number>(config.wordsLimit)
const randomMode = ref<string>(config.random ? '开' : '关')
const loadingVision = ref(false)

onBeforeMount(async () => {
  loadingVision.value = true
  const wordCololectionsNameList = await getWordCololectionsNameList()
  loadingVision.value = false

  localStorage.setItem('collectionNameList', JSON.stringify(wordCololectionsNameList))
  collectionNameList.value = wordCololectionsNameList
})

const saveConfig = async () => {
  config.wordsLimit = wordsLimit.value
  config.random = randomMode.value == '开' ? true : false
  config.collectionName = collectionName.value
  localStorage.setItem('config', JSON.stringify(config))

  const words = await buildTodayWords(config.collectionName, config.wordsLimit)
  localStorage.setItem('todayWords', JSON.stringify(words))

  console.log('saveConfig finished.')

  router.push("/")
}

const fuzzyWords = ref<string[]>([])

// dinfine a reactive value
const keyword = ref('')
const setKeyword = (k: string) => {
  // keyword.value = k
  // people select a word shows that no more need fuzzy words
  fuzzyWords.value = []
  toDetailPage(k)
}

// when keyword changed, request fuzzy words list if  len of keyword > 2
watch(keyword, async () => {
  if (keyword.value.length > 2) {
    console.log('Search -> fuzzyWords')
    const data = await req(`${apiBaseUrl}/db/words?k=${keyword.value}`)
    fuzzyWords.value = data
    console.log('data', data)
  } else {
    fuzzyWords.value = []
  }
})
</script>

<template>
  <div class="bar" v-if="searchVision">
    <input class="search-input" type="text" placeholder="Search" v-model="keyword" />
    <span class="flex-center" @click=";(settingVision = true), (searchVision = false)">
      <IconSetting />
    </span>
  </div>

  <div v-if="fuzzyWords.length" class="fuzzy-word-bg"></div>
  <ul v-if="fuzzyWords.length" class="bar top fuzzy-words">
    <li class="fuzzy-word" v-for="(w, i) in fuzzyWords" @click="setKeyword(w)" :key="i">
      <span class="fuzzy-word-text">{{ w }}</span>
      <span class="fuzzy-word-index">{{ i + 1 }}</span>
    </li>
  </ul>

  <div class="setting-container" v-if="settingVision">
    <div class="bar setting-header">
      <span class="flex-center" @click=";(settingVision = false), (searchVision = true)">
        <IconBack/>
      </span>
      <span class="flex-center" @click=";(settingVision = false), (searchVision = true),saveConfig()">
        <IconSave class="save-icon" />
      </span>
    </div>

    <ul class="setting-body lines">
      <li class="line">
        <p class="small-text">单词集</p>
        <select class="small-text" name="collectionName" v-model="collectionName">
          <option v-for="[name, count] in collectionNameList" :value="name" :key="name">
            {{ name }} ({{ count }})
          </option>
        </select>
      </li>

      <li class="line">
        <p class="small-text">每日词量</p>
        <select class="small-text" name="collectionName" v-model="wordsLimit">
          <option v-for="num in [20, 30, 50, 100]" :value="num" :key="num">
            {{ num }}
          </option>
        </select>
      </li>

      <li class="line">
        <p class="small-text">打乱顺序</p>
        <select class="small-text" name="collectionName" v-model="randomMode">
          <option v-for="s in ['开', '关']" :value="s" :key="s">
            {{ s }}
          </option>
        </select>
      </li>

    </ul>
  </div>
</template>

<style scoped>

.lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
}

.line {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-line2);
  border-radius: 0;
}

.small-text {
  font-size: 0.8rem;
}

select {
  text-align: right;
  padding-right: 0.5rem;
  color: var(--color-link);
}

.btn {
  border: 1px solid #000000;
  padding: 0.5rem;
}


.fuzzy-words {
  top: 3.5rem;
  flex-direction: column;
  justify-content: left;
  max-height: 30rem;
  overflow-y: auto;
}

.fuzzy-word {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-line2);
  cursor: pointer;
  font-weight: lighter;
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

.fuzzy-word-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  z-index: 2;
}


.setting-container {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.setting-header {
  
}

.setting-body {
  padding: 1.75rem;
  padding-top: 5rem;
}

.save-icon {
  width: 1.25rem;
  height: 1.25rem;
  
}
.save-icon  path {
  fill: var(--color-link);
}
</style>
