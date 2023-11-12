<script setup lang="ts">

import { ref, watch, onBeforeMount } from 'vue'

import md5 from 'crypto-js/md5'

import axios from 'axios';
import Loading from '../components/Loading.vue'
import { req,apiBaseUrl } from "../funcs"
import Back from './Back.vue'
import Mark from './Mark.vue'

const props = defineProps<{
  word: string
}>()

const emit = defineEmits<{
  (e: 'showWordList'): void
}>()

const showWordList = () => {
  console.log('Detail -> showWordList')
  emit('showWordList')
}

interface Useage {
  ex: [string, string][],
  tran: [string, string, string]
}

interface Detail {
  word: string,
  star: number,
  pron: [string, string][][],
  useage: Useage[]
}

const detail = ref<Detail>()
const loadingVision = ref(false)

const getDetail = async (word: string) => {
  console.log('Detail -> getDetail',word)

  loadingVision.value = true
  const resp = await req(`${apiBaseUrl}/db/word?w=${word}`)
  loadingVision.value = false
  if (resp) {
    const data = resp
    detail.value = data
  }
}

let objectURL: string = '';
const getBlobUrl = async (url: string) => {
  loadingVision.value = true
  const response1 = await axios.get(url, { 
    responseType: 'blob',
    headers:{
      "x-api-code": String(localStorage.getItem("x-api-code"))
    }
  })
  loadingVision.value = false

  const blob = new Blob([response1.data], { type: 'audio/mpeg' })
  if (objectURL) {
    window.URL.revokeObjectURL(objectURL);
  }
  objectURL = window.URL.createObjectURL(blob);

  return objectURL
}

let currentAudio = document.createElement("audio");
const playAudio = async (src: string) => {
  if (currentAudio.onplaying) {
    // at the same time, only a audio can be played
    currentAudio.pause();
  }
  let u = await getBlobUrl(src);
  currentAudio.setAttribute("src", u);
  currentAudio.play();
};


const playVoice = async (s: string) => {
  // playAudio(`${apiBaseUrl}/voice?s=${s}`)
  playAudio(`${apiBaseUrl}/voice?key=${md5(s)}`)
};

onBeforeMount(() => {
  getDetail(props.word)
})

watch(props, () => {
  getDetail(props.word)
})

</script>

<template>

  <Back @back="showWordList" :loading="loadingVision"/>
  
  <Transition>
    <div class="content" v-if="detail">
      <!--<span>All done.</span>-->
      <h1>{{ detail.word }}</h1>
      <h4>{{ '⭐'.repeat(detail.star) }}</h4>
      <ul class="pronounce">
        <li v-for="i in detail.pron">
          <span class="link" v-for="n in i" v-on:click="playAudio(`${apiBaseUrl}/static/` + n[0])">/{{
            n[1] || detail.word
          }}</span>
        </li>
      </ul>

      <ul class="useages">
        <li class="useage" v-for="(u) in detail?.useage">
          <p class="useage-type">{{ u.tran[2] }}</p>
          <p class="useage-zh">{{ u.tran[0] }}</p>
          <p class="useage-en" v-on:click="playVoice(u.tran[1])">{{ u.tran[1] }}</p>
          <div v-for="e in u.ex" class="examples pointer" >
            <span class="example example-en link" v-on:click="playVoice(e[0])">{{ e[0] }}</span>
            <span class="example">{{ e[1] }}</span>
          </div>

        </li>
      </ul>
    </div>
  </Transition>

  <Mark :word="props.word" v-on:next="()=>{showWordList()}"/>
</template>

<style scoped>
.link {
  display: block;
  font-size: 1rem;
  color: var(--color-link);
  cursor: pointer;
}

.pronounce {
  margin: 0.5rem 0;
}

.pronounce li {
  display: flex;
}

.pronounce li span {
  margin-right: 0.5rem;
}

.useage {
  display: block;
  padding-left: 0.3rem;

  border-left: 1px solid var(--color-text4);
  margin: 1rem 0;
  border-radius: 0;
}

.useage-zh {
  font-size: 1.15rem;
  font-weight: bold;
  margin: 0.2rem 0;
}

.useage-en {
  font-size: 1rem;
  cursor: pointer;
}
.useage-type {
  font-size: 0.9rem;
  font-weight: lighter; 
}


.examples {
  font-size: 0.85rem;
  font-weight: lighter;
  border-left: 0.25px solid var(--color-text4);
  margin: 0.5rem 0;
  padding: 0.1rem 0.3rem;
  border-radius: 0;

}

.example {
  font-size: 0.9rem;
  font-weight: lighter;
  display: block;
}

.example-en {
  margin-bottom: 0.1rem;
}



.content {
  padding: 5rem 1rem;


}
</style>
