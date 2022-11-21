# matcha - plan for our project 

*Stack:*
Node.js, Express, React, Redux, Material UI and PostgreSQL.
Socket.io for chat.


*Order of actions*:
SETUP
- set up database (mongodb, atlas), set up some "fake users" (ex: https://youtu.be/Q70IMS-Qnjk?t=850)
- installs and dependencies (delete extra files)
- set up files (client / server, within client the usual components, services ... and one index.css) and structure (pages: dashboard, bome, onboarding ...)

FRONT-END(JUST THE MINIMUM FIRST, COPY TINDER IF IN DOUBT)
- set up Router and routes on app.js
- Homepage UI
- Login / Auth
- onboarding (create account)
- dashboard (where you swipe, includes chat container)

BACK-END
- install dependencies: install express mongodb dotenv bcrypt cors uuid josnwebtoken (check notes/dependencies for exact list)
- index.js in backend - Route Express server
- Add "Signup" on backend where we add a user from UI to backend (insertOne())
- cookies after signing up (react-cookie)
- login for an existing user
- onboarding ( create full user)
- updating user (profile)
- getting one user (for potential match)
- getting users by gender
- Listing matches
- chat: display messages first, then add new, make sure they can chat only if both swiped
- add .env file for secrets: URI, 



*List of features:*
- User interface (nav, search, UI. )
User registration and login with email verification. 
User can edit his profile. 
User can search for other users.  
User can like other users. 
User can see who liked him. 
User can see who visited his profile. 
User can chat with other users. 
User can see who is online. 
Displaying other users according to the current user's country and interests. 
The ability to view other users profiles "The user are able to see several users at once". 
After liking, if the other user likes the current user back, they are able to chat. 
Chat room that saves conversations.  

