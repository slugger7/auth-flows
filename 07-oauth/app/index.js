
const login = async () => {
  const codeVerifier = window.crypto.randomUUID()

  const encoder = new TextEncoder()

  const data = encoder.encode(codeVerifier)

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  const codeChallenge = hashArray.map(b => b.toString(16).padStart(2, "0"))
    .join("")

  localStorage.setItem("code_verifier", codeVerifier)

  console.log({ code: codeVerifier, hashHex: codeChallenge })

  window.location.href = `http://localhost:8080/api/authorize?challenge=${codeChallenge}&redirect=${btoa("http://localhost:3000/api/auth")}`
}

const fetchAuthenticatedData = async () => {
  try {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${localStorage.getItem("accessToken")}`)

    const response = await fetch("/api/authenticated", {
      headers
    })

    if (response.ok) {
      document.getElementById("data").innerHTML = JSON.stringify(await response.json(), null, 2)
    } else {
      if (response.status === 401) {
        localStorage.clear()

        throw new Error("Not authenticated")
      }
    }
  } catch (err) {
    console.error(`Could not fetch authenticated data: ${err.message}`)
  }
}

const exchangeAuthorizationCode = async (authorizationCode) => {
  const codeVerifier = localStorage.getItem("code_verifier")

  try {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const response = await fetch("http://localhost:8080/api/authenticate", {
      method: "POST",
      body: JSON.stringify({ authorizationCode, codeVerifier }),
      headers
    })

    if (response.ok) {
      console.log("Response ok")
      const { accessToken } = await response.json()

      console.log({ accessToken })
      localStorage.clear()
      localStorage.setItem("accessToken", accessToken)

      setLoggedIn()
    } else {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
    }
  } catch (err) {
    console.error(`Could not exchange authorization code for token: ${authorizationCode}, ${err.message}`)
  }
}

const setLoggedIn = () => {
  document.getElementById("loading").innerHTML = `<p>Authenticated</p>
      <pre id="data"></pre>
      <button onclick="fetchAuthenticatedData()">Fetch authenticated data</button>`
}

const setLoggedOut = () => {
  document.getElementById("loading").innerHTML = ''
}

if (localStorage.getItem("accessToken")) {
  setLoggedIn()
} else {
  setLoggedOut()
}



const handleAuthorizationCode = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const authorizationCode = urlParams.get("authorizationCode")

  if (authorizationCode) {
    console.log("We have a authorization code")

    document.getElementById("loading").innerHTML = '<p>Exchanging authorization code for token</p>'
    await exchangeAuthorizationCode(authorizationCode)

    window.location.replace("/")
  }
}

handleAuthorizationCode()