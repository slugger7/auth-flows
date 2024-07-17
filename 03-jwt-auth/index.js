const express = require('express')
require('dotenv').config()
const { generateAccessToken, authenticateToken } = require("./jwt")

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.post("/api/login", (req, res) => {
  console.log({ body: req.body })
  const { username, password } = req.body

  if (username?.toLowerCase() === "kevin" && password === "admin") {
    const token = generateAccessToken({ username, something: "else" })

    return res.json({ token })
  }

  res.status(401).send("Not authenticated")
})

app.get("/api/authenticated", authenticateToken, (req, res) => {
  res.json({ secured: "data" });
})

app.listen(port, () => {
  console.log(`JWT Authentication app listening on port: ${port}`)
})