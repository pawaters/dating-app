# matcha #

**Installation:**
Prep: Please make sure you have [Docker](https://www.docker.com/) installed on your machine.

1. Clone the repository: git clone https://github.com/pawaters/matcha
2. Start your docker app (or install if needed)
3. Add a .env file at the root directory level with the following info:

# Database
PORT=3001
PGUSER=postgres
PGDATABASE=matcha
PGPASSWORD=postgres
PGPORT=5432
PGHOST=db

# For email functions
EMAIL_ADDRESS={INCLUDE YOUR GMAIL ADDRESS}
EMAIL_PASSWORD={INCLUDE YOUR GMAIL ADDRESS}

4. Run `docker-compose up --build` in the root directory 
5. Go to `localhost:3000` in your browser, `localhost:3001` for the backend
6. To create users, go to script folder, Run `docker-compose up --build`. All fake user's password is Matcha1!

Bonus: if needed, clean up your docker if the "lack of space" docker error comes up:
- docker volume rm $(docker volume ls -qf dangling=true)
- docker rmi $(docker images -a -q) 
Careful, this will delete all you have going on your docker.

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

**UI**
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
