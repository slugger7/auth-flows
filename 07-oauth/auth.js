const express = require('express')
require('dotenv').config()
const cors = require('cors')

const { storeChallenge, createAuthorizationCode, verifyChallengeAndAuthorizationCode } = require('./auth-db')
const { hashCodeVerifier, generateAccessToken } = require("./jwt")

const app = express()
const port = 8080

app.use(express.static('auth'))
app.use(express.json())
app.use(cors())

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.get("/api/authorize", async (req, res) => {
  const { challenge, redirect } = req.query
  console.log({ challenge })

  await storeChallenge(challenge)

  res.redirect(`/?redirect=${encodeURIComponent(redirect)}`)
})

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body
  console.log({ username, password })
  if (username?.toLowerCase() === "admin" && password === "pass") {
    const authCode = await createAuthorizationCode(username)

    console.log({ authCode })
    res.json(authCode)
  }
})

app.post("/api/authenticate", async (req, res) => {
  const { authorizationCode, codeVerifier } = req.body

  console.log({ authorizationCode, codeVerifier })

  const codeChallenge = await hashCodeVerifier(codeVerifier)

  try {
    const authenticationInformation = await verifyChallengeAndAuthorizationCode(codeChallenge, authorizationCode)

    const token = generateAccessToken(authenticationInformation)

    return res.json({ accessToken: token })
  } catch (err) {
    console.error(`Could not verify challenges or create jwt: ${err.message}`)
  }

  res.status(401).send("Could not authenticate")
})

app.listen(port, () => {
  console.log(`Auth app listening on port ${port}`)
})