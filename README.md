# matcha - plan for our project 

**How to set up**:
1) make sure you have Docker installed on your machine.

2) Clone the repository
3) Run docker-compose up --build in the root directory
4) Go to localhost:3000 in your browser for front end, localhost:3001 for backend


**Stack:**
Node.js, Express, React, Redux, Material UI and PostgreSQL.
Socket.io for chat.
Architectural pattern: MVC. Basically:
- View: The react front end part, each with components for each part
- Models: db. (no ORM like Mongoose allowed by subject)
- Controllers: How you use the data and give it to frontend.
Design pattern: Single-Page Application.
Forbidden tech:
- ORM : we have to make our own request, no use ORMs
- Validators: do our owns, same
- User Accounts manager: do you own!
DB: has to be relational or graph-oriented (no Mongo - it is a document-oriented platform) --> PostgreSQL.
- how to divide: front/back; define method and end points.
- Model for UI: https://tinder.com/


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

**Questions**
- can you go through your stack choices and reasoning behind?
- Start with APP js, descirbe routes, components, choices, then backend
- which state in store you used to keep track of stuff?
    - authSlice
    - 
- how did you organise your css - one main then some tailwin with each element?
- How did you do your own queries without ORM ? can you show me your DB ? 
- did you define the objects you will use before?
- we are not allowed ORMs, Validators, User Account managers. How about react-tinder-card from npmjs?

- What list of todos would you use to do the project? (review ours, right order?)
- What main sources/examples would you use?
- What was the hardest?
- What would you do differently?
- how to ensure my partner has same environment to work on - docker or just make sure installs are the same?
- can go through your file structure and explain what is in each and what was the reasoning?
- why and how MCV ?
- how did you choose your front end ? did you draw?
- how did define your the MVC elements?

**Notes from Javi call**
- docker compose down/up  (LOOK IT UP)
- look at login.js and routes
- react-collapse from npmjs 
- use a query builder for seeding the db with knex
- store in cookie or local storage (careful with refresh and states)
- insomnia to test Restful api (or Postman)



