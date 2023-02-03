# matcha #

This a web app created to replicate the functionalities of Tinder, from scratch, to learn and show our skills

**Installation:**
Prep: Please make sure you have [Docker](https://www.docker.com/) running on your machine (or install if needed, use init_docker.sh script if not working)

1. git clone https://github.com/pawaters/matcha
3. `docker-compose up --build` in the root directory (takes 3 minutes)
4. To create users, go to /script folder, Run `docker-compose up --build` (takes 3 minutes)
5. Go to `localhost:3000` in your browser, `localhost:8080` for db admin, All fake users' password is Matcha1!

**Stack:**
Node.js, Express, React, Redux, Material UI and PostgreSQL.
Socket.io for chat. Docker (docker-compose).
Architectural pattern: MVC. Basically:
- View: The react front end part, each with components for each part
- Models: db. (no ORM like Mongoose allowed by subject)
- Controllers: Mainly server/routes. How you use the data and give it to frontend.

Design pattern: Single-Page Application.
- Model for UI: https://tinder.com/
- Project Management: Jira: https://pawaters.atlassian.net/jira/core/projects/MA/board
- Style guide: Eslint standard, Full stack open style.


**Project constraints:**
Forbidden tech: ORM, Validators,User Accounts manager: do your own!
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

**UI**
In terms of UI/design, the goal is to make it look as close to tinder as possible:
- screenshots of what each page should look like:  https://docs.google.com/document/d/1c18F3lTgLd5f-Wyzs96uWyAMgPfUeKDstlJScuaYvVk/edit?usp=sharing

**Backend Structure**
- recommended file structure: https://medium.com/codechef-vit/a-better-project-structure-with-express-and-node-js-c23abc2d736f

**Database schema**
- db/init.sql. 
- diagram: https://dbdiagram.io/d/638a0414bae3ed7c45445946

**best examples**
- github repos list: https://github.com/stars/pawaters/lists/matcha
- youtube list: https://youtube.com/playlist?list=PL4tYF4IwV9AtvZdZjP1cVs1p83KeMrEAn

**Summary of task division**
- Pierre: Frontend, organisation
- Joonas: Backend, testing

**Bonuses**
- Little green point when a user is live and connected in browsing view
- Browsing sorted by country by default
- jira organisation
- UI general theme
- Redux store
- delete user
- delete notif / marking read/unread / clear
- delete image
- all dockerized, even user creation script
- in browsing, amounts of results per page
