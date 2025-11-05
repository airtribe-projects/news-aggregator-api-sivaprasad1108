// News controller: supports GNews via GNEWS_API_KEY or a generic provider via NEWS_API_URL/NEWS_API_KEY
const axios = require('axios')

const cache = {}
const NEWS_CACHE_TTL = Number(process.env.NEWS_CACHE_TTL_SECONDS || 60)

async function getNews(req, res, next) {
    const prefs = (req.user.preferences || []).join(',') || 'news'
    const cacheKey = `news:${prefs}`
    const now = Date.now()
    const cached = cache[cacheKey]
    if (cached && (now - cached.ts) < NEWS_CACHE_TTL * 1000) {
        return res.status(200).send({ news: cached.data })
    }

    const gnewsKey = process.env.GNEWS_API_KEY || null
    const apiKey = process.env.NEWS_API_KEY || null

    if (gnewsKey) {
        try {
            const q = (req.user.preferences || []).join(' OR ') || 'news'
            const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&token=${gnewsKey}&lang=en&max=10`
            const resp = await axios.get(url, { timeout: 5000 })
            const body = resp.data || {}
            const articles = body.articles || []
            cache[cacheKey] = { ts: now, data: articles }
            // console.log(articles,"articles")
            
            return res.status(200).send({ news: articles })
        } catch (err) {
            console.warn('GNews fetch failed, falling back to mock data', err && err.message ? err.message : err)
            // continue to fallback
        }
    }

    if (apiKey && process.env.NEWS_API_URL) {
        try {
            const url = `${process.env.NEWS_API_URL}?q=${encodeURIComponent((req.user.preferences || []).join(' OR ') || 'news')}&apiKey=${apiKey}`
            const resp = await axios.get(url, { timeout: 5000 })
            const body = resp.data || {}
            const articles = body.articles || []
            cache[cacheKey] = { ts: now, data: articles }
            return res.status(200).send({ news: articles })
        } catch (err) {
            console.warn('News API fetch failed, falling back to mock data', err && err.message ? err.message : err)
        }
    }

    const mock = [
        { title: 'Welcome to the News Aggregator', source: 'local', url: '' }
    ]
    cache[cacheKey] = { ts: now, data: mock }
    return res.status(200).send({ news: mock })
}

module.exports = { getNews }
