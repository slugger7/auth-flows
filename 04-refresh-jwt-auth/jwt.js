const jwt = require('jsonwebtoken')

const TOKEN_SECRET = process.env.TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

const generateTokenPair = (accessTokenDetails, refreshTokenDetails) => ({
  accessToken: jwt.sign(accessTokenDetails, TOKEN_SECRET, { expiresIn: '10s' }),
  refreshToken: jwt.sign(refreshTokenDetails, REFRESH_TOKEN_SECRET, { expiresIn: '60s' })
})

const authenticateAccessToken = (req, res, next) => {
  console.log("Authenticating access token")
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
        return res.status(401).send('Could not verify token')
      }

      req.user = user

      next()
    })
  } else {
    return res.status(401).send('No authentication header provided')
  }
}

const authenticateRefreshToken = (req, res, next) => {
  console.log("Authenticating refresh token")
  const authHeader = req.headers.authorization
  console.log("Auth header: ", authHeader)

  if (authHeader) {
    const [method, token] = authHeader.split(' ')

    if (method.toLowerCase() !== "bearer" && token == null) {
      return res.status(401).send("No token provided")
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(`JWT verification error: ${err}`)
        return res.status(401).send('Could not verify token')
      }

      req.user = user

      next()
    })
  } else {
    return res.status(401).send('No authentication header provided')
  }
}

module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateTokenPair
}