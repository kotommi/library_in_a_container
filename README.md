# library app
Graphql library app using a local mongodb instance

# Dev container
run these commands to populate the database


sudo docker compose -f docker-compose.dev.yml run backend bash

node populate-db.js

# Prod container
build the prod images and then run

sudo docker compose -f docker-compose.yml up