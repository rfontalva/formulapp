#!/bin/bash

export PATH=/bin:/usr/bin:/usr/local/bin

DB_BACKUP_PATH='/backup/dbbackup'
MYSQL_HOST='localhost'
MYSQL_PORT='3306'
MYSQL_USER='root'
MYSQL_PASSWORD=$1
DATABASE_NAME='formulapp'
WD=$(pwd)
VERSION_PATH="${WD}/version.txt"

read -r DBVersion < "${VERSION_PATH}"

for filename in "${WD}/../../migrations"/*
do
    CURRENT_VERSION=$(basename "$filename"| sed 's/\.[^.]*$//' )
    if [[ "$CURRENT_VERSION" > "$DBVersion" ]]; then
        while read line; do 
            mysql -h ${MYSQL_HOST} \
            -P ${MYSQL_PORT} \
            -u ${MYSQL_USER} \
            -p${MYSQL_PASSWORD} \
            -D ${DATABASE_NAME} \
            -e "$line"
        done < "$filename"
        NEW_VERSION="$CURRENT_VERSION"
        echo "$NEW_VERSION" > "${VERSION_PATH}"
    fi
done

#  > "${VERSION_PATH}"
