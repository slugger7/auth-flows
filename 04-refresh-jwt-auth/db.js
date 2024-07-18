const nedb = require('nedb-promise')
const util = require('util')

let db = new nedb();

// const insert = util.promisify(db.insert)
const findOne = util.promisify(db.findOne)
const update = util.promisify(db.update)


const createRefreshToken = async (username) => {
  try {
    const newRefreshToken = await db.insert({ username })
    return { id: newRefreshToken._id }
  } catch (err) {
    console.error(`Something went wrong creating a refresh token chain: ${err.message}`)
  }
}

const createNewRefreshToken = async (tokenId) => {
  try {
    const currentToken = await db.findOne({ _id: tokenId })
    console.log({ currentToken })

    if (!currentToken.used) {
      try {
        const newToken = await db.insert({ username: currentToken.username, parent: currentToken._id })

        try {
          await db.update({ _id: tokenId }, { $set: { used: true } }, {})

          return { id: newToken._id }
        } catch (err) {
          console.error(`Something went wrong updating the old token: ${err.message}`)
        }
      } catch (err) {
        console.error(`Could not create token from a token: ${err.message}`)
      }
    } else {
      console.log("Invalidating token chain")
      invalidateTokenChain(currentToken._id, (success) => {
        if (!success) {
          console.error(`Something went wrong invalidating the chain`)
        }
      })
      throw new Error("Not authenticated")
    }
  } catch (err) {
    console.log(`Something went wrong finding the token: ${err.message}`)
  }
}

const invalidateTokenChain = async (tokenId) => {
  try {
    const token = await db.findOne({ parent: tokenId })

    console.log({ invalidatingToken: token })

    if (token) {
      try {
        await db.update({ _id: token._id }, { $set: { used: true } }, {})

        invalidateTokenChain(token._id)
      } catch (err) {
        console.error(`Something went wrong invalidating token ${token._id}, ${updateErr.message}`)

        throw new Error("Update error")
      }
    }
  } catch (err) {
    console.error(`Something went wrong finding child: ${tokenId}, ${findErr.message}`)
    throw new Error("Could not find token")
  }
}

module.exports = {
  createRefreshToken,
  createNewRefreshToken
}