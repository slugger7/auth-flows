const express = require('express')

const app = express()
const port = 3000

app.use(express.static('public'))

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.listen(port, () => {
  console.log(`No Authentication app listening on port: ${port}`)
})