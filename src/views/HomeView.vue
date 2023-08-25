<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'
import Search from '../components/Search.vue'
import Detail from '../components/Detail.vue'
import Config from '../components/Config.vue'
import WordsList from '../components/WordsList.vue'
import { getWordCololectionsNameList,recountHistory } from "../funcs";

const word = ref('')
const detailVision = ref(false)
const configVision = ref(false)
const searchVision = ref(true)
const wordsListVision = ref(false)


const showWord = (w: string) => {
  console.log('HomeView -> showWord', w)
  word.value = w
  detailVision.value = true
  wordsListVision.value = false
  searchVision.value = false
}

const showConfig = () => {
  console.log('HomeView -> showConfig')
  searchVision.value = false
  detailVision.value = false
  wordsListVision.value = false
  configVision.value = true
}

const showWordList = () => {
  console.log('HomeView -> showWordList')
  searchVision.value = true
  detailVision.value = false
  configVision.value = false
  wordsListVision.value = true

}

const checkConfig = async () => {
  console.log('HomeView -> checkConfig')
  const conf = localStorage.getItem('config')

  if (!conf) {
    const resp = await getWordCololectionsNameList()
    if (resp) {
      const data: [string, number][] = resp
      localStorage.setItem('collectionNameList', JSON.stringify(data))
      localStorage.setItem('config', JSON.stringify({
        collectionName: data![0][0],
        wordsLimit: 20,
        random: true,
        autoNext: false
      }))
      console.log('HomeView -> checkConfig', 'init config success')
    }
  }

  if (!localStorage.getItem('history')) {
    localStorage.setItem('history', JSON.stringify({}))
  }
}

onBeforeMount(async () => {
  // check config first
  await checkConfig()
  // then show word list
  wordsListVision.value = true
})

</script>

<template>
  <main>
    <Search v-if="searchVision" @show-word="showWord" @show-config="showConfig" />
    <WordsList v-if="wordsListVision" @show-word="showWord" />
    <Config v-if="configVision" @show-word-list="showWordList" />
    <Detail v-if="detailVision" :word="word" @show-word-list="showWordList" />
    <!-- 搜索组件和列表组件 -->
  </main>
</template>


<style></style>


