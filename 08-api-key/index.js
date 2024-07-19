const express = require('express')

const { createApiToken, invalidateToken } = require("./db")
const { validateApiKey } = require('./api-key-auth')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.post("/api/create-token", async (req, res) => {
  try {
    const newToken = await createApiToken(req.body.org)

    return res.json({ apiKey: newToken._id })
  } catch (err) {
    console.error(`Could not create a new api token: ${err.message}`)
  }
  res.status(400).send("Could not create api key")
})

app.delete("/api/invalidate-token", async (req, res) => {
  const tokenHeader = req.get("Api-Key")

  if (tokenHeader) {
    try {
      await invalidateToken(tokenHeader)

      res.sendStatus(200)
    } catch (err) {
      console.error(`Colud not invalidate token: ${tokenHeader}, ${err.message}`)
      res.status(400).send("Could not invalidate token")
    }
  } else {
    res.status(400).send("No api key provided")
  }
})

app.get("/api/authenticated", validateApiKey, (req, res) => {
  console.log("Sending authenticated data")

  res.json({
    secure: true,
    balance: "$1,000,000,000"
  })
})

app.listen(port, () => {
  console.log(`API Key Authentication app listening on port: ${port}`)
})