const express = require('express')
require('dotenv').config()
const { generateTokenPair, authenticateToken } = require("./jwt")

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.post("/api/login", (req, res) => {
  console.log({ url: req.url, body: req.body })
  const { username, password } = req.body

  if (username?.toLowerCase() === "admin" && password === "pass") {

    return res.json(generateTokenPair({ username }, { tokenId: 1 }))
  }

  res.status(401).send("Not authenticated")
})

app.po

app.get("/api/authenticated", authenticateToken, (req, res) => {
  console.log("getting authenticated data")
  res.json({ secured: "data", username: req.user.username });
})

app.listen(port, () => {
  console.log(`JWT Authentication app listening on port: ${port}`)
})