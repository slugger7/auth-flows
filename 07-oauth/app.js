const express = require('express')
const { authenticateToken } = require('./jwt')
require('dotenv').config()

const app = express()
const port = 3000

app.use(express.static('app'))
app.use(express.json())

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.get("/api/auth", (req, res) => {
  const { authorizationCode } = req.query

  res.redirect(`/?authorizationCode=${authorizationCode}`)
})

app.get("/api/authenticated", authenticateToken, (req, res) => {
  res.json({
    secured: true,
    balance: "$1,000,000,000"
  })
})

app.listen(port, () => {
  console.log(`Oauth app listening on port ${port}`)
})