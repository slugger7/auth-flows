const express = require('express')

const app = express()
const port = 3000

app.use(express.static('public'))

app.get("/", (_, res) => {
  res.redirect('index.html')
})

app.get("/api/authenticated", (req, res) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const [method, usernamePasswordBase64] = authHeader.split(' ');
    console.log(`Method: ${method}`)

    if (method !== null && method.toLowerCase() == "basic" && usernamePasswordBase64) {
      const [username, password] = atob(usernamePasswordBase64).split(':')

      console.log({ username, password })

      if (username.toLocaleLowerCase() === "kevin" && password.toLowerCase() === "admin") {
        return res.status(200)
          .send("This string is protected by basic auth")
      }
    }
  }

  console.log("Not authenticated. Sending back authentication header")

  res.header("WWW-Authenticate", "Basic realm=401")
  res.status(401).send("Authentication required")
})

app.get("/api/logout", (req, res) => {
  res.header("WWW-Authenticate", "Basic realm=401")
  res.status(401).send("Logged out")
})

app.listen(port, () => {
  console.log(`Basic Authentication app listening on port: ${port}`)
})