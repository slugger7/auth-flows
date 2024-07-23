# API key Authentication

- Used for system to system communication
- Should not be used on frontends

## Instructions

1. `npm i`
1. `npm run start`
1. In [rest.http](./rest.http) send the request to create the token
1. Send the request to get the authenticated data
1. Send the request to invalidate the token
1. Send the request to fetch authenticated data

## Notes

- Add logout button
- In order to truly have distributed trust JWK should be used (public key authentication)
- To prevent token expiry join the refresh token flow with this flow
