
const apiBaseUrl = 'https://api.words.imhcg.cn'

const req = async (url: string) => {
    const resp = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "x-api-code": String(localStorage.getItem("x-api-code")),
        }
    })
    if (resp.status != 200) {
        if (resp.status >= 400 && resp.status < 500) {
            location.assign("/#/");
        }
        else {
            alert(`sorry\nerror code ${resp.status}`)
        }
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
    const r = localStorage.getItem(`words->${collectionName}`);
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
    let a = await getWordsCololection(collectionName) as string[]
    // 需要过滤掉已经学习过的单词 
    const history = JSON.parse(localStorage.getItem('history')!)
    a.forEach((item: string, index: number, arr: string[]) => {
        if (history[item] && history[item] > 0) {
            arr.splice(index, 1);
        }
    });

    if (a.length < limit) {
        limit = a.length
    }

    let b: [string,string][] = []
    if (getConfigCache().random) {
        a = a.sort(() => Math.random() - 0.5)
    }
    a.slice(0, limit).forEach((item: string) => {
        b.push([item,""])
    })
    const wordsWithFrequence = await addWordsFrequence(b)
    console.log("buildTodayWords",b,wordsWithFrequence)
    return wordsWithFrequence
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


const addWordsFrequence = async (words: [string,string][]) => {
        let queryWords = ""
        words.forEach((w)=>{

            if (queryWords.length == 0){
                queryWords +=  w[0]
            }else{
                queryWords +=  "," + w[0]
            }
        })
        const resp = await req(`${apiBaseUrl}/db/frequence?words=${queryWords}`) as string[]
        if (resp) {
            console.log('getWordsFrequence',queryWords,resp)
            resp.forEach((useages,index)=>{
                words[index] = [words[index][0],useages]
            })
        }
        return words
}

export {
    apiBaseUrl,
    req,
    getWordsCololection,
    buildTodayWords,
    getWordCololectionsNameList,
    getConfigCache,
    recountHistory,
    addWordsFrequence,
}

export type {
    Config
}