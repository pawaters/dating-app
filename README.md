# matcha - plan for our project 

**How to set up**:
1) make sure you have Docker installed on your machine.
2) Clone the repository
3) Run docker-compose up --build in the root directory
4) Go to localhost:3000 in your browser for front end, localhost:3001 for backend

**Stack:**
Node.js, Express, React, Redux, Material UI and PostgreSQL.
Socket.io for chat. OAuth. Docker (docker-compose).
Architectural pattern: MVC. Basically:
- View: The react front end part, each with components for each part
- Models: db. (no ORM like Mongoose allowed by subject)
- Controllers: How you use the data and give it to frontend.
Design pattern: Single-Page Application.
- how to divide: front/back; define method and end points.
- Model for UI: https://tinder.com/
- Project Management: Jira: https://pawaters.atlassian.net/jira/core/projects/MA/board
- Style guide: Airbnb Javascript style guide, implemented thanks to Airbnb's ESLint config.


**Project constraints:**
Forbidden tech:
- ORM : we have to make our own request, no use ORMs
- Validators: do our owns, same
- User Accounts manager: do you own!
DB: has to be relational or graph-oriented (no Mongo - it is a document-oriented platform) --> PostgreSQL.

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

**API END POINTS (see services):** baseUrl = '/api/
baseUrl = '/
- login - POST, GET
- resetpassword - POST
- setnewpassword - POST

baseUrl = '/browsing/
- sorted - POST
- likeuser/:id - POST
- unlikeuser/:id - POST
- blockuser/:id - POST
- reportuser/:id - POST
- userlists - GET
- tags - GET
- profile/:id - GET

baseUrl = '/signup/
- / - POST
- verifyuser - POST

baseUrl = '/profile/
- / - GET
- deletepicture/:id - DELETE
- notifications - GET, DELETE
- notifications/:id - DELETE
- readnotification/:id - PATCH
- readnotifications - PATCH
- setprofilepic - POST
- imageupload - POST
- deletepicture/${PictureId} - DELETE
- deleteuser - DELETE
- setup - POST
- editsettings - POST
- changepassword - POST

baseUrl = '/chat/
- usernames - POST
- chat_connections - GET
- room_messages - POST
- check_username - POST

**List of pages/UI/components**
Pages/views (Single page application with different urls):
- home.js
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

In terms of UI/design, the goal is to make it look as close to tinder as possible:
- screenshots of what each page should look like:  https://docs.google.com/document/d/1c18F3lTgLd5f-Wyzs96uWyAMgPfUeKDstlJScuaYvVk/edit?usp=sharing

**Backend Structure**
- recommended file structure and explanations: https://medium.com/codechef-vit/a-better-project-structure-with-express-and-node-js-c23abc2d736f

--> read, and decide what is best for you, lets keep it simple.

**Database schema**
- Look at db/init.sql. To be adapted to our use case. 
- diagram: https://dbdiagram.io/d/638a0414bae3ed7c45445946

**best examples**
- github repos list: https://github.com/stars/pawaters/lists/matcha
- youtube list: https://youtube.com/playlist?list=PL4tYF4IwV9AtvZdZjP1cVs1p83KeMrEAn

**Summary of task division**
- Pierre: Frontend, organisation
- Joonas: Backend, testing
