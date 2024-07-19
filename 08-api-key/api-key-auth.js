const { getToken } = require("./db")


const validateApiKey = async (req, res, next) => {
  const tokenHeader = req.get("Api-Key")

  console.log({ tokenHeader })

  try {
    const token = await getToken(tokenHeader)

    if (token && !token.invalid) {
      console.log("Token is valid")

      return next()
    }

    return res.status(401).send("Token invalid")
  } catch (err) {
    console.error(`Could not validate the api key: ${tokenHeader}, ${err.message}`)
  }

  next()
}

module.exports = {
  validateApiKey
}