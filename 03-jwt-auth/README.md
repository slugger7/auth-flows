# JWT Authentication

- JSON Web Token: Pronounced: JOT but somehow I can't soo J.W.T. it is
- What you have
- Protect it

## Authentication vs Authorization

### Authentication: 401

Do you have valid credentials to access whatever is protected?

Reset the system to original state requiring login

### Authorization: 403

You have valid credentials but are you allowed to access this part of the system

Display a message or redirect user to an authorized part of the system

## Instructions

1. `npm run start`
1. In browser head to the [app](http://localhost:3000)
1. Login using username: admin password: pass
1. Click fetch authenticated Data

## Notes:

- Create logout button