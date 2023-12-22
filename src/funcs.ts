// offer common metheds and propertys

const apiBaseUrl = 'https://api.words.imhcg.cn'

const getDateString = () => {
  const d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}

const req = async (url: string) => {
  const resp = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'x-api-code': String(localStorage.getItem('x-api-code'))
    }
  })
  if (resp.status != 200) {
    if (resp.status >= 400 && resp.status < 500) {
      location.assign('/#/')
    } else {
      alert(`sorry\nerror code ${resp.status}`)
    }
    return null
  } else {
    return await resp.json()
  }
}

type TypeConfig = {
  collectionName: string
  wordsLimit: number
  random: boolean
  autoNext: boolean
}

const getConfigCache = () => JSON.parse(localStorage.getItem('config')!) as TypeConfig

// define the type of remote data of word collections name list, [title, count of words][]
type TpyeWordCololectionsNameList = [string, number][]
// return a word collections name list like [["colins 5 star",1000],...]
const getWordCololectionsNameList = async (): Promise<TpyeWordCololectionsNameList> =>
  await req(`${apiBaseUrl}/static/collection/names.json`)

// every start , need initConfig to check if ready
const initConfig = async () => {
  const cache = localStorage.getItem('config')
  if (!cache) {
    const wordCololectionsNameList = await getWordCololectionsNameList()
    localStorage.setItem('collectionNameList', JSON.stringify(wordCololectionsNameList))
    localStorage.setItem(
      'config',
      JSON.stringify({
        // init the collectionName as the fisrt of wordCololectionsNameList
        collectionName: wordCololectionsNameList[0][0],
        wordsLimit: 20,
        random: true,
        autoNext: false
      })
    )
  }
  if (!localStorage.getItem('history')) {
    localStorage.setItem('history', JSON.stringify({}))
  }
}

type TypeWordsCololection = string[]
const getWordsCololection = async (collectionName: string): Promise<TypeWordsCololection> => {
  const cache = localStorage.getItem(`words->${collectionName}`)
  if (cache) {
    return JSON.parse(cache)
  } else {
    const resp: TypeWordsCololection = await req(
      `${apiBaseUrl}/static/collection/${collectionName}.json`
    )
    localStorage.setItem(`words->${collectionName}`, JSON.stringify(resp))
    return resp
  }
}

// the history is a dict, with word as key, and the score number as value
type TypeHistory = Record<string, number>
type TypeTodayWords = [string, string][]
// choose words from selected word collection and add useages
const buildTodayWords = async (collectionName: string, limit: number) => {
  console.log('funcs -> buildTodayWords', collectionName, limit)
  let wordsCololection = await getWordsCololection(collectionName)
  // delete learned words
  const history: TypeHistory = JSON.parse(localStorage.getItem('history')!)
  wordsCololection.forEach((item: string, index: number, arr: string[]) => {
    if (history[item] && history[item] > 0) {
      arr.splice(index, 1)
    }
  })
  // consider if limit is bigger than the length of wordsCololection
  if (wordsCololection.length < limit) {
    limit = wordsCololection.length
  }

  let todayWords: TypeTodayWords = []

  if (getConfigCache().random) {
    wordsCololection = wordsCololection.sort(() => Math.random() - 0.5)
  }
  wordsCololection.slice(0, limit).forEach((item: string) => {
    todayWords.push([item, ''])
  })
  return await addWordsFrequence(todayWords)
}

// I consider that score is connect with the day passed, so after a day, the score -1
const recountHistory = (currentDate: string, beforeDate: string) => {
  if (currentDate > beforeDate) {
    console.log('funcs -> recountHistory')
    let history = JSON.parse(localStorage.getItem('history')!)
    Object.keys(history).forEach((w) => {
      const t1 = new Date(currentDate)
      const t2 = new Date(beforeDate)
      const passedDays = Math.floor((t1.getTime() - t2.getTime()) / 1000 / 60 / 60 / 24)
      console.log(`word:${w} ,passed days ${passedDays}`)
      history[w] = history[w] - passedDays < 0 ? 0 : history[w] - passedDays
    })
    localStorage.setItem('history', JSON.stringify(history))
  }
}

const addWordsFrequence = async (words: [string, string][]) => {
  let queryWords = ''
  words.forEach((w) => {
    if (queryWords.length == 0) {
      queryWords += w[0]
    } else {
      queryWords += ',' + w[0]
    }
  })
  const resp = (await req(`${apiBaseUrl}/db/frequence?words=${queryWords}`)) as string[]
  if (resp) {
    resp.forEach((useages, index) => {
      words[index] = [words[index][0], useages]
    })
  }
  return words
}

export {
  apiBaseUrl,
  initConfig,
  req,
  getWordsCololection,
  buildTodayWords,
  getWordCololectionsNameList,
  getConfigCache,
  recountHistory,
  addWordsFrequence,
  getDateString
}

export type {
  TypeConfig,
  TypeHistory,
  TypeTodayWords,
  TypeWordsCololection,
  TpyeWordCololectionsNameList
}
