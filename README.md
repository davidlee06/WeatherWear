**.env file template:**

```
posted in the gc there are private keys and passwords in this file
```

**Spin up container for database:**
Run these commands from the db folder inside of this project

-   docker build -t "weatherwear-db-image" .
-   docker run --name weatherwear-db-container -d -p 5432:5432 weatherwear-db-image
-   docker exec weatherwear-db-container psql -d postgres -f /script/init_db.sql;

**TODO:**

-   corner case where user token is expired, they try to add to locker and it says image was added to locker, but then when they go to locker it isn't there, fix that
-   Style the homepage city page and locker page
-   add links to all products
-   make the app a pwa for mobile
-   figure out how to do hosting
