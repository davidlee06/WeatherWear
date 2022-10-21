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

-   Style the homepage city page and locker page
- add links to all products

- add "add to locker buttton" if user is signed in and on the city page

