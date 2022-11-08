# chat-app

chat-app is a messaging Application through you can chat with your friends.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Packages.

```bash
#run this command to install all dependences.
   npm i -g
```
## Dependencies
use the package [socket.io](https://socket.io/) for sending and receiving real time messages.

use the package [redis](https://redis.io/) as a primary database.

use the package [compression](https://www.npmjs.com/package/compression) to compress response bodies for all request that traverse through the middleware.

use the package [node-schedule](https://www.npmjs.com/package/node-schedule) for job scheduler as updation of redis dat into MongoDB

use the package [passport](https://www.npmjs.com/package/passport) for login with Google, Facebook and local.
  
use the package [express-session](https://www.npmjs.com/package/express-session) for maintaing session.

use the package [bcrypt](https://www.npmjs.com/package/bcrypt) for encrypt and decrpt password.

use the package [mongoose](https://www.npmjs.com/package/mongoose) for MongoDB connection.

use the package [winston](https://www.npmjs.com/package/winston) for logging purpose.

use the package [passport-local](https://www.npmjs.com/package/passport-local) for local registration with passport

use the package [passport-facebook](https://www.npmjs.com/package/passport-facebook) for login with Facebook.

use the package [passport-google-oauth2](https://www.npmjs.com/package/passport-google-oauth2) for login with google.
## Usage

```python
Run App by run "Node index.js" in project directory

 #End point for normal register.
    http://localhost:5000/register
 #End point for login.
    http://localhost:5000/login
 #End point for open with gmail:
    http://localhost:5000/google
 #End point for open with facebook:
    http://localhost:5000/login/fb
 #End point for enter patner name:
    http://localhost:5000/
 #End point for chat:
    http://localhost:5000/chat
```

## About
 In this application there is a register view where you can register your self and login next time and there is two more register option register through gmail and facebook. After that a view open with your name as first heading and a two textbox where you have to enter your partner name with you want to chat. after that new page open where you can send and review messages..