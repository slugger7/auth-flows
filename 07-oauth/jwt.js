const jwt = require("jsonwebtoken")

const TOKEN_SECRET = process.env.TOKEN_SECRET
const generateAccessToken = (details) => {
  return jwt.sign(details, TOKEN_SECRET, { expiresIn: '1800s' })
}

const hashCodeVerifier = async (codeVerifier) => {
  const encoder = new TextEncoder()

  const data = encoder.encode(codeVerifier)

  const hashBuffer = await require('crypto').subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  const codeChallenge = hashArray.map(b => b.toString(16).padStart(2, "0"))
    .join("")

  return codeChallenge
}

const authenticateToken = (req, res, next) => {
  console.log("Authenticating token")
  const authHeader = req.headers.authorization

  if (authHeader) {
    const [method, token] = authHeader.split(' ')

    if (method.toLowerCase() !== "bearer" && token == null) {
      return res.status(401).send("No token provided")
    }

    // instead of sharing the secrte a JWK setup would be ideal
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
  hashCodeVerifier,
  generateAccessToken,
  authenticateToken
}