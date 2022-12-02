# matcha - plan for our project 

**How to set up**:
1) make sure you have Docker installed on your machine.
2) Clone the repository
3) Run docker-compose up --build in the root directory
4) Go to localhost:3000 in your browser for front end, localhost:3001 for backend


**Stack:**
Node.js, Express, React, Redux, Material UI and PostgreSQL.
Socket.io for chat.
OAuth for 
Architectural pattern: MVC. Basically:
- View: The react front end part, each with components for each part
- Models: db. (no ORM like Mongoose allowed by subject)
- Controllers: How you use the data and give it to frontend.
Design pattern: Single-Page Application.
- how to divide: front/back; define method and end points.
- Model for UI: https://tinder.com/

**Project constraints:**
Forbidden tech:
- ORM : we have to make our own request, no use ORMs
- Validators: do our owns, same
- User Accounts manager: do you own!
DB: has to be relational or graph-oriented (no Mongo - it is a document-oriented platform) --> PostgreSQL.


**Order of actions**:
IN GENERAL:
- start with structure
- then do each file with comments first
- divide into component, do code bit by bit

SETUP
- set up database (mongodb, atlas), set up some "fake users" (ex: https://youtu.be/Q70IMS-Qnjk?t=850)
- installs and dependencies (delete extra files)
- set up files (client / server, within client the usual components, services ... and one index.css) and structure (pages: dashboard, bome, onboarding ...)

FRONT-END(JUST THE MINIMUM FIRST, COPY TINDER IF IN DOUBT)
- design front on paper, basing it on tinder, but without adding any bonuses
- screenshots of end result UI we want

- set up Router and routes on app.js (switch?)
- set up as comments the structure of the react components on App.js
use Material UI to fill it up to start with
- check npmjs for examples in https://www.npmjs.com/search?q=tinder

- Homepage UI
- Login / Auth
- onboarding (create account)
- dashboard (where you swipe, includes chat container)

BACK-END
- write down 
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


**List of features - summary of subject:**
- User interface (nav, search, UI. )
- User registration and login with email verification. 
- User can edit his profile. 
- ser can search for other users.  
- User can like other users. 
- User can see who liked him. 
- User can see who visited his profile. 
- User can chat with other users. 
- User can see who is online. 
- Displaying other users according to the current user's country and interests. 
- The ability to view other users profiles "The user are able to see several users at once". 
- After liking, if the other user likes the current user back, they are able to chat. 
- Chat room that saves conversations (maybe not needed).  

**ROUTES**

/api/login - POST, GET
/api/browsing/sorted - POST
/api/browsing/likeuser/:id - POST
/api/resetpassword - POST
/api/setnewpassword - POST
/api/signup - POST
/api/signup/verifyuser - POST
/api/profile/deletepicture/:id - DELETE
/api/profile/notifications - GET
/api/chat/chat_connections - GET
/api/chat/room_messages - POST

**List of pages/UI/components**
Pages/views (Single page application with different urls):
- signup.js
- profileSetUpForm.js
- profile.js
- browsing.js
- chat.js

General Components:
- navbar
- footer
- login
- logout
- notification (part of navbar)
- PathNotExists

In terms of UI/design, my goal is to make it look as close to tinder as possible:
- screenshots of what each page should look like:  https://docs.google.com/document/d/1c18F3lTgLd5f-Wyzs96uWyAMgPfUeKDstlJScuaYvVk/edit?usp=sharing

