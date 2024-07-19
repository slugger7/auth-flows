const nedb = require('nedb-promise')

const db = new nedb()

const storeChallenge = async (challengeCode) => {
  try {
    const storedChallenge = await db.insert({ challengeCode })

    console.log({ storedChallenge })
  } catch (err) {
    console.error(`Could not store challeng: ${challengeCode}, ${err.message}`)
  }
}

const createAuthorizationCode = async (username) => {
  try {
    const authorizationCode = require('crypto').randomBytes(64).toString('hex')

    const record = await db.insert({ authorizationCode, username })

    return record
  } catch (err) {
    console.error(`Could not generate and save authorization code: ${username}, ${err.message}`)
    throw err
  }
}

const verifyChallengeAndAuthorizationCode = async (challengeCode, authorizationCode) => {
  try {
    const challengeRecord = await db.findOne({ challengeCode })

    if (challengeRecord) {
      const authCodeRecord = await db.findOne({ authorizationCode })

      if (authCodeRecord) {
        return { authorizationCode: authCodeRecord, challengeCode: challengeRecord }
      }
    }
    throw new Error("Could not find auth record or challeng")
  } catch (err) {
    console.error(`Colud not verify challeng code or authorization code: ${challengeCode}, ${authorizationCode}, ${err.message}`)
    throw err
  }
}

module.exports = {
  storeChallenge,
  createAuthorizationCode,
  verifyChallengeAndAuthorizationCode
}