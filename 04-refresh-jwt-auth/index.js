const express = require('express')
require('dotenv').config()

const { generateTokenPair, authenticateAccessToken, authenticateRefreshToken } = require("./jwt")
const { createRefreshToken, createNewRefreshToken } = require("./db")

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

    return createRefreshToken(username, (refreshToken) => {
      console.log("Created refresh token", { refreshToken })
      return res.json(generateTokenPair({ username }, refreshToken))
    })

  }

  res.status(401).send("Not authenticated")
})

app.post("/api/refresh-tokens", authenticateRefreshToken, (req, res) => {
  console.log("Refreshing tokens")

  console.log(req.user)
  createNewRefreshToken(req.user.id, (err, refreshToken) => {
    if (err) {
      console.log(err.message)
      return res.status(401).send("Invalid token")
    }

    console.log({ refreshToken })
    return res.json(generateTokenPair({ username: "admin" }, refreshToken))
  })
})

app.get("/api/authenticated", authenticateAccessToken, (req, res) => {
  console.log("Getting authenticated data")
  res.json({ secured: "data", username: req.user.username });
})

app.listen(port, () => {
  console.log(`JWT Authentication app listening on port: ${port}`)
})