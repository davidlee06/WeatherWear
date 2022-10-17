**.env file template:**
```
APIKEY=294e262744e0da66d38e517c095e60eb
PORT=80
DEBUG=true
PGUSER=root
PGHOST=localhost
PGDATABASE=postgres
PGPASSWORD=root
PGPORT=5432
```

**Spin up container for database:**
* docker build -t "weatherwear-db-image" .
* docker run --name weatherwear-db-container -d -p 5432:5432 weatherwear-db-image
* docker exec weatherwear-db-container psql -d postgres -f /script/init_db.sql;

