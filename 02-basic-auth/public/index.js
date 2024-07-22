const fetchSecretString = async () => {
  const response = await fetch("/api/authenticated")
  const body = await response.text()

  document.getElementById("secret-string").textContent = body
}

const logout = async () => {
  document.getElementById("secret-string").textContent = "Waiting for secret"

  await fetch("/api/logout")
}