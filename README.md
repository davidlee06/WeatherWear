**.env file template:**
place the .env in the project folder, and then make sure it's added with the dot, sometimes windows gets rid of the dot in front of env.

```
posted in the gc there are private keys and passwords in this file
```

**Spin up container for database:**
Run these commands from the db folder inside of this project

-   docker build -t "weatherwear-db-image" .
-   docker run --name weatherwear-db-container -d -p 5432:5432 weatherwear-db-image
-   docker exec weatherwear-db-container psql -d postgres -f /script/init_db.sql;

After these steps are completed, run

-   yarn start
    from the context of /"pathname"/WeatherWear
    If that doesn't work run it from /"pathname"/WeatherWear/server
    **TODO:**
-   deploy on ciclic and use their database that comes with project
-   if that doesn't work use glitch and cockroach db to deploy
-   other options to host the backend are vercel
-   add a list of my favorite cities if you are on the home page and logged in and options to add/remove them
-   add/save will be on the city page and then you can remove the home page
-   for 0-10 and 10-20 options if its raining add umbrellas and like some kind of rain boots to the fits
