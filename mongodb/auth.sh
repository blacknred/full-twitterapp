#!/bin/bash

# Application Database User
MONGO_DB=${MONGO_DB:-"admin"}
MONGO_USER=${MONGO_USER:-"admin"}
MONGO_PASSWORD=${MONGO_PASSWORD:-"admin"}

# Wait for MongoDB to boot
RET=1
while [[ RET -ne 0 ]]; do
  echo "=> Waiting for confirmation of MongoDB service startup..."
  sleep 5
  mongo admin --eval "help" >/dev/null 2>&1
  RET=$?
done

# Create the admin user
echo "=> Creating admin user with a password in MongoDB"
mongo admin --eval "db.createUser({user: 'admin', pwd: 'admin', roles:[{role:'root',db:'admin'}]});"

sleep 3

# If we've defined the MONGO_DB environment variable and it's a different database
# than admin, then create the user for that database.
# First it authenticates to Mongo using the admin user it created above.
# Then it switches to the REST API database and runs the createUser command
# to actually create the user and assign it to the database.
if [ "$MONGO_DB" != "admin" ]; then
  echo "=> Creating a ${MONGO_DB} database user with a password in MongoDB"
  mongo admin -u admin -p admin <<EOF
echo "Using $MONGO_DB database"
use $MONGO_DB
db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles:[{role:'dbOwner', db:'$MONGO_DB'}]})
EOF
fi

sleep 1

# If everything went well, add a file as a flag so we know in the future to not re-create the
# users if we're recreating the container (provided we're using some persistent storage)
touch /data/db/.mongodb_password_set

echo "MongoDB configured successfully. You may now connect to the DB."
