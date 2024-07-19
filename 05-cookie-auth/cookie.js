const { getToken } = require('./db')

const COOKIE_KEY = process.env.COOKIE_KEY

const authenticateCookie = async (req, res, next) => {
  const cookie = req.signedCookies[COOKIE_KEY]

  console.log({ cookie })
  if (cookie) {
    try {
      const token = await getToken(cookie)

      console.log({ token })

      if (token.exp > Date.now()) {
        console.log("Cookie is still valid")

        return next()
      } else {
        console.log("Cookie has expired")

        res.clearCookie(COOKIE_KEY)
        return res.status(401).send("Expired cookie")
      }
    } catch (err) {
      console.log(`Could not  get token from cookie: ${cookie}, ${err.message}`)
    }
  }

  res.status(401).send("No cookie provided")
}

module.exports = {
  authenticateCookie
}