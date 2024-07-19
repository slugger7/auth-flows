const COOKIE_KEY = 'cookie-auth'

const login = async () => {
  const username = document.getElementById('username-input').value
  const password = document.getElementById('password-input').value

  try {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const response = await fetch("/api/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ username, password })
    })

    if (!response.ok && (response.status === 401 || response.status === 403)) {
      console.log(`Colud not authenticate: ${await response.text()}`)
      return
    }

    console.log("Authenticated")
    setLoggedIn()
  } catch (err) {
    console.error(`Something went wrong while authenticating: ${err.message}`)
  }
}

const logout = async () => {
  try {
    const response = await fetch("/api/logout")

    if (response.ok) {
      console.log("Successfully logged out")
      setLoggedOut()
    } else {
      console.error(`Something went wrong logging you out: ${response.status} ${await response.text()}`)
    }
  } catch (err) {
    console.error(`Could not log out: ${err.message}`)
  }
}

const fetchAuthenticatedData = async () => {

  const response = await fetch("/api/authenticated")

  if (!response.ok) {
    console.error("Something went wrong fetching the secret data")

    if (response.status === 401) {
      localStorage.clear()
      return setLoggedOut()
    }
  }

  const content = await response.json()

  document.getElementById('active-area').innerHTML = `<pre>${JSON.stringify(content, null, 2)}</pre>
    <button onclick="fetchAuthenticatedData()">Fetch authenticated Data</button>
    <button onclick="logout()">Logout</button>`
}

const setLoggedOut = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<h4>Username</h4>
    <input id="username-input" />
    <h4>Password</h4>
    <input id="password-input" type="password" />
    <button onclick="login()">Login</button>`
}

const setLoggedIn = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<p>Waiting for secret data</p>
    <button onclick="fetchAuthenticatedData()">Fetch authenticated Data</button>
    <button onclick="logout()">Logout</button>`
}

const getCookie = () => {
  const cookiesUparsed = document.cookie
  if (!cookiesUparsed) { return }

  const parsedCookes = cookiesUparsed.split('; ')
    .map(cookie => cookie.split('='))

  console.log({ parsedCookes })

  const cookie = parsedCookes.find(([key]) => key === COOKIE_KEY)

  console.log({ cookie })

  return cookie[1]
}

if (getCookie()) {
  setLoggedIn()
} else {
  setLoggedOut()
}