#!/bin/bash

mkdir -p ./data/db
mongod --dbpath ./data/db&

echo 'db restart success';