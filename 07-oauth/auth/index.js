const login = async () => {
  console.log("Logging in")
  const username = document.getElementById('username-input').value
  const password = document.getElementById('password-input').value

  const headers = new Headers()
  headers.append("Content-Type", "application/json")

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers
    })

    if (!response.ok) {
      alert("Not authenticated")
      return
    }

    const responseData = await response.json()

    console.log({ responseData })

    const urlParams = new URLSearchParams(window.location.search)
    const redirect = atob(urlParams.get("redirect"))

    console.log({ redirect })

    window.location.href = `${redirect}?authorizationCode=${responseData.authorizationCode}`
  } catch (err) {
    console.error(`Could not log in`);
  }
}
