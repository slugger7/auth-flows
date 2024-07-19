const nedb = require('nedb-promise')

let db = new nedb();

const createApiToken = async (org) => {
  console.log("Creating new api token")
  try {
    const newToken = await db.insert({ org })

    console.log({ newToken })
    return newToken
  } catch (err) {
    console.error(`Could not create API token: ${org}, ${err.message}`)
  }
}

const getToken = async (key) => {
  console.log("Getting token")
  try {
    const token = await db.findOne({ _id: key })

    console.log({ token })
    return token
  } catch (err) {
    console.error(`Could not get the token: ${key}, ${err.message}`)
  }
}

const invalidateToken = async (key) => {
  console.log("Invalidating token")
  try {
    const updatedRows = await db.update({ _id: key }, { $set: { invalid: true } }, {})

    console.log({ updatedRows })
  } catch (err) {
    console.error(`Could not invalidate the token: ${key}, err.message`)
    throw err
  }
}

module.exports = {
  createApiToken,
  getToken,
  invalidateToken
}