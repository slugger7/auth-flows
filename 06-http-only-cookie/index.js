const express = require('express')
const cookieparser = require('cookie-parser')
require('dotenv').config()

const { createToken, invalidateToken, getToken } = require('./db')
const { authenticateCookie } = require('./cookie')

const COOKIE_SECRET = process.env.COOKIE_SECRET
const COOKIE_KEY = process.env.COOKIE_KEY
const COOKIE_LIFE = process.env.COOKIE_LIFE

const expirationTime = COOKIE_LIFE * 1000

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
    const expirationDate = new Date(Date.now() + expirationTime)

    const token = await createToken(username, expirationDate)

    return res.cookie(COOKIE_KEY, token._id, {
      expires: expirationDate,
      signed: true,
      sameSite: true,
      httpOnly: true
    }).send("Ok")
  }

  res.status(401).send("Not authenticated")
})

app.get("/api/logged-in", authenticateCookie, async (req, res) => {
  try {
    const sessionId = req.sessionId

    console.log({ sessionId })

    res.json({ username: "admin", sessionId })
  } catch (err) {
    console.error(`Colud not get logged in status: ${err.message}`)
  }

  res.status(401).send("No valid session")
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
  console.log(`HTTP Only Cookie Authentication app listening on port: ${port}`)
})