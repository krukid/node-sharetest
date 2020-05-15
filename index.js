const PORT = 3000

const util = require('util')
const qs = require('querystring')
const express = require('express')
const request = require('request')
const requestp = util.promisify(request)
const jq = require('node-jq')
const gm = require('gm').subClass({imageMagick: true})
const getParams = require('./params').getParams

const app = express()

app.set('view engine', 'pug')

app.use(express.static('static'))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/crop', function(req, res) {
  const {url, crop, gravity} = getParams(req.query, {
    url: 'url',
    crop: 'geometry',
    gravity: 'gravity'
  })
  gm(request(url))
    .gravity(gravity)
    .out('-crop', crop)
    .stream('png')
    .pipe(res)
})

app.get('/story', function(req, res) {
  const {url, crop, gravity} = getParams(req.query, {
    url: 'url',
    crop: 'geometry',
    gravity: 'gravity'
  })
  const query = qs.stringify({url, crop, gravity})
  const img = `/crop?${query}`
  res.render('story', {img, url: req.url})
})

app.get('/urls', async function(req, res) {
  const {url, filter} = getParams(req.query, {
    url: 'url',
    filter: 'string'
  })
  const {body} = await requestp(url)
  const urls = await jq.run(filter, body, {input: 'string'})
  res.status(200).type('json').send(urls)
})

app.get('/', function(req, res) {
  res.render('index')
})

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}...`)
})
