const PORT = 3000

const qs = require('querystring')
const express = require('express')
const request = require('request')
const gm = require('gm').subClass({imageMagick: true})

const app = express()

app.use(express.static('static'))

app.get('/crop', function(req, res) {
  const {w, h, x, y, url} = req.query
  gm(request(url))
    .crop(w, h, x, y)
    .stream('png')
    .pipe(res)
})

app.get('/story', function(req, res) {
  const {w, h, x, y, url} = req.query
  const query = qs.stringify({w, h, x, y, url})
  const img = `/crop?${query}`
  res.type('html').status(200).send(`
   <!doctype html>
   <html>
   <head>
     <title>This is a story of image ${img}</title>
     <meta property="vk:image" content="${img}">
   </head>
   <body>
     <img src="${img}">
   </body>
   </html>
  `)
})

app.get('/', function(req, res) {
  res.type('html').status(200).send(`
    <!doctype html>
    <html>
    <body>
      <form target="_blank" action="/story" method="GET">
        <h1>Story generator</h1>
        <label>Story image URL</label>
        <br><input name="url">
        <br><label>Crop Y</label>
        <br><input name="y">
        <input type="hidden" name="x" value="0">
        <input type="hidden" name="w" value="360">
        <input type="hidden" name="h" value="100">
        <button>Create</button>
      </form>
    </body>
    </html>
  `)
})

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}...`)
})
