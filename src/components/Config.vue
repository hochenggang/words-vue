<script setup lang="ts">

import { ref, reactive, watch, onBeforeMount } from 'vue'
import Back from './Back.vue'
import { getWordCololectionsNameList, buildTodayWords, getConfigCache } from "../funcs";
import type { Config } from "../funcs";


const emit = defineEmits<{
  (e: 'showWordList'): void,
  (e: 'rebuildTodayWords'): void
}>()

const showWordList = () => {
  console.log('Config -> showWordList')
  emit('showWordList')
}

let config: Config = reactive(getConfigCache())
const collectionNameList = ref<[string, number][]>(JSON.parse(localStorage.getItem('collectionNameList')!))

const collectionName = ref<string>(config.collectionName)
const wordsLimit = ref<number>(config.wordsLimit)
const randomMode = ref<string>(config.random ? '开' : '关')
const loadingVision = ref(false)


onBeforeMount(async () => {
  loadingVision.value = true
  const resp = await getWordCololectionsNameList()
  loadingVision.value = false
  if (resp) {
    const data: [string, number][] = resp
    localStorage.setItem('collectionNameList', JSON.stringify(data))
    collectionNameList.value = data
    console.log('request collectionNameList success <-', data)
  }
})

watch(collectionName, () => {
  config.collectionName = collectionName.value
  localStorage.setItem('config', JSON.stringify(config))
  console.log('Config -> resaved by watch collectionName')
})

watch(wordsLimit, () => {
  config.wordsLimit = wordsLimit.value
  localStorage.setItem('config', JSON.stringify(config))
  console.log('Config -> resaved by watch wordsLimit')
})


watch(randomMode, () => {
  config.random = randomMode.value == '开' ? true : false
  localStorage.setItem('config', JSON.stringify(config))
  console.log('Config -> resaved by watch randomMode')
})

watch(config, async () => {
  loadingVision.value = true
  const w = await buildTodayWords(config.collectionName, config.wordsLimit)
  loadingVision.value = false

  localStorage.setItem('todayWords', JSON.stringify(w))
  console.log('Config -> rebuilded todayWords by watch config')
})

</script>

<template>
  <Back @back="showWordList" :loading="loadingVision" />
  <div class="bar top">
    <ul class="lines">
      <li class="line">
        <p class="small-text">单词集</p>
        <select class="small-text" name="collectionName" v-model="collectionName">
          <option v-for="[name, cout] in collectionNameList" :value="name">
            {{ name }}
          </option>
        </select>
      </li>

      <li class="line">
        <p class="small-text">每日词量</p>
        <select class="small-text" name="collectionName" v-model="wordsLimit">
          <option v-for="num in [20, 30, 50, 100]" :value="num">
            {{ num }}
          </option>
        </select>
      </li>

      <li class="line">
        <p class="small-text">打乱顺序</p>
        <select class="small-text" name="collectionName" v-model="randomMode">
          <option v-for="s in ['开', '关']" :value="s">
            {{ s }}
          </option>
        </select>
      </li>



    </ul>



  </div>
</template>

<style scoped>
.top {
  top: 3.5rem;
}

.lines {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-line2);
  border-radius: 0;

}

.small-text {
  font-size: 0.8rem;
}

select,
input {
  text-align: right;
  padding-right: 0.5rem;
  color: var(--color-link);
}
</style>
