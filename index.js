const PORT = 3000

const util = require('util')
const qs = require('querystring')
const express = require('express')
const request = require('request')
const requestp = util.promisify(request)
const jq = require('node-jq')
const gm = require('gm').subClass({imageMagick: true})

const app = express()

app.set('view engine', 'pug')

app.use(express.static('static'))

app.get('/crop', function(req, res) {
  const {url, crop, gravity} = req.query
  gm(request(url))
    .gravity(gravity)
    .out('-crop', crop)
    .stream('png')
    .pipe(res)
})

app.get('/story', function(req, res) {
  const {url, crop, gravity} = req.query
  const query = qs.stringify({url, crop, gravity})
  const img = `/crop?${query}`
  res.render('story', {img})
})

app.get('/urls', async function(req, res) {
  const {url, filter} = req.query
  const {body} = await requestp(url)
  const urls = await jq.run(filter, body, {input: 'string'})
  res.status(200).type('json').send(urls)
})

/**
 * 1. fetch by url + jq filter image urls into select
 * 2. parse crop query 0,100,100%,200
 * 3. render into frame, create share link
 */

app.get('/', function(req, res) {
  res.render('index')
})

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}...`)
})
