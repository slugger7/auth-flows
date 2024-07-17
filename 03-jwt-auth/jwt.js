const jwt = require('jsonwebtoken')

const TOKEN_SECRET = process.env.TOKEN_SECRET

const generateAccessToken = (details) => {
  return jwt.sign(details, TOKEN_SECRET, { expiresIn: '1800s' })
}

const authenticateToken = (req, res, next) => {
  console.log("Authenticating token")
  const authHeader = req.headers.authorization
  console.log("Auth header: ", authHeader)

  if (authHeader) {
    const [method, token] = authHeader.split(' ')

    if (method.toLowerCase() !== "bearer" && token == null) {
      return res.status(401).send("No token provided")
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(`JWT verification error: ${err}`)
        return res.status(403).send('Could not verify token')
      }

      req.user = user

      next()
    })
  } else {
    return res.status(401).send('No authentication header provided')
  }
}

module.exports = {
  authenticateToken,
  generateAccessToken
}