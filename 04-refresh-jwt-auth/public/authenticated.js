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

  const { token } = await response.json();

  console.log({ token })

  // think carefully where you store this token
  localStorage.setItem("token", token)

  setLoggedIn()
}

const fetchAuthenticatedData = async () => {
  const token = localStorage.getItem("token")

  if (token) {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${token}`)

    const response = await fetch("/api/authenticated", {
      headers
    })

    if (!response.ok) {
      console.error("Something went wrong fetching the secret data")
    }

    const content = await response.json()

    document.getElementById('active-area').innerHTML = `<pre>${JSON.stringify(content, null, 2)}</pre>`
  }
}

const setLoggedIn = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<p>Waiting for secret data</p>
    <button onclick="fetchAuthenticatedData()">Fetch authenticated Data</button>`
}

const setLoggedOut = () => {
  const parent = document.getElementById('active-area')
  parent.innerHTML = `<h4>Username</h4>
    <input id="username-input" />
    <h4>Password</h4>
    <input id="password-input" type="password" />
    <button onclick="login()">Login</button>`
}

if (localStorage.getItem("token")) {
  setLoggedIn()
} else {
  setLoggedOut()
}