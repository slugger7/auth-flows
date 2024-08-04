# HTTP Only Cookie Authentication

- Same as normal cookie authentication
- Javascript cant access the cookie though

## Instructions

1. `npm i`
1. `npm run start`
1. In browser head to the [app](http://localhost:3000)
1. Login using username: admin password: pass
1. Click Fetch authenticated Data
1. Cookie will expire after 20 seconds (can be set in [.env](./.env))
1. Run in browser console `getCookie()` (it will fail to get the cookie)
