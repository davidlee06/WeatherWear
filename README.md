Database commands:
docker build -t "weatherwear-db-image" .
docker run --name weatherwear-db -d -p 5432:5432 weatherwear-db-image
docker exec weatherwear-db psql -f /script/init_db.sql
