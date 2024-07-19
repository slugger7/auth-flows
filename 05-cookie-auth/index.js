const express = require('express')
const cookieparser = require('cookie-parser')
require('dotenv').config()

const { createToken, invalidateToken } = require('./db')
const { authenticateCookie } = require('./cookie')

const COOKIE_SECRET = process.env.COOKIE_SECRET
const COOKIE_KEY = process.env.COOKIE_KEY

const cookieOptions = {
  maxAge: 60 * 1000,
  signed: true
}

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())
app.use(cookieparser(COOKIE_SECRET))

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.post("/api/login", async (req, res) => {
  console.log({ url: req.url, body: req.body })
  const { username, password } = req.body

  if (username?.toLowerCase() === "admin" && password === "pass") {
    const token = await createToken(username)
    return res.cookie(COOKIE_KEY, token._id, cookieOptions).send("Ok")
  }

  res.status(401).send("Not authenticated")
})

app.get("/api/logout", async (req, res) => {
  console.log("Logging out")
  const cookie = req.sessionId
  console.log({ cookie })

  await invalidateToken(cookie)

  res.clearCookie(COOKIE_KEY)
  res.sendStatus(200)
})

app.get("/api/authenticated", authenticateCookie, (req, res) => {
  console.log("We can see the authenticated data")

  res.json({
    secret: "something",
    balance: "$1,000,000,000"
  })
})

app.listen(port, () => {
  console.log(`Cookie Authentication app listening on port: ${port}`)
})