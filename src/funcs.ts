
const apiBaseUrl = 'https://api.words.imhcg.cn'

const req = async (url: string) => {
    const resp = await fetch(url)
    if (resp.status != 200) {
        alert(`sorry\nerror code ${resp.status}`)
        return null
    } else {
        return await resp.json()
    }
}


interface Config {
    collectionName: string,
    wordsLimit: number,
    random: boolean,
    autoNext: boolean
}



const getConfigCache = () => JSON.parse(localStorage.getItem('config')!) as Config


const getWordsCololection = async (collectionName: string) => {
    let r = localStorage.getItem(`words->${collectionName}`)
    if (!r) {
        const resp = await req(`${apiBaseUrl}/static/collection/${collectionName}.json`)
        if (resp) {
            localStorage.setItem(`words->${collectionName}`, JSON.stringify(resp))
            console.log('request collectionWords success')
            return resp
        }
    } else {
        return JSON.parse(r!)
    }
}

const buildTodayWords = async (collectionName: string, limit: number) => {
    console.log('funcs -> buildTodayWords', collectionName, limit)
    const a = await getWordsCololection(collectionName)
    let b: string[] = a
    if (getConfigCache().random) {
        b = a.sort(() => Math.random() - 0.5);
    }
    if (b.length < limit) {
        limit = b.length
    }
    console.log('words list:', b)

    // 后续需要过滤掉已经学习过的单词 
    const history = JSON.parse(localStorage.getItem('history')!)
    b.forEach((item: string, index: number, arr: string[]) => {
        if (history[item] && history[item] > 0) {
            debugger
            arr.splice(index, 1);
        }
    });
    console.log('deleted studyed words list:', b)

    return b.slice(0, limit)
}

const recountHistory = (currentDate: string, beforeDate: string) => {
    if (currentDate > beforeDate) {
        console.log('funcs -> recountHistory')
        // 后续需要过滤掉已经学习过的单词 
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


const getWordCololectionsNameList = async () => await req(`${apiBaseUrl}/static/collection/names.json`)

export {
    apiBaseUrl,
    req,
    getWordsCololection,
    buildTodayWords,
    getWordCololectionsNameList,
    getConfigCache,
    recountHistory,
}

export type {
    Config
}