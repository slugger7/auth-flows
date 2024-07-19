const nedb = require('nedb-promise')

const db = new nedb()

const expirationTime = 5 * 1000

const createToken = async (username) => {
  try {
    const newToken = await db.insert({ exp: Date.now() + (expirationTime), username })

    return newToken
  } catch (err) {
    console.error(`Could not create new token: ${username}, ${err.message}`)
    throw err
  }
}

const getToken = async (tokenId) => {
  try {
    const token = await db.findOne({ _id: tokenId })

    return token
  } catch (err) {
    console.log(`Could not find token: ${tokenId}, ${err.message}`)
  }
}

const invalidateToken = async (tokenId) => {
  try {
    const result = await db.update({ _id: tokenId }, { $set: { invalid: true } }, {});

    console.log("Rows updated: ", result)
  } catch (err) {
    console.log(`Colud not invalidate token: ${tokenId}, ${err.message}`)
  }
}

module.exports = {
  createToken,
  getToken,
  invalidateToken
}