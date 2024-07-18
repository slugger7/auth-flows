const nedb = require('nedb')

let db = new nedb();

const createRefreshToken = (username, callback) => {
  db.insert({ username }, (err, newRefreshToken) => {
    if (err) {
      console.error(`Something went wrong creating a refresh token chain: ${err.message}`)
    }

    callback({ id: newRefreshToken._id })
  })
}

const createNewRefreshToken = (tokenId, callback) => {
  db.findOne({ _id: tokenId }, (findErr, currentToken) => {
    if (findErr) {
      console.log(`Something went wrong finding the token: ${findErr.message}`)
    }

    console.log({ currentToken })
    if (!currentToken.used) {
      db.insert({ username: currentToken.username, parent: currentToken._id }, (insertErr, newToken) => {
        if (insertErr) {
          console.error(`Could not create token from a token: ${insertErr.message}`)
        }

        db.update({ _id: tokenId }, { $set: { used: true } }, {}, (updateErr, numUpdated) => {
          if (updateErr) {
            console.error(`Something went wrong updating the old token: ${updateErr.message}`)
          }

          callback(null, { id: newToken._id })
        })
      })
    } else {
      console.log("Invalidating token chain")
      invalidateTokenChain(currentToken._id, (success) => {
        if (!success) {
          console.error(`Something went wrong invalidating the chain`)
        }
      })
      callback(new Error("Not authenticated"))
    }
  })
}

const invalidateTokenChain = (tokenId, callback) => {
  db.findOne({ parent: tokenId }, (findErr, token) => {
    if (findErr) {
      console.error(`Something went wrong finding child: ${tokenId}, ${findErr.message}`)
      callback(false)
    }

    console.log({ invalidatingToken: token })
    if (!token) {
      console.log("Invalidated token chain")
      return callback(true)
    }

    db.update({ _id: token._id }, { $set: { used: true } }, {}, (updateErr) => {
      if (updateErr) {
        console.error(`Something went wrong invalidating token ${token._id}, ${updateErr.message}`)
        callback(false)
      }

      invalidateTokenChain(token._id, callback)
    })
  })
}



module.exports = {
  createRefreshToken,
  createNewRefreshToken
}