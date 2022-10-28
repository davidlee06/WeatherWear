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

-   corner case where user token is expired, they try to add to locker and it says image was added to locker, but then when they go to locker it isn't there, fix that
-   Style the homepage city page and locker page
-   add links to all products
-   make the app a pwa for mobile
-   figure out how to do hosting
