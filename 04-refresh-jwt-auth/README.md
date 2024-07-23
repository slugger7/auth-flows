# Refresh JWT Authentication

- One short lived token: `accessToken`
- One longer lived token: `refreshToken`
- Before access token expires, use the refresh token to request a new access token
- Get a new `accessToken` and `refreshToken`
- Replace both the tokens
- Infinite login (unless someone steals your refresh token)

## Instructions

1. `npm i`
1. `npm run start`
1. In browser head to the [app](http://localhost:3000)
1. Login using username: admin password: pass
1. Click Fetch authenticated Data
1. Save the current refresh token
1. Wait for a few refresh cycles (more than 8s)
1. Inject saved refresh token

## Notes

- Create logout button
- Clear interval not working
