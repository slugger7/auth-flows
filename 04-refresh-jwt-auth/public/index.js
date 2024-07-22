const REFRESH_TOKEN = "refreshToken"
const ACCESS_TOKEN = "accessToken"

let timer

const setupRefresh = () => {
  console.log("Setting up interval")
  timer = setInterval(refreshTokenPair, 8 * 1000)
}

const saveTokenPair = (accessToken, refreshToken) => {
  console.log("Saving token pair", { accessToken, refreshToken })

  localStorage.setItem(ACCESS_TOKEN, accessToken)
  localStorage.setItem(REFRESH_TOKEN, refreshToken)
}

const refreshTokenPair = async () => {
  console.log("Refreshing Token")

  const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN)

  const headers = new Headers()
  headers.append("Authorization", `Bearer ${currentRefreshToken}`)

  const response = await fetch("/api/refresh-tokens", {
    method: "POST",
    headers
  })

  if (!response.ok) {
    console.error("Could not refresh tokens", response.status)
    if (response.status === 401) {
      localStorage.clear()
      setLoggedOut()
    }
  }

  const { accessToken, refreshToken } = await response.json()

  saveTokenPair(accessToken, refreshToken)
}

const login = async () => {
  const username = document.getElementById('username-input').value
  const password = document.getElementById('password-input').value

  console.log({ username, password })

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers
  })

  if (!response.ok) {
    alert("Not authenticated")
    return
  }

  const { accessToken, refreshToken } = await response.json();

  // think carefully where you store these tokens
  saveTokenPair(accessToken, refreshToken)

  setupRefresh()

  setLoggedIn()
}

const fetchAuthenticatedData = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN)

  if (token) {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${token}`)

    const response = await fetch("/api/authenticated", {
      headers
    })

    if (!response.ok) {
      console.error("Something went wrong fetching the secret data", response.status)
      if (response.status === 401) {
        localStorage.clear()
        return setLoggedOut()
      }
    }

    const content = await response.json()

    document.getElementById('active-area').innerHTML = `<pre>${JSON.stringify(content, null, 2)}</pre>
    <button onclick="fetchAuthenticatedData()">Fetch authenticated Data</button>`
  }
}

const setLoggedIn = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<p>Waiting for secret data</p>
    <button onclick="fetchAuthenticatedData()">Fetch authenticated Data</button>`

  setupRefresh()
}

const setLoggedOut = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<h4>Username</h4>
    <input id="username-input" />
    <h4>Password</h4>
    <input id="password-input" type="password" />
    <button onclick="login()">Login</button>`
  clearInterval(timer)
}

if (localStorage.getItem(ACCESS_TOKEN) && localStorage.getItem(REFRESH_TOKEN)) {
  setLoggedIn()
} else {
  setLoggedOut()
}


// The spice section
let savedRefreshToken
const saveCurrentRefreshToken = () => {
  savedRefreshToken = localStorage.getItem(REFRESH_TOKEN)
}

const injectSavedRefreshToken = () => {
  localStorage.setItem(REFRESH_TOKEN, savedRefreshToken)
}