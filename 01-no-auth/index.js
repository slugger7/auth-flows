const express = require('express')
const path = require('path')

const app = express()
const port = 3000

app.use(express.static('public'))

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.listen(port, () => {
  console.log(`No Authentication app listening on port: ${port}`)
})