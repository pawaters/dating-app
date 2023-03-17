# dating app #

This a web app was created to replicate the functionalities of the dating app, Tinder, from scratch, for learning purposes and for showing our skills.

You can check it live here: 
http://ec2-13-48-249-22.eu-north-1.compute.amazonaws.com/

I recommend using one of our 500 generated users: 
- username: Nestor4
- Password: Matcha1!

Or you can create your own user by going to signup, creating your own user, with a profile pic, some interests, so you can get matched.

**Instructions for Installation on local**

If you prefer to install on your local machine and inspect the code live, here are the instructions to install.
Prep: Please make sure you have [Docker](https://www.docker.com/) running on your machine (or install if needed, use init_docker.sh script if not working)

1. git clone https://github.com/pawaters/dating-app
3. `docker-compose up --build` in the root directory (takes 3 minutes)
4. To create users, go to /script folder, Run `docker-compose up --build` (takes 3 minutes)
5. Go to `localhost:3000` in your browser, `localhost:8080` for db admin, All fake users' password is Matcha1!

**Stack:**

Node.js, Express, React, Redux, Material UI and PostgreSQL.
The main limitation is that we could not use ORM, Validators nor User Accounts manager - which we all did manually.
Socket.io for chat. Docker (docker-compose).
Architectural pattern: MVC. Basically:
- View: The react front end part, each with components for each part
- Models: db. (no ORM like Mongoose allowed by subject)
- Controllers: Mainly server/routes. How you use the data and give it to frontend.

Design pattern: Single-Page Application.
- Model for UI: https://tinder.com/
- Project Management: Jira: https://pawaters.atlassian.net/jira/core/projects/MA/board
- Style guide: Eslint standard, Full stack open style.

**fame rating**
- 5 pts for profile setup
- 2 pts per picture
- 1 pt per tag
- 10 points per like
- 5 points per match

**our strategy to display a list of suggestions**
We have a react component "recommended previews" that takes 2 inputs: 
- max browsing criteria, in store (age, fame, distance)
- filtered users, in state --> according to sex orientation, a max distance
then with at least one common tag, then those are sorted by dividing the distance from the user by the amount of common tags to the power of 2.
This is the default "recommended" sort. 

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

**Database schema**: https://dbdiagram.io/d/638a0414bae3ed7c45445946

